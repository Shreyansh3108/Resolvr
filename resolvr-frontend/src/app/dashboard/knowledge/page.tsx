"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Terminal, Server, Type } from "lucide-react";
import { useSession } from "next-auth/react"; // Swapped Clerk for your custom NextAuth

export default function KnowledgeBasePage() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---> NEW STATE FOR MANUAL TEXT <---
  const [text, setText] = useState("");
  const [textStatusMsg, setTextStatusMsg] = useState<"idle" | "loading" | "success" | "error">("idle");

  // USING REAL NEXT-AUTH TENANT ID (with fallback)
  const activeTenantId = (session?.user as any)?.tenantId || "personal_workspace";

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString().split("T")[1].slice(0, 8)}] ${msg}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setLogs([]);
      addLog(`File selected: ${e.target.files[0].name} (${(e.target.files[0].size / 1024).toFixed(2)} KB)`);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    addLog("Initiating secure transfer to Resolvr Engine...");
    
    const formData = new FormData();
    formData.append("document", file);
    formData.append("tenantId", activeTenantId);

    try {
      addLog("Extracting raw text via pdf-extraction buffer...");
      
      const response = await fetch("http://localhost:5000/upload-pdf", {
        method: "POST",
        headers: {
          "x-tenant-id": activeTenantId,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorDetails = await response.text(); 
        throw new Error(`Backend Error (${response.status}): ${errorDetails}`);
      }

      const data = await response.json();
      
      addLog(`Extraction complete. Pages parsed: ${data.extractedPages || "N/A"}`);
      addLog(`Vectorizing via Cohere Embeddings...`);
      addLog(`Securing chunks to PostgreSQL/Qdrant namespace: ${activeTenantId}`);
      addLog("RAG memory index updated successfully.");
      
      setStatus("success");
      setFile(null); 
    } catch (error: any) {
      console.error(error);
      addLog(`ERROR: ${error.message}`); 
      setStatus("error");
    }
  };

  // ---> NEW MANUAL TEXT INGESTION LOGIC <---
  const handleIngestText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setTextStatusMsg("loading");
    addLog("Initializing manual text vectorization...");

    try {
      const res = await fetch("http://localhost:5000/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text,
          tenantId: activeTenantId 
        }), 
      });

      if (res.ok) {
        setTextStatusMsg("success");
        setText("");
        addLog("Manual text successfully embedded and indexed.");
      } else {
        setTextStatusMsg("error");
        addLog("ERROR: Failed to save knowledge to backend.");
      }
    } catch (error) {
      setTextStatusMsg("error");
      addLog("ERROR: Server unreachable.");
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Server className="w-5 h-5 text-indigo-600" />
          <h1 className="text-3xl font-display font-bold tracking-tight text-gray-900">Knowledge Base</h1>
        </div>
        <p className="text-gray-500 font-medium text-sm">
          Ingest unstructured documents into your isolated Qdrant vector namespace. Agents will immediately reference this data during autonomous triage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Tools */}
        <div className="space-y-8">
          
          {/* 1. Upload Dropzone */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
              <UploadCloud className="w-4 h-4 text-gray-400" />
              Upload Source Document
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl bg-white transition-all cursor-pointer overflow-hidden group shadow-sm
                ${status === "uploading" ? "border-indigo-300 pointer-events-none" : "border-gray-300 hover:border-indigo-500 hover:bg-gray-50"}
                ${status === "error" ? "border-red-300 bg-red-50" : ""}
                ${status === "success" ? "border-emerald-300 bg-emerald-50" : ""}
              `}
            >
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.txt,.md" 
                onChange={handleFileChange} 
                ref={fileInputRef}
              />
              
              {status === "uploading" && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-[2px] z-10">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm font-mono font-medium text-indigo-600 animate-pulse">Running Ingestion Pipeline...</p>
                </div>
              )}

              {file ? (
                <div className="text-center z-0">
                  <FileText className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                  <p className="text-sm font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Ready for vectorization</p>
                </div>
              ) : (
                <div className="text-center z-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-500 font-mono">PDF, TXT, MD (Max 10MB)</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleUpload}
              disabled={!file || status === "uploading"}
              className="w-full py-3 px-4 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              Initialize Embedding
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* 2. Manual Text Input Area */}
          <form onSubmit={handleIngestText} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
              <Type className="w-4 h-4 text-gray-400" />
              Manual Text Ingestion
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm resize-none"
              placeholder="Paste company policies, FAQs, product details, or discounts here..."
            />
            <div className="flex items-center justify-between">
              <button 
                type="submit" 
                disabled={textStatusMsg === "loading"} 
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-900 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {textStatusMsg === "loading" ? "Embedding..." : "Save Text"}
              </button>
              {textStatusMsg === "success" && <span className="text-emerald-600 text-sm font-bold">Successfully Embedded!</span>}
              {textStatusMsg === "error" && <span className="text-red-600 text-sm font-bold">Failed to embed.</span>}
            </div>
          </form>

        </div>

        {/* RIGHT COLUMN: Terminal Output (Kept Dark for aesthetics) */}
        <div className="space-y-4 flex flex-col h-full">
           <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-gray-400" />
            Pipeline Telemetry
          </div>
          
          <div className="flex-1 bg-gray-900 border border-gray-800 shadow-inner rounded-xl p-4 font-mono text-xs overflow-y-auto relative min-h-[400px]">
            {/* Fake Mac Window Dots */}
            <div className="flex gap-1.5 mb-4 border-b border-gray-800 pb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
            </div>

            {logs.length === 0 ? (
              <p className="text-gray-500 italic">Waiting for document ingestion...</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={
                      log.includes("ERROR") ? "text-red-400" :
                      log.includes("success") || log.includes("complete") ? "text-emerald-400" :
                      "text-gray-300"
                    }
                  >
                    {log}
                  </motion.p>
                ))}
              </div>
            )}

            {/* Status Indicator */}
            {status === "success" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pipeline Execution Successful</span>
              </motion.div>
            )}
            {status === "error" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 w-fit px-3 py-1.5 rounded-md border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
                <span>Pipeline Execution Failed</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}