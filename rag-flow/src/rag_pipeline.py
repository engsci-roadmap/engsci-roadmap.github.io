"""
RAG Pipeline for Course Documents with Question-Level Topic Tagging.

This script implements a Retrieval-Augmented Generation (RAG) pipeline for 
course documents using local free models and tools. It extracts individual questions
from assignments, tests, and exams, and tags them with topic, question type, and source.
"""
import os
import json
import glob
import subprocess
from typing import List, Dict, Any, Tuple

import fitz  # PyMuPDF
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Constants
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
MODEL_NAME = "all-MiniLM-L6-v2"  # Free, lightweight model available in sentence-transformers
CHUNK_SIZE = 1000  # Number of characters per chunk
CHUNK_OVERLAP = 200  # Number of characters overlapping between chunks

# Prompt template for the LLM - updated for question-level tagging
PROMPT_TEMPLATE = """
You are an academic assistant helping analyze university-level course documents. These include exams, tests, assignments, and quizzes.

IMPORTANT: Extract ONLY REAL questions that actually appear in the provided document text below. DO NOT invent or make up questions. If you cannot find clear questions in the text, return an empty list.

For each real question you find in the text, extract:
1. The exact question text as it appears in the document
2. The main topics it tests (based on the question content)
3. The question type (proof, calculation, conceptual, multiple choice, etc.)
4. The source document name (provided at the beginning of each document chunk)

Document text to analyze:
{document_content}

Return only a valid JSON object with the following format:

{{
  "response": {{
    "taggedQuestions": [
      {{
        "questionText": "The exact question text from the document",
        "topicsTested": ["Topic 1", "Topic 2"],
        "questionType": "The question type",
        "source": "The source filename"
      }}
    ]
  }}
}}

If no clear questions are found, return an empty list of taggedQuestions.
"""


class Document:
    """Represents a document with its metadata and content."""
    
    def __init__(self, path: str, content: str):
        self.path = path
        self.content = content
        self.filename = os.path.basename(path)
        self.course_code = os.path.basename(os.path.dirname(path))
        self.url = f"http://localhost/data/{self.course_code}/{self.filename}"


class DocumentChunk:
    """Represents a chunk of text from a document with source metadata."""
    
    def __init__(self, text: str, source_doc: Document):
        self.text = text
        self.source_doc = source_doc


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


def chunk_text(text: str, source_doc: Document, chunk_size: int = CHUNK_SIZE, 
              chunk_overlap: int = CHUNK_OVERLAP) -> List[DocumentChunk]:
    """
    Split text into chunks for processing, preserving source document info.
    
    Args:
        text: Text to chunk
        source_doc: Source document object
        chunk_size: Size of each chunk in characters
        chunk_overlap: Overlap between chunks in characters
        
    Returns:
        List of DocumentChunk objects
    """
    if not text:
        return []
        
    chunks = []
    for i in range(0, len(text), chunk_size - chunk_overlap):
        chunk_text = text[i:i + chunk_size]
        if chunk_text:
            chunks.append(DocumentChunk(chunk_text, source_doc))
    
    return chunks


def process_course_pdfs(course_code: str, max_documents: int = None) -> List[Document]:
    """
    Process PDFs for a given course code, optionally limiting the number of documents.
    
    Args:
        course_code: Course code to process
        max_documents: Maximum number of documents to process (None for all)
        
    Returns:
        List of Document objects
    """
    course_dir = os.path.join(DATA_DIR, course_code)
    pdf_files = glob.glob(os.path.join(course_dir, "*.pdf"))
    
    # Sort files to ensure consistent results when limiting documents
    pdf_files.sort()
    
    # Limit number of documents if specified
    if max_documents is not None and max_documents > 0:
        pdf_files = pdf_files[:max_documents]
        print(f"Using {len(pdf_files)} out of {len(glob.glob(os.path.join(course_dir, '*.pdf')))} documents")
    
    documents = []
    for pdf_path in pdf_files:
        text = extract_text(pdf_path)
        if text:
            documents.append(Document(pdf_path, text))
    
    return documents


def create_vector_store(documents: List[Document]) -> tuple:
    """
    Create a FAISS vector store from documents, preserving source information.
    
    Args:
        documents: List of Document objects
        
    Returns:
        Tuple of (FAISS index, embedder model, document chunks list, chunk IDs)
    """
    model = SentenceTransformer(MODEL_NAME)
    
    # Create document chunks with source metadata
    doc_chunks = []
    
    for doc in documents:
        chunks = chunk_text(doc.content, doc)
        doc_chunks.extend(chunks)
    
    # Create embeddings for the text portion of chunks
    if not doc_chunks:
        print("No chunks to embed")
        return None, None, [], {}
    
    chunk_texts = [chunk.text for chunk in doc_chunks]
    embeddings = model.encode(chunk_texts, convert_to_tensor=False)
    
    # Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings).astype('float32'))
    
    return index, model, doc_chunks, None


def query_vector_store(query: str, index, model, doc_chunks: List[DocumentChunk], top_k: int = 10) -> List[DocumentChunk]:
    """
    Query the vector store for relevant chunks, preserving source metadata.
    
    Args:
        query: Query string
        index: FAISS index
        model: SentenceTransformer model
        doc_chunks: List of DocumentChunk objects
        top_k: Number of top results to retrieve (increased to 10)
        
    Returns:
        List of relevant DocumentChunk objects
    """
    query_embedding = model.encode([query], convert_to_tensor=False)
    scores, indices = index.search(np.array(query_embedding).astype('float32'), k=top_k)
    
    results = []
    for idx in indices[0]:
        if idx < len(doc_chunks):
            results.append(doc_chunks[idx])
    
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


def format_chunk_with_source(chunk: DocumentChunk) -> str:
    """
    Format a document chunk with its source information for the LLM.
    
    Args:
        chunk: DocumentChunk object
        
    Returns:
        Formatted text with source annotation
    """
    return f"Document: {chunk.source_doc.filename}\n\n{chunk.text}\n\n---\n\n"


def process_query(query: str, course_code: str, max_documents: int = None, top_k: int = 15) -> Dict[str, Any]:
    """
    Process a query for a specific course to extract and tag questions.
    
    Args:
        query: User query
        course_code: Course code to query
        max_documents: Maximum number of documents to process (None for all)
        top_k: Number of top chunks to retrieve
        
    Returns:
        JSON response with tagged questions
    """
    # Get documents for the course
    documents = process_course_pdfs(course_code, max_documents)
    if not documents:
        return {"error": f"No documents found for course {course_code}"}
    
    # Create vector store
    vector_store = create_vector_store(documents)
    if not vector_store[0]:
        return {"error": "Failed to create vector store"}
    
    index, model, doc_chunks, _ = vector_store
    
    # Query vector store with more chunks to ensure we capture questions
    relevant_chunks = query_vector_store(query, index, model, doc_chunks, top_k=top_k)
    if not relevant_chunks:
        return {"error": "No relevant content found for the query"}
    
    # Prepare document content for the LLM with source annotations
    document_content = "\n".join(format_chunk_with_source(chunk) for chunk in relevant_chunks)
    
    # Create prompt for the LLM
    prompt = PROMPT_TEMPLATE.format(document_content=document_content)
    
    # Run local LLM
    llm_response = run_local_llm(prompt)
    
    # Parse response
    parsed_response = parse_response(llm_response)
    
    # Ensure we have the expected structure
    if "response" in parsed_response and "taggedQuestions" not in parsed_response["response"]:
        # Add empty taggedQuestions if not present
        parsed_response["response"]["taggedQuestions"] = []
    
    return parsed_response


def save_tagged_questions(course_code: str, tagged_questions: List[Dict]) -> str:
    """
    Save tagged questions to a JSON file in the course directory.
    
    Args:
        course_code: Course code
        tagged_questions: List of tagged question objects
        
    Returns:
        Path to the saved file
    """
    output_dir = os.path.join(DATA_DIR, course_code)
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, "tagged_questions.json")
    
    with open(output_file, 'w') as f:
        json.dump({"taggedQuestions": tagged_questions}, f, indent=2)
    
    return output_file


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="RAG Pipeline for Question-Level Topic Tagging")
    parser.add_argument("--course", required=True, help="Course code to query")
    parser.add_argument("--query", default="Extract and tag all questions", 
                        help="Query to run (default: 'Extract and tag all questions')")
    parser.add_argument("--output", help="Output file path (JSON)")
    parser.add_argument("--save", action="store_true", 
                        help="Save output to data/<course_code>/tagged_questions.json")
    parser.add_argument("--max-documents", type=int, 
                        help="Maximum number of documents to process (default: all)")
    parser.add_argument("--top-k", type=int, default=15,
                        help="Number of chunks to retrieve (default: 15)")
    
    args = parser.parse_args()
    
    print(f"Processing query '{args.query}' for course {args.course}")
    result = process_query(
        query=args.query, 
        course_code=args.course, 
        max_documents=args.max_documents,
        top_k=args.top_k
    )
    
    if args.save and "response" in result and "taggedQuestions" in result["response"]:
        output_file = save_tagged_questions(args.course, result["response"]["taggedQuestions"])
        print(f"Tagged questions saved to {output_file}")
    
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"Results written to {args.output}")
    else:
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main() 