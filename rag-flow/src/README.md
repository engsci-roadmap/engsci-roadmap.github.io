# Skule Course Documents RAG Pipeline

This project implements a complete workflow to:

1. Scrape PDF course materials from Skule Courses website
2. Organize them by course code
3. Implement a Retrieval-Augmented Generation (RAG) pipeline for document analysis

## Project Structure

```
rag-flow/
├── data/              # PDF files organized by course code
│   ├── CIV102/        # Course-specific PDFs
│   ├── ESC180/
│   └── ...
└── src/               # Source code
    ├── webscrape.py   # PDF scraper for Skule Courses
    ├── rag_pipeline.py # RAG implementation for document analysis
    └── requirements.txt # Dependencies
```

## Step 1: Scraping Course PDFs

The `webscrape.py` script downloads PDFs from course pages and organizes them into directories:

```bash
# Run the webscraper to download course PDFs
python src/webscrape.py
```

This creates folders in the `data/` directory for each course code, containing all their PDF documents.

## Step 2: RAG Pipeline Setup

### Prerequisites

1. Install the required dependencies:

```bash
cd src
pip install -r requirements.txt
```

2. Install a local LLM using one of these options:

   - **Ollama** (Recommended for macOS/Linux): [Download from ollama.ai](https://ollama.ai/)

     ```bash
     # After installing and starting Ollama, pull the Mistral model
     ollama pull mistral
     ```

   - **text-generation-webui**: Follow installation instructions at [their GitHub repo](https://github.com/oobabooga/text-generation-webui)

### Troubleshooting LLM Installation

- **For macOS**: After installing Ollama, make sure to start it from your Applications folder. The Ollama icon should appear in your menu bar.
- If Ollama isn't found in your PATH, you might need to restart your terminal or add the Ollama binary location to your PATH.

## Step 3: Using the RAG Pipeline

### Document Analysis & Question Tagging

The RAG pipeline now supports extracting and tagging individual questions from course documents:

```bash
# Basic usage - extract and tag questions for a course
python src/rag_pipeline.py --course CIV102

# Ask a specific question about course materials
python src/rag_pipeline.py --course ESC180 --query "Find calculation questions about integration"

# Save tagged questions to a file in the course directory
python src/rag_pipeline.py --course MAT194 --save

# Save the output to a specific JSON file
python src/rag_pipeline.py --course MAT194 --output mat194_tagged.json
```

### Parameters

- `--course`: (Required) Course code to query (e.g., CIV102, MAT194)
- `--query`: (Optional) Query to focus on specific question types or topics (default: "Extract and tag all questions")
- `--output`: (Optional) Path to save the JSON output
- `--save`: (Optional) Save tagged questions to data/[COURSE_CODE]/tagged_questions.json
- `--max-documents`: (Optional) Maximum number of documents to process (default: all)
- `--top-k`: (Optional) Number of text chunks to retrieve from the vector store (default: 15)

### Performance and Memory Usage

You can control the resource usage of the pipeline:

```bash
# Process only 3 documents for a course (useful for large courses)
python src/rag_pipeline.py --course MAT194 --max-documents 3

# Retrieve fewer chunks to reduce LLM processing time
python src/rag_pipeline.py --course CIV102 --top-k 5

# Retrieve more chunks for better coverage
python src/rag_pipeline.py --course ESC180 --top-k 25
```

For large courses with many documents, using the `--max-documents` parameter can significantly
improve processing speed and memory usage while still providing useful results.

## Output Format

The output is a JSON object with the following structure:

```json
{
  "response": {
    "taggedQuestions": [
      {
        "questionText": "What is the Laplace Transform of f(t) = t?",
        "topicsTested": ["Laplace Transform"],
        "questionType": "Calculation",
        "source": "FinalExam2023.pdf"
      },
      {
        "questionText": "State and prove the convolution theorem for Laplace Transforms.",
        "topicsTested": ["Laplace Transform", "Convolution Theorem"],
        "questionType": "Proof",
        "source": "FinalExam2023.pdf"
      }
    ]
  }
}
```

## How It Works

1. **PDF Collection**: `webscrape.py` downloads course PDFs from Skule Courses site.
2. **Document Processing**: `rag_pipeline.py` reads and extracts text from PDFs.
3. **Chunking & Embedding**: Documents are split into chunks while preserving source information.
4. **Vector Search**: FAISS finds the most relevant document chunks for a query.
5. **Question Extraction**: A local LLM identifies individual questions from the documents.
6. **Topic Tagging**: The LLM tags each question with topics, question type, and source.
7. **Structured Output**: Results are returned in a structured JSON format for front-end integration.

## Supported Courses

The project currently supports materials for 25 engineering courses including:
CIV102, CSC180, ESC180, MAT194, PHY180, and more.
