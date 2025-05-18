import React, { useState } from "react";
import axios from "axios";

const ClarificationChat = ({ docId }) => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!query.trim()) return;
    const newMessages = [...messages, { type: "user", text: query }];
    setMessages(newMessages);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        query,
        doc_id: docId, // optional: use if multiple docs
      });
      setMessages([
        ...newMessages,
        { type: "bot", text: res.data.response || "No response." },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { type: "bot", text: "Error getting response from AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Clarification Chat</h2>
      <div className="h-64 overflow-y-auto border rounded p-2 mb-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.type === "user" ? "bg-blue-100 text-right" : "bg-green-100 text-left"
            }`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
        {loading && <p className="text-gray-400">Thinking...</p>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a clarification question..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ClarificationChat;
