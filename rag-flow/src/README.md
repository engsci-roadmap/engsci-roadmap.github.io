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

Once you have the LLM installed and course PDFs downloaded, you can use the RAG pipeline:

```bash
# Basic usage - summarize materials for a course
python src/rag_pipeline.py --course CIV102

# Ask a specific question about course materials
python src/rag_pipeline.py --course ESC180 --query "What topics are covered in the exams?"

# Save the output to a JSON file
python src/rag_pipeline.py --course MAT194 --output mat194_summary.json
```

### Parameters

- `--course`: (Required) Course code to query (e.g., CIV102, MAT194)
- `--query`: (Optional) The specific question to ask (default: "Summarize the course materials")
- `--output`: (Optional) Path to save the JSON output

## How It Works

1. **PDF Collection**: `webscrape.py` downloads course PDFs from Skule Courses site.
2. **Document Processing**: `rag_pipeline.py` reads and extracts text from PDFs.
3. **Chunking & Embedding**: Documents are split into chunks and embedded using sentence-transformers.
4. **Vector Search**: FAISS finds the most relevant document chunks for a query.
5. **LLM Generation**: A local LLM generates structured insights about the documents.

## Output Format

The output is a JSON object with the following structure:

```json
{
  "response": {
    "answer": "A detailed summary of the course materials.",
    "topicsCovered": ["Topic 1", "Topic 2"],
    "questionTypes": ["Multiple Choice", "Problem Solving"],
    "studySuggestions": ["Focus on X", "Review Y"],
    "documentLinks": [
      {
        "documentName": "Quiz1.pdf",
        "documentUrl": "http://localhost/data/CIV102/Quiz1.pdf"
      }
    ]
  }
}
```

## Supported Courses

The project currently supports materials for 25 engineering courses including:
CIV102, CSC180, ESC180, MAT194, PHY180, and more.
