"""
RAG Pipeline for Course Documents.

This script implements a Retrieval-Augmented Generation (RAG) pipeline for 
course documents using local free models and tools.
"""
import os
import json
import glob
import subprocess
from typing import List, Dict, Any

import fitz  # PyMuPDF
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Constants
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
MODEL_NAME = "all-MiniLM-L6-v2"  # Free, lightweight model available in sentence-transformers
CHUNK_SIZE = 1000  # Number of characters per chunk
CHUNK_OVERLAP = 200  # Number of characters overlapping between chunks

# Prompt template for the LLM
PROMPT_TEMPLATE = """
You are an academic assistant helping summarize university-level course documents. These include exams, quizzes, and assignments. Based on the provided document content, extract structured insights using the format below.

{document_content}

Return only a valid JSON object with the following format:

{{
  "response": {{
    "answer": "A natural language summary that combines insights from the documents.",
    "topicsCovered": [ "Topic 1", "Topic 2" ],
    "questionTypes": [ "Proof", "Multiple Choice", "Derivation" ],
    "studySuggestions": [ "Review problem types from Quiz1.pdf", "Focus on derivations in Exam2022.pdf" ],
    "documentLinks": [
      {{ "documentName": "Quiz1.pdf", "documentUrl": "http://localhost/data/CIV102/Quiz1.pdf" }},
      {{ "documentName": "Exam2022.pdf", "documentUrl": "http://localhost/data/CIV102/Exam2022.pdf" }}
    ]
  }}
}}
"""


class Document:
    """Represents a document with its metadata and content."""
    
    def __init__(self, path: str, content: str):
        self.path = path
        self.content = content
        self.filename = os.path.basename(path)
        self.course_code = os.path.basename(os.path.dirname(path))
        self.url = f"http://localhost/data/{self.course_code}/{self.filename}"


def extract_text(pdf_path: str) -> str:
    """
    Extract text from a PDF file.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Extracted text from the PDF
    """
    try:
        doc = fitz.open(pdf_path)
        text = "\n".join(page.get_text() for page in doc)
        return text
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, chunk_overlap: int = CHUNK_OVERLAP) -> List[str]:
    """
    Split text into chunks for processing.
    
    Args:
        text: Text to chunk
        chunk_size: Size of each chunk in characters
        chunk_overlap: Overlap between chunks in characters
        
    Returns:
        List of text chunks
    """
    if not text:
        return []
        
    chunks = []
    for i in range(0, len(text), chunk_size - chunk_overlap):
        chunk = text[i:i + chunk_size]
        if chunk:
            chunks.append(chunk)
    
    return chunks


def process_course_pdfs(course_code: str) -> List[Document]:
    """
    Process all PDFs for a given course code.
    
    Args:
        course_code: Course code to process
        
    Returns:
        List of Document objects
    """
    course_dir = os.path.join(DATA_DIR, course_code)
    pdf_files = glob.glob(os.path.join(course_dir, "*.pdf"))
    
    documents = []
    for pdf_path in pdf_files:
        text = extract_text(pdf_path)
        if text:
            documents.append(Document(pdf_path, text))
    
    return documents


def create_vector_store(documents: List[Document]) -> tuple:
    """
    Create a FAISS vector store from documents.
    
    Args:
        documents: List of Document objects
        
    Returns:
        Tuple of (FAISS index, embedder model, document chunks, document mapping)
    """
    model = SentenceTransformer(MODEL_NAME)
    
    # Create document chunks
    chunks = []
    chunk_to_doc_map = {}
    
    for i, doc in enumerate(documents):
        doc_chunks = chunk_text(doc.content)
        for j, chunk in enumerate(doc_chunks):
            chunk_id = len(chunks)
            chunks.append(chunk)
            chunk_to_doc_map[chunk_id] = i
    
    # Create embeddings
    if not chunks:
        print("No chunks to embed")
        return None, None, [], {}
        
    embeddings = model.encode(chunks, convert_to_tensor=False)
    
    # Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings).astype('float32'))
    
    return index, model, chunks, chunk_to_doc_map


def query_vector_store(query: str, index, model, chunks: List[str], top_k: int = 5) -> List[str]:
    """
    Query the vector store for relevant chunks.
    
    Args:
        query: Query string
        index: FAISS index
        model: SentenceTransformer model
        chunks: List of text chunks
        top_k: Number of top results to retrieve
        
    Returns:
        List of relevant text chunks
    """
    query_embedding = model.encode([query], convert_to_tensor=False)
    scores, indices = index.search(np.array(query_embedding).astype('float32'), k=top_k)
    
    results = []
    for idx in indices[0]:
        if idx < len(chunks):
            results.append(chunks[idx])
    
    return results


def run_local_llm(prompt: str, model_name: str = "mistral") -> str:
    """
    Run a query through a local LLM using Ollama.
    
    Args:
        prompt: Prompt to send to the LLM
        model_name: Name of the model to use
        
    Returns:
        LLM response
    """
    try:
        # Using Ollama CLI
        result = subprocess.run(
            ["ollama", "run", model_name, prompt],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError:
        # Fallback to llm CLI if available
        try:
            result = subprocess.run(
                ["llm", "chat", "--model", model_name, "--system", prompt],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout
        except (subprocess.CalledProcessError, FileNotFoundError):
            return "Error running local LLM. Make sure Ollama or llm CLI is installed."


def parse_response(response_text: str) -> Dict[str, Any]:
    """
    Parse the JSON response from the LLM.
    
    Args:
        response_text: Raw text response from the LLM
        
    Returns:
        Parsed JSON data or error
    """
    try:
        # First try to parse as pure JSON
        return json.loads(response_text.strip())
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        try:
            # Look for JSON block in markdown
            if "```json" in response_text:
                json_text = response_text.split("```json")[1].split("```")[0]
                return json.loads(json_text.strip())
            elif "```" in response_text:
                # Try any code block
                json_text = response_text.split("```")[1].split("```")[0]
                return json.loads(json_text.strip())
            else:
                # Last attempt: find curly braces
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                if start >= 0 and end > start:
                    return json.loads(response_text[start:end])
                else:
                    return {"error": "Could not parse JSON from response"}
        except (json.JSONDecodeError, IndexError):
            return {"error": "Could not parse JSON", "raw_response": response_text}


def process_query(query: str, course_code: str) -> Dict[str, Any]:
    """
    Process a query for a specific course.
    
    Args:
        query: User query
        course_code: Course code to query
        
    Returns:
        JSON response
    """
    # Get documents for the course
    documents = process_course_pdfs(course_code)
    if not documents:
        return {"error": f"No documents found for course {course_code}"}
    
    # Create vector store
    vector_store = create_vector_store(documents)
    if not vector_store[0]:
        return {"error": "Failed to create vector store"}
    
    index, model, chunks, chunk_to_doc_map = vector_store
    
    # Query vector store
    relevant_chunks = query_vector_store(query, index, model, chunks)
    if not relevant_chunks:
        return {"error": "No relevant content found for the query"}
    
    # Prepare document content for the LLM
    document_content = "\n".join(relevant_chunks)
    
    # Create prompt for the LLM
    prompt = PROMPT_TEMPLATE.format(document_content=document_content)
    
    # Run local LLM
    llm_response = run_local_llm(prompt)
    
    # Parse response
    parsed_response = parse_response(llm_response)
    
    # Add document links if not present
    if "response" in parsed_response and "documentLinks" not in parsed_response["response"]:
        parsed_response["response"]["documentLinks"] = [
            {"documentName": doc.filename, "documentUrl": doc.url}
            for doc in documents[:5]  # Limit to 5 documents
        ]
    
    return parsed_response


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="RAG Pipeline for Course Documents")
    parser.add_argument("--course", required=True, help="Course code to query")
    parser.add_argument("--query", default="Summarize the course materials", 
                        help="Query to run (default: 'Summarize the course materials')")
    parser.add_argument("--output", help="Output file path (JSON)")
    
    args = parser.parse_args()
    
    print(f"Processing query '{args.query}' for course {args.course}")
    result = process_query(args.query, args.course)
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"Results written to {args.output}")
    else:
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main() 