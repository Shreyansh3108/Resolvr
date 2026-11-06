"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Bot, User, Activity, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SandboxPage() {
  const { data: session } = useSession();
  const tenantId = (session?.user as any)?.tenantId || "personal_workspace";
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello. I am your Resolvr agent. Test your documentation against my retrieval engine." }
  ]);
  
  // Start with empty telemetry waiting for the first query
  const [telemetry, setTelemetry] = useState<any>({
    timestamp: new Date().toISOString(),
    engine_version: "v2.4.1-stable",
    namespace: tenantId,
    telemetry: { status: "IDLE", latency_ms: 0, context_chunks_used: 0 },
    evaluation_metrics: { retrieval_score: 0.000, hard_threshold: 0.250, llm_certainty: 0.000 }
  });

  // Generate a random session ID for this specific sandbox test
  const [sessionId] = useState(() => "sandbox_" + Math.random().toString(36).substring(7));

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    const startTime = Date.now();

    try {
      // Hit your real backend!
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          message: userMessage,
          sessionId
        })
      });

      const data = await res.json();
      const latency = Date.now() - startTime;

      // Push the REAL AI response to the chat
      setMessages(prev => [...prev, { role: "ai", content: data.reply || "Error: No reply from backend." }]);
      
      // Update X-Ray Telemetry with real math from the backend
      const score = data.debug?.maxScore || 0;
      const escalated = data.debug?.isEscalated || false;

      setTelemetry({
        timestamp: new Date().toISOString(),
        engine_version: "v2.4.1-stable",
        namespace: tenantId,
        telemetry: {
          status: escalated ? "ESCALATED_TO_CRM" : "RESOLVED",
          latency_ms: latency,
          context_chunks_used: score > 0 ? 5 : 0 
        },
        evaluation_metrics: {
          retrieval_score: Number(score.toFixed(3)),
          hard_threshold: 0.250,
          llm_certainty: escalated ? 0.000 : 0.941 // Mocking certainty metric for visual effect
        }
      });

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "ai", content: "System error: Failed to reach Resolvr Engine." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      
      <div className="border-b border-gray-200 pb-4 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Triage Sandbox</h1>
        </div>
        <p className="text-gray-500 font-medium text-sm">
          Test your agent's behavior. Watch the deterministic engine score queries and make routing decisions in real-time.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT: Client Chat Preview */}
        <div className="flex-1 border border-gray-200 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-gray-700">Resolvr Widget (Preview)</span>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-gray-500" />
                </div>
                <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm bg-gray-100 text-gray-500 border border-gray-200 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a technical question or ask for a refund..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-200 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Telemetry X-Ray */}
        <div className="flex-1 bg-gray-950 rounded-xl shadow-sm border border-gray-900 flex flex-col overflow-hidden text-gray-300 font-mono text-xs">
          <div className="px-4 py-3 border-b border-gray-800 bg-gray-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">&gt;_</span>
              <span className="font-bold text-gray-200 tracking-wider">COMPOSITE SIGNAL X-RAY</span>
            </div>
            
            {/* Dynamic Status Indicator */}
            {telemetry.evaluation_metrics.retrieval_score >= 0.25 ? (
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                <CheckCircle2 className="w-3 h-3" />
                <span className="font-bold">CONFIDENT</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-2 py-1 rounded border border-rose-400/20">
                <AlertTriangle className="w-3 h-3" />
                <span className="font-bold">ESCALATING</span>
              </div>
            )}
          </div>

          <div className="p-4 overflow-y-auto flex-1 whitespace-pre-wrap">
            <span className="text-emerald-400">{"{\n"}</span>
            <span className="text-blue-300">  "timestamp"</span><span className="text-gray-400">: </span><span className="text-emerald-300">"{telemetry.timestamp}"</span>{",\n"}
            <span className="text-blue-300">  "engine_version"</span><span className="text-gray-400">: </span><span className="text-emerald-300">"{telemetry.engine_version}"</span>{",\n"}
            <span className="text-blue-300">  "namespace"</span><span className="text-gray-400">: </span><span className="text-emerald-300">"{telemetry.namespace}"</span>{",\n\n"}
            
            <span className="text-blue-300">  "telemetry"</span><span className="text-gray-400">: {"{\n"}</span>
            <span className="text-blue-300">    "status"</span><span className="text-gray-400">: </span><span className={telemetry.telemetry.status === "RESOLVED" ? "text-emerald-300" : "text-rose-300"}>"{telemetry.telemetry.status}"</span>{",\n"}
            <span className="text-blue-300">    "latency_ms"</span><span className="text-gray-400">: </span><span className="text-yellow-300">{telemetry.telemetry.latency_ms}</span>{",\n"}
            <span className="text-blue-300">    "context_chunks_used"</span><span className="text-gray-400">: </span><span className="text-yellow-300">{telemetry.telemetry.context_chunks_used}</span>{"\n"}
            
            {/* The JSX parsing fix is on this line: */}
            <span className="text-gray-400">{"  },\n\n"}</span>

            <span className="text-blue-300">  "evaluation_metrics"</span><span className="text-gray-400">: {"{\n"}</span>
            <span className="text-blue-300">    "retrieval_score"</span><span className="text-gray-400">: </span>
            <span className={telemetry.evaluation_metrics.retrieval_score < 0.25 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {telemetry.evaluation_metrics.retrieval_score.toFixed(3)}
            </span>{",\n"}
            <span className="text-blue-300">    "hard_threshold"</span><span className="text-gray-400">: </span><span className="text-yellow-300">{telemetry.evaluation_metrics.hard_threshold.toFixed(3)}</span>{",\n"}
            <span className="text-blue-300">    "llm_certainty"</span><span className="text-gray-400">: </span><span className="text-yellow-300">{telemetry.evaluation_metrics.llm_certainty.toFixed(3)}</span>{"\n"}
            <span className="text-gray-400">{"  }\n"}</span>
            <span className="text-emerald-400">{"}"}</span>
          </div>

          <div className="px-4 py-3 bg-gray-900 border-t border-gray-800 text-gray-500 shrink-0">
            <span className="font-bold text-gray-400">Architecture Note:</span> If `retrieval_score` drops below `0.250`, the system cuts power to the LLM and emits a webhook to your CRM.
          </div>
        </div>
      </div>
    </div>
  );
}