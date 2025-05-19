AI-Powered Automated Requirement Gathering System
Overview
An AI-driven system that automates extraction and structuring of software requirements from diverse inputs like PDFs, Word, Excel, images, emails, and web pages. It applies domain knowledge (regulations, standards) to generate clear, standardized functional and non-functional requirements.

Workflow
Input ingestion: Upload or provide documents/text.

Parsing: Extract text and graphics using Python libraries and OCR.

Extraction: Use LLaMA 3 via Groq API Cloud to identify requirements.

Contextualization: Match extracted data with domain standards using embeddings + FAISS.

Output: Generate standardized requirement documents automatically.

Tech Stack
Backend: FastAPI (Python)

AI Model: LLaMA 3 on Groq API Cloud

Parsing: PyMuPDF, python-docx, openpyxl, Tesseract OCR

Embeddings: HuggingFace + FAISS vector search

Deployment: Cloud-native with Groq AI accelerators

Impact
Automates and speeds up requirement gathering

Ensures compliance with industry standards

Improves accuracy and reduces ambiguity

Scalable, real-time AI-powered processing

