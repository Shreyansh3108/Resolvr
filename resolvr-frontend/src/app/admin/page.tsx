"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  FileText,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  MessageSquare,
  Layers,
  Sparkles,
  Globe,
  Mail,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Terminal,
  Eye
} from "lucide-react";

interface SessionItem {
  sessionId: string;
  queries: number;
  solved: number;
  escalated: number;
  lastQueryPreview: string;
  status: "RESOLVED" | "ESCALATED" | "IDLE";
  lastActive: string;
}

interface CompanyData {
  id: string;
  name: string;
  domain: string;
  clientEmail: string;
  createdAt: string;
  isLegacySandboxId: boolean;
  knowledgeBase: {
    collectionName: string;
    vectorChunks: number;
    documents: string[];
    chunkPreviews: string[];
  };
  telemetry: {
    sessionsCount: number;
    queries: number;
    solved: number;
    escalated: number;
  };
  sessions: SessionItem[];
}

export default function SuperAdminPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbOnline, setDbOnline] = useState(true);
  const [neonLatencyMs, setNeonLatencyMs] = useState(0);
  const [totalQdrantVectors, setTotalQdrantVectors] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLegacyIds, setShowLegacyIds] = useState(false);
  const [showChunkPreviews, setShowChunkPreviews] = useState(false);

  const fetchRealTelemetry = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        setDbOnline(Boolean(data.dbOnline));
        setNeonLatencyMs(Number(data.neonLatencyMs) || 0);
        setTotalQdrantVectors(Number(data.totalQdrantVectors) || 0);

        if (Array.isArray(data.companies)) {
          setCompanies(data.companies);
          // Default to first real registered company (e.g. "Test")
          const realCompanies = data.companies.filter((c: CompanyData) => !c.isLegacySandboxId);
          const firstTarget = realCompanies[0] || data.companies[0];
          if (firstTarget) {
            setSelectedId((prev) =>
              data.companies.some((c: CompanyData) => c.id === prev) ? prev : firstTarget.id
            );
          }
        }
      }
    } catch {
      setDbOnline(false);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchRealTelemetry();
  }, [fetchRealTelemetry]);

  // Filter out legacy auto-created IDs unless checkbox is enabled
  const visibleCompanies = companies.filter((c) => {
    if (!showLegacyIds && c.isLegacySandboxId) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      c.clientEmail.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const selectedCompany =
    visibleCompanies.find((c) => c.id === selectedId) || visibleCompanies[0] || null;

  // Aggregate real metrics across visible companies
  const totalQueries = visibleCompanies.reduce((sum, c) => sum + c.telemetry.queries, 0);
  const totalSolved = visibleCompanies.reduce((sum, c) => sum + c.telemetry.solved, 0);
  const totalEscalated = visibleCompanies.reduce((sum, c) => sum + c.telemetry.escalated, 0);
  const totalResponses = totalSolved + totalEscalated;
  const globalResolutionRate =
    totalResponses > 0 ? Math.round((totalSolved / totalResponses) * 100) : 0;

  // Selected company calculations
  const compSolved = selectedCompany?.telemetry.solved || 0;
  const compEscalated = selectedCompany?.telemetry.escalated || 0;
  const compTotal = compSolved + compEscalated;
  const compSolveRate = compTotal > 0 ? Math.round((compSolved / compTotal) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. COMPACT INFRASTRUCTURE & LIVE DB PULSE BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-lg font-bold tracking-tight text-white">
              Super Admin Control Plane — Live Client &amp; RAG Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            100% live data synced directly from Neon PostgreSQL and Qdrant Vector Cloud.
          </p>
        </div>

        {/* Live Stack Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-300">Neon DB:</span>
            <span className="font-mono font-semibold text-white">
              {dbOnline ? `${neonLatencyMs}ms` : "Waking"}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-300">Qdrant Chunks:</span>
            <span className="font-mono font-semibold text-white">{totalQdrantVectors}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-slate-300">RAG Engine:</span>
            <span className="font-mono font-semibold text-emerald-400">Gemini + Cohere v3</span>
          </div>

          <button
            onClick={fetchRealTelemetry}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Refresh Live Data"}
          </button>
        </div>
      </div>

      {/* 2. TOP-LEVEL REAL METRICS SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Registered Companies
          </span>
          <div className="text-3xl font-bold text-slate-900 mt-1">
            {visibleCompanies.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Active client organizations in Neon DB</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Queries Processed
          </span>
          <div className="text-3xl font-bold text-slate-900 mt-1">{totalQueries}</div>
          <p className="text-xs text-slate-500 mt-1">
            Across {visibleCompanies.reduce((s, c) => s + c.telemetry.sessionsCount, 0)} user chat sessions
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Solved by AI (From Docs)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-emerald-600">{totalSolved}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {globalResolutionRate}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Grounded in uploaded Qdrant docs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Escalated to Human
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-rose-600">{totalEscalated}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {totalResponses > 0 ? 100 - globalResolutionRate : 0}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Out-of-scope or &lt;0.250 vector score</p>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE INSPECTOR: LEFT CLIENT LIST + RIGHT KNOWLEDGE BASE & TELEMETRY */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
          Loading real client workspaces and Qdrant knowledge base telemetry...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR (4 COLS): REGISTERED CLIENT COMPANIES */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  Registered Client Workspaces
                </h2>
                <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-slate-200/80 text-slate-700 rounded">
                  {visibleCompanies.length}
                </span>
              </div>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company, domain, or email..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto p-2.5 space-y-2">
              {visibleCompanies.map((comp) => {
                const isSelected = comp.id === selectedCompany?.id;
                const hasDocs = comp.knowledgeBase.vectorChunks > 0;

                return (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedId(comp.id);
                      setShowChunkPreviews(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate flex items-center gap-2">
                          <Building2
                            className={`h-4 w-4 shrink-0 ${
                              isSelected ? "text-rose-400" : "text-slate-400"
                            }`}
                          />
                          <span className="truncate">{comp.name}</span>
                        </div>
                        <div
                          className={`text-xs font-mono truncate mt-0.5 ${
                            isSelected ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {comp.domain}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                          hasDocs
                            ? isSelected
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isSelected
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {hasDocs ? `${comp.knowledgeBase.vectorChunks} Chunks` : "No Docs Yet"}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/20 flex items-center justify-between text-xs">
                      <span className={isSelected ? "text-slate-300" : "text-slate-600"}>
                        {comp.telemetry.sessionsCount} sessions • {comp.telemetry.queries} queries
                      </span>
                      <div className="flex items-center gap-2 font-semibold">
                        <span className={isSelected ? "text-emerald-300" : "text-emerald-600"}>
                          {comp.telemetry.solved}✓
                        </span>
                        <span className={isSelected ? "text-rose-300" : "text-rose-600"}>
                          {comp.telemetry.escalated}⚠
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional toggle to view auto-generated test workspaces */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showLegacyIds}
                  onChange={(e) => setShowLegacyIds(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-0"
                />
                <span>Show system test IDs (org_ / demo)</span>
              </label>
            </div>
          </div>

          {/* RIGHT PANEL (8 COLS): SELECTED COMPANY DETAILS, UPLOADED DOCS & SESSIONS */}
          {selectedCompany ? (
            <div className="lg:col-span-8 space-y-6">
              
              {/* A. SELECTED CLIENT & COMPANY PROFILE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedCompany.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active Workspace
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                        {selectedCompany.domain}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {selectedCompany.clientEmail}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        <Terminal className="h-3 w-3" />
                        Tenant ID: {selectedCompany.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* B. UPLOADED DOCUMENTS & QDRANT VECTOR KNOWLEDGE BASE */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-indigo-500" />
                      Uploaded Knowledge Base &amp; Qdrant Vector Index
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      Collection: <strong className="text-slate-700">{selectedCompany.knowledgeBase.collectionName}</strong>
                    </span>
                  </div>

                  {selectedCompany.knowledgeBase.vectorChunks > 0 ? (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-lg bg-indigo-600 text-white shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {selectedCompany.knowledgeBase.documents.join(", ")}
                            </div>
                            <div className="text-xs text-slate-600 mt-0.5">
                              <strong>{selectedCompany.knowledgeBase.vectorChunks} vector chunks</strong> embedded via Cohere <code className="font-mono text-[11px]">embed-english-v3.0</code> &amp; isolated in Qdrant under <code className="font-mono text-[11px]">{selectedCompany.id.slice(0, 8)}...</code>
                            </div>
                          </div>
                        </div>

                        {selectedCompany.knowledgeBase.chunkPreviews.length > 0 && (
                          <button
                            onClick={() => setShowChunkPreviews((prev) => !prev)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-50 transition-colors shrink-0 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {showChunkPreviews ? "Hide Indexed Chunks" : "Inspect Indexed Chunks"}
                            {showChunkPreviews ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expandable Real Vector Chunk Previews from Qdrant */}
                      {showChunkPreviews && selectedCompany.knowledgeBase.chunkPreviews.length > 0 && (
                        <div className="pt-3 border-t border-indigo-200/60 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                            Live Indexed Vector Payloads in Qdrant ({selectedCompany.knowledgeBase.chunkPreviews.length} sample chunks):
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedCompany.knowledgeBase.chunkPreviews.map((chunk, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg bg-white border border-indigo-100 font-mono text-xs text-slate-700 leading-relaxed"
                              >
                                <span className="text-indigo-500 font-bold mr-2">[Chunk #{i + 1}]</span>
                                {chunk}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-200 text-slate-500">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-700">
                            No Knowledge Base Document Uploaded Yet
                          </div>
                          <div className="text-xs text-slate-500">
                            0 vector chunks found in Qdrant for tenant <code className="font-mono">{selectedCompany.id}</code>.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* C. AI RESOLUTION VS HUMAN ESCALATION METRICS FOR THIS COMPANY */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Support Resolution Telemetry for {selectedCompany.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                        <span>Total Queries Asked</span>
                        <MessageSquare className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {selectedCompany.telemetry.queries}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Across {selectedCompany.telemetry.sessionsCount} user chat sessions
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                      <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
                        <span>AI Solved Automatically</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-emerald-700">{compSolved}</span>
                        <span className="text-xs font-bold text-emerald-600">
                          ({compSolveRate}%)
                        </span>
                      </div>
                      <div className="text-xs text-emerald-700/80 mt-1">
                        Answered from uploaded Qdrant docs
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                      <div className="text-xs font-semibold text-rose-800 flex items-center justify-between">
                        <span>Escalated to Human</span>
                        <UserCheck className="h-4 w-4 text-rose-600" />
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-rose-700">{compEscalated}</span>
                        <span className="text-xs font-bold text-rose-600">
                          ({compTotal > 0 ? 100 - compSolveRate : 0}%)
                        </span>
                      </div>
                      <div className="text-xs text-rose-700/80 mt-1">
                        Triggered by &lt;0.250 score or LLM ESCALATE
                      </div>
                    </div>
                  </div>

                  {compTotal > 0 && (
                    <div className="mt-4">
                      <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${compSolveRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* D. REAL USER CHAT SESSIONS FOR THIS COMPANY */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      User Chat Sessions ({selectedCompany.sessions.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Every chat session recorded for <strong>{selectedCompany.name}</strong> with solved and escalated counts.
                    </p>
                  </div>
                </div>

                {selectedCompany.sessions.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    No chat sessions recorded for <strong>{selectedCompany.name}</strong> yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white border-b border-slate-100 uppercase tracking-wider text-slate-400 font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Session ID</th>
                          <th className="px-6 py-3.5">Latest User Question</th>
                          <th className="px-6 py-3.5">Queries</th>
                          <th className="px-6 py-3.5">AI Solved</th>
                          <th className="px-6 py-3.5">Escalated</th>
                          <th className="px-6 py-3.5">Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedCompany.sessions.map((sess) => (
                          <tr key={sess.sessionId} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                              {sess.sessionId}
                            </td>
                            <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate" title={sess.lastQueryPreview}>
                              {sess.lastQueryPreview}
                            </td>
                            <td className="px-6 py-3.5 font-mono font-semibold text-slate-700">
                              {sess.queries}
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                {sess.solved}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span
                                className={`px-2 py-0.5 rounded font-bold border ${
                                  sess.escalated > 0
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                }`}
                              >
                                {sess.escalated}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 whitespace-nowrap">
                              {sess.status === "ESCALATED" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                  <AlertTriangle className="h-3 w-3" />
                                  Escalated to Human
                                </span>
                              ) : sess.status === "RESOLVED" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Solved by AI
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                                  No Messages
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}