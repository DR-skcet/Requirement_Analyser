from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from file_parser import extract_text_from_file
from extract import extract_requirements
from exporter import map_to_standards, export_to_json, export_to_excel, export_to_pdf
import os
import uuid
import json
import logging

app = FastAPI()

# Setup logging
logging.basicConfig(level=logging.INFO)

# CORS settings (update the frontend URL in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        logging.info(f"File received: {file.filename}, Size: {len(content)} bytes")
        
        extracted_text = extract_text_from_file(file.filename, content)
        logging.info(f"Extracted text: {extracted_text[:200]}...")  # Print only first 200 chars

        if not extracted_text or not extracted_text[0].strip():
            return JSONResponse(status_code=400, content={"error": "No text could be extracted."})
    except Exception as e:
        logging.exception("Error during text extraction")
        return JSONResponse(status_code=500, content={"error": f"Text extraction failed: {str(e)}"})

    try:
        raw_requirements = extract_requirements(extracted_text[0])
        logging.info(f"Type of raw_requirements: {type(raw_requirements)}")
        logging.info(f"Extracted requirements (raw): {str(raw_requirements)[:500]}")  # Show partial output
    except Exception as e:
        logging.exception("Error during requirement extraction")
        return JSONResponse(status_code=500, content={"error": f"Requirement extraction failed: {str(e)}"})

    try:
        if isinstance(raw_requirements, dict):
            requirements_dict = raw_requirements
        elif isinstance(raw_requirements, list):
            requirements_dict = {"requirements": raw_requirements}
        else:
            # treat as raw text for now
            requirements_dict = {"requirements_text": raw_requirements}
            
    except Exception as e:
        logging.exception("Error in requirements formatting")
        return JSONResponse(status_code=500, content={"error": f"Requirement processing failed: {str(e)}"})

    try:
        mapped = map_to_standards(requirements_dict)
    except Exception as e:
        logging.exception("Mapping to standards failed")
        return JSONResponse(status_code=500, content={"error": f"Mapping failed: {str(e)}"})

    try:
        session_id = str(uuid.uuid4())
        output_dir = f"output/{session_id}"
        os.makedirs(output_dir, exist_ok=True)

        json_path = export_to_json(mapped, f"{output_dir}/requirements.json")
        excel_path = export_to_excel(mapped, f"{output_dir}/requirements.xlsx")
        pdf_path = export_to_pdf(mapped, f"{output_dir}/requirements.pdf")
    except Exception as e:
        logging.exception("Error during exporting files")
        return JSONResponse(status_code=500, content={"error": f"Export failed: {str(e)}"})

    return {
    "requirements": mapped,
    "output_files": {
        "json": f"/download/{session_id}/requirements.json",
        "excel": f"/download/{session_id}/requirements.xlsx",
        "pdf": f"/download/{session_id}/requirements.pdf"
        }
    }
@app.get("/download/{session_id}/{filename}")
async def download_file(session_id: str, filename: str):
    file_path = f"output/{session_id}/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    return JSONResponse(status_code=404, content={"error": "File not found."})
