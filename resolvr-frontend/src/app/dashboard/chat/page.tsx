"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// 1. UPDATE MESSAGE TYPE to accept the backend's debug payload
type Message = { 
  role: "user" | "agent"; 
  content: string;
  debug?: { maxScore: number; isEscalated: boolean }; 
};

export default function ChatTesterPage() {
  const { data: session } = useSession();
 const tenantId = (session?.user as any)?.tenantId;
  const activeTenantId = tenantId || "tenant_demo_123"; 
  
  // FIX 1: Hydration Mismatch - Initialize sessionId only on the client
  const [sessionId, setSessionId] = useState<string>("");
  
  useEffect(() => {
    setSessionId("sess_" + Math.random().toString(36).substring(2, 10));
  }, []);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // FIX 2: Poisoned Memory - Track if the session was handed off to a human
  const [isEscalated, setIsEscalated] = useState(false);

  // Helper to instantly reset the chat for testing without manually refreshing the page
  const startNewSession = () => {
    setSessionId("sess_" + Math.random().toString(36).substring(2, 10));
    setMessages([]);
    setIsEscalated(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isEscalated) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: activeTenantId,
          sessionId: sessionId,
          message: userMsg,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // 2. CAPTURE THE COMPOSITE SIGNAL in the state
      setMessages((prev) => [
        ...prev, 
        { 
          role: "agent", 
          content: data.reply,
          debug: data.debug 
        }
      ]);

      // 3. LOCK THE SESSION if the backend triggered the CRM webhook
      if (data.debug?.isEscalated) {
        setIsEscalated(true);
      }
      
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "agent", content: `System Error: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[85vh] border border-zinc-800 rounded-lg bg-black text-zinc-300">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800 bg-zinc-950/50">
        <h2 className="font-semibold text-white tracking-wide">Resolvr Triage Engine</h2>
        <span className="ml-auto text-xs font-mono text-zinc-500">
          TENANT: {activeTenantId} | SESSION: {sessionId || "Initializing..."}
        </span>
      </div>

      {/* Chat Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-sm">
        {messages.length === 0 && (
          <div className="text-zinc-600 flex items-center justify-center h-full">
            Ready for queries. Agents will reference the Qdrant knowledge base.
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-md ${
              msg.role === "user" ? "bg-zinc-900 border border-zinc-800 text-zinc-300" : "bg-transparent"
            }`}>
              {/* Agent Response */}
              <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              
              {/* 3. RENDER THE COMPOSITE SIGNAL DEBUG UI */}
              {msg.debug && (
                <div className="mt-3 flex gap-3 text-xs border-t border-zinc-800 pt-3">
                  <span className={msg.debug.maxScore < 0.25 ? "text-red-400" : "text-emerald-400"}>
                    Vector Score: {msg.debug.maxScore.toFixed(3)}
                  </span>
                  {msg.debug.isEscalated && (
                    <span className="text-orange-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                      ⚠️ CRM Webhook Triggered
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-zinc-500 animate-pulse">Agent is triangulating...</div>}
      </div>

      {/* Input Form OR Escalation Lock UI */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        {isEscalated ? (
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <span className="text-orange-400 text-sm font-semibold tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Session Transferred to Human Support
            </span>
            <button 
              onClick={startNewSession}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded transition-colors border border-zinc-700"
            >
              Start New Test Session
            </button>
          </div>
        ) : (
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={sessionId ? "Test the escalation engine..." : "Initializing session..."}
              disabled={!sessionId}
              className="w-full bg-black border border-zinc-800 rounded p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
          </form>
        )}
      </div>
    </div>
  );
}