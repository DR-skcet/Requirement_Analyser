import { useState, useRef } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [requirements, setRequirements] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSummary("");
      setRequirements(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setSummary("");
      setRequirements(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(res.data.summary || "No summary provided.");
      setRequirements(res.data.requirements);
    } catch (err) {
      setSummary("Upload failed. " + err.message);
      setRequirements(null);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setSummary("");
    setRequirements(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleDownload = () => {
    if (!requirements) return;

    const blob = new Blob(
      [JSON.stringify(requirements, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file?.name || "requirements"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-12">
      <div className="max-w-4xl w-full p-10 bg-white rounded-3xl shadow-2xl border border-indigo-200 transition-all duration-500">
        <header className="flex items-center space-x-4 mb-10">
          <svg
            className="w-12 h-12 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
          >
            <path
              strokeLinecap="round" strokeLinejoin="round"
              d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-wide">
            AI Requirement Extractor
          </h1>
        </header>

        <p className="mb-10 text-center text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          Upload your project document and let AI extract
          <span className="font-semibold text-indigo-600"> functional</span>,
          <span className="font-semibold text-indigo-600"> non-functional</span> requirements,
          <span className="font-semibold text-indigo-600"> constraints</span>, and
          <span className="font-semibold text-indigo-600"> assumptions</span> in a structured JSON format.
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-4 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 rounded-xl p-10 cursor-pointer relative"
          onClick={() => fileInputRef.current.click()}
        >
          {!file ? (
            <div className="flex flex-col items-center space-y-3 text-indigo-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4m4-4v12"
                />
              </svg>
              <p className="text-lg font-medium text-indigo-600">
                Drag & Drop your file here, or click to browse
              </p>
              <p className="text-sm text-indigo-400">
                Supported: .doc, .docx, .txt, .pdf
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-indigo-800 font-semibold text-lg truncate max-w-full">
                {file.name}
              </p>
              <p className="text-gray-600 text-sm">
                {(file.size / 1024 / 1024).toFixed(2)} MB &middot; {file.type || "Unknown Type"}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
              >
                Remove File
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".doc,.docx,.txt,.pdf"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`mt-8 w-full py-3 rounded-xl font-bold text-white shadow-lg transform transition duration-300 ${
            loading || !file
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span>Analyzing...</span>
            </span>
          ) : (
            "Upload & Extract"
          )}
        </button>


        {requirements && (
          <>
            <div className="mt-6 bg-gray-50 border border-indigo-200 rounded-xl p-6 max-h-[30rem] overflow-auto shadow-inner">
              <h3 className="text-md font-medium text-indigo-700 mb-2">🔍 Extracted Requirements (JSON)</h3>
              <pre className="text-sm text-gray-900 font-mono whitespace-pre-wrap">
                {JSON.stringify(requirements, null, 2)}
              </pre>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                ⬇️ Download JSON
              </button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm select-none">
          Supported formats: <span className="font-semibold text-gray-500">.doc, .docx, .txt, .pdf</span>
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
