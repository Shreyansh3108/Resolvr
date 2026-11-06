"use client";
import { useState } from "react";

export default function KnowledgeUpload({ tenantId }: { tenantId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("Uploading and processing PDF...");

    // 1. Pack the file and tenantId into a FormData object
    const formData = new FormData();
    formData.append("document", file);
    formData.append("tenantId", tenantId);

    try {
      // 2. Send to your Express backend
      const response = await fetch("http://localhost:5000/upload-pdf", {
        method: "POST",
        headers: {
          "x-tenant-id": tenantId // Exposes the ID for your security middleware
        },
        body: formData, // Notice: No "Content-Type" header. The browser sets the boundary automatically!
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Success! Embedded ${data.extractedPages} pages.`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus("Failed to connect to server.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-bold mb-4">Train Your AI</h3>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
        <button 
          type="submit" 
          disabled={!file}
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Upload & Train
        </button>
      </form>
      {status && <p className="mt-4 text-sm font-medium">{status}</p>}
    </div>
  );
}