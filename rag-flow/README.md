# RAG Pipeline for Course Documents with Question-Level Topic Tagging

## Overview

Retrieval-Augmented Generation (RAG) is a hybrid NLP pipeline that combines retrieval-based methods with generative language models. RAG enhances the capabilities of Large Language Models (LLMs) by grounding their responses in factual, external knowledge retrieved from a corpus of documents. This approach is particularly valuable in domain-specific contexts like academic documents, where factual accuracy and relevance are crucial.

The core components of a RAG system include:

- A **retriever** (FAISS in this implementation) that efficiently searches through a corpus of documents
- An **embedder** (Sentence Transformers) that converts text into dense vector representations
- A **generator** (local LLM via Ollama) that synthesizes coherent responses from retrieved information

This pipeline's high-level goal is to extract individual questions from academic PDFs (such as exams, assignments, and quizzes) and tag them with topics, question type, and source metadata, enabling more effective organization and retrieval of educational content.

## Understanding FAISS from First Principles

FAISS (Facebook AI Similarity Search) is a library that provides efficient similarity search and clustering of dense vectors. In the context of our RAG pipeline:

### Vector Spaces and Similarity

- Text documents are converted into high-dimensional vectors (embeddings) where semantically similar texts are positioned closer together in the vector space
- FAISS allows efficient nearest neighbor search in this high-dimensional space using various distance metrics (L2 distance in our implementation)
- Rather than comparing raw texts, we compare their vector representations, which captures semantic relationships beyond exact keyword matching

### Index Types and Search Efficiency

- FAISS provides different index types optimized for different scenarios:
  - `IndexFlatL2`: Exact search using L2 (Euclidean) distance, used in our implementation for precise retrieval
  - Other indexes (not used here) like `IndexIVFFlat` or `IndexHNSW` offer approximate but faster search for larger datasets

### How FAISS Works in This Pipeline

1. The `create_vector_store` function initializes a FAISS index with the dimensionality of our embeddings
2. Document chunks are embedded via the Sentence Transformer model
3. These embeddings are added to the index via `index.add()`
4. When querying, `index.search()` efficiently finds the nearest neighbors to the query embedding

This vector-based search allows us to retrieve documents based on semantic similarity rather than exact keyword matching, improving the relevance of retrieved context for our LLM.

## Pipeline Functions and Flow

### 1. Document Loading and Representation

The pipeline starts with the `process_course_pdfs` function, which:

- Locates PDF files for a specific course using `glob`
- Extracts text via `extract_text`, which uses PyMuPDF (imported as `fitz`)
- Creates `Document` objects that contain:
  - Path to the source PDF
  - Extracted text content
  - Metadata like filename and course code

```python
class Document:
    def __init__(self, path: str, content: str):
        self.path = path
        self.content = content
        self.filename = os.path.basename(path)
        self.course_code = os.path.basename(os.path.dirname(path))
```

### 2. Document Chunking and Preprocessing

The `chunk_text` function:

- Splits document text into overlapping chunks to preserve context
- Associates each chunk with its source document using the `DocumentChunk` class
- Uses configurable parameters `CHUNK_SIZE` (1000 chars) and `CHUNK_OVERLAP` (200 chars)

```python
class DocumentChunk:
    def __init__(self, text: str, source_doc: Document):
        self.text = text
        self.source_doc = source_doc
```

This chunking strategy ensures that:

- Documents can be processed regardless of their length
- Questions or information that might span chunk boundaries aren't lost
- Source document information is preserved for attribution

### 3. Vector Store Creation

The `create_vector_store` function:

- Initializes a SentenceTransformer model using the lightweight `all-MiniLM-L6-v2`
- Creates embeddings for all document chunks
- Builds a FAISS index with these embeddings
- Returns a tuple containing:
  - The FAISS index
  - The embedding model (for consistent embedding of queries)
  - The list of document chunks (for retrieving original text)

```python
embeddings = model.encode(chunk_texts, convert_to_tensor=False)
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings).astype('float32'))
```

### 4. Semantic Search and Retrieval

The `query_vector_store` function:

- Embeds the user query using the same model for vector space consistency
- Searches the FAISS index for similar document chunks
- Returns the top-k most semantically relevant document chunks with their metadata

```python
query_embedding = model.encode([query], convert_to_tensor=False)
scores, indices = index.search(np.array(query_embedding).astype('float32'), k=top_k)
```

### 5. LLM Prompt Generation

Before sending content to the LLM, the pipeline:

- Formats retrieved chunks with source information via `format_chunk_with_source`
- Creates a structured prompt using the `PROMPT_TEMPLATE` constant
- The template instructs the LLM to:
  - Extract only actual questions from the document
  - Tag them with topics, question type, and source
  - Return everything in a consistent JSON format

### 6. Local LLM Inference

The `run_local_llm` function:

- Uses subprocess to call either Ollama or the llm CLI
- Passes the formatted prompt to a local LLM (default: Mistral)
- Includes fallback mechanisms if one approach fails
- Returns the raw text response from the LLM

```python
result = subprocess.run(
    ["ollama", "run", model_name, prompt],
    capture_output=True,
    text=True,
    check=True
)
```

### 7. Response Parsing

The `parse_response` function handles various response formats:

- First attempts to parse the response as pure JSON
- If that fails, tries to extract JSON from markdown code blocks
- As a last resort, looks for JSON between curly braces
- Returns a structured dictionary with the tagged questions or an error

This robust parsing ensures the pipeline can handle varied LLM outputs while maintaining structured data.

### 8. Processing Pipeline Integration

The `process_query` function orchestrates the entire process:

- Calls the document processing functions
- Creates and queries the vector store
- Formats content and runs the LLM
- Parses and structures the response
- Ensures the response follows the expected schema

### 9. Output Management

The `save_tagged_questions` function:

- Creates an output JSON file in the course directory
- Saves the structured question data for future use
- Returns the path to the saved file

## Running the Script

The `main` function provides a command-line interface with arguments for:

```bash
python rag_pipeline.py --course <COURSE_CODE> [--query <QUERY>] [--save] [--output <PATH>] [--max-documents <N>] [--top-k <N>]
```

Example:

```bash
python rag_pipeline.py --course MAT137 --save
```

This will:

- Load and parse all PDF documents in the `data/MAT137` folder
- Extract chunks and embed them using the sentence transformer model
- Use the local LLM to identify real exam/assignment questions
- Save the tagged results in `data/MAT137/tagged_questions.json`

## Dependencies

The pipeline relies on the following Python packages:

- `fitz` (PyMuPDF) - For PDF parsing
- `faiss-cpu` - For efficient vector similarity search
- `numpy` - For numerical operations
- `sentence-transformers` - For text embedding
- `subprocess` - For LLM execution via CLI
- `json`, `glob`, `os` - For file handling and data processing

## System Requirements

- Python 3.8+
- Ollama or llm CLI for local model inference
- Sufficient memory for FAISS index and LLM prompt handling
- Storage space for PDF documents and embeddings
