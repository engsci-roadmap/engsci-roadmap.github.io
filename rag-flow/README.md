# RAG Pipeline for Course Documents with Question-Level Topic Tagging

## Overview

Retrieval-Augmented Generation (RAG) is a hybrid NLP pipeline that combines retrieval-based methods with generative language models. RAG enhances the capabilities of Large Language Models (LLMs) by grounding their responses in factual, external knowledge retrieved from a corpus of documents. This approach is particularly valuable in domain-specific contexts like academic documents, where factual accuracy and relevance are crucial.

The core components of a RAG system include:

- A **retriever** (FAISS in this implementation) that efficiently searches through a corpus of documents
- An **embedder** (Sentence Transformers) that converts text into dense vector representations
- A **generator** (local LLM via Ollama) that synthesizes coherent responses from retrieved information

This pipeline's high-level goal is to extract individual questions from academic PDFs (such as exams, assignments, and quizzes) and tag them with topics, question type, and source metadata, enabling more effective organization and retrieval of educational content.

## Pipeline Description

### 1. Document Loading

- PDFs are loaded from a course-specific folder in the `/data` directory
- `fitz` (PyMuPDF) extracts raw text from PDFs, preserving the content for further processing
- The source PDF path and filename are maintained as metadata throughout the pipeline

### 2. Document Preprocessing

- Extracted text is split into overlapping chunks (default `CHUNK_SIZE=1000` with `CHUNK_OVERLAP=200`) to preserve context while creating manageable units for embedding
- Overlap between chunks ensures that questions or concepts that might span chunk boundaries aren't lost
- Each chunk is associated with metadata via the `DocumentChunk` class that maintains a reference to its source document

### 3. Embedding and Indexing

- Sentence embeddings are computed using a lightweight local model (`all-MiniLM-L6-v2`) via `SentenceTransformer`
- This model transforms text chunks into dense vector representations that capture semantic meaning
- Embeddings are stored in a FAISS index (`IndexFlatL2`) to enable efficient similarity search using L2 distance
- FAISS provides fast approximate nearest neighbor search in high-dimensional spaces

### 4. Query and Retrieval

- A user-defined query (default: "Extract and tag all questions") is embedded using the same model to ensure consistent vector space
- The query embedding is compared against stored vectors to find semantically similar chunks
- The top `k` (default: 15) most relevant chunks are retrieved, balancing between comprehensive coverage and precision

### 5. Prompt Generation and LLM Inference

- Retrieved document chunks are formatted with source metadata to maintain provenance
- A well-structured prompt (`PROMPT_TEMPLATE`) instructs the LLM to:
  - Identify real questions from the document text
  - Tag each question with topic, question type, and source
  - Format the output as structured JSON
- The prompt is sent to a local LLM through the Ollama or `llm` CLI interface, reducing dependency on external API services

### 6. Output Parsing

- The raw LLM output is parsed into a structured JSON object
- Multiple fallback methods handle potentially improperly formatted responses:
  - Direct JSON parsing
  - Extraction from markdown code blocks
  - Boundary detection using curly braces

### 7. Output Saving (Optional)

- Tagged questions can optionally be saved in `data/<course_code>/tagged_questions.json`
- This persistence enables integration with downstream applications or further analysis

## Running the Script

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
