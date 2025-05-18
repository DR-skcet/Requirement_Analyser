import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import FileUpload from "./components/FileUpload";
import ClarificationChat from "./components/ClarificationChat";

function App() {
  const [uploadedDocId, setUploadedDocId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/upload"
          element={
            <>
              <FileUpload setUploadedDocId={setUploadedDocId} />
              {uploadedDocId && <ClarificationChat docId={uploadedDocId} />}
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
