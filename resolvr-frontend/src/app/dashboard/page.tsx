"use client";

import { CheckCircle2, AlertTriangle, Database, ArrowUpRight, Clock } from "lucide-react";

interface EscalationRecord {
  id: string;
  query: string;
  reason: "Low Vector Certainty" | "Tool Call Timeout" | "LLM Self-Reflection";
  score: number;
  crmStatus: "Pushed to HubSpot" | "Delivered";
  timestamp: string;
}

const mockEscalations: EscalationRecord[] = [
  { id: "sess_rk3igsdw", query: "How do I bake a chocolate cake?", reason: "Low Vector Certainty", score: 0.135, crmStatus: "Pushed to HubSpot", timestamp: "10 mins ago" },
  { id: "sess_nr441d96", query: "Need to update card billing on suspended plan", reason: "LLM Self-Reflection", score: 0.312, crmStatus: "Pushed to HubSpot", timestamp: "42 mins ago" },
  { id: "sess_gbz8vysq", query: "Account migration tool throws 504 error", reason: "Tool Call Timeout", score: 0.441, crmStatus: "Delivered", timestamp: "2 hours ago" },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Support Operations
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Real-time telemetry and triage metrics for autonomous customer resolution.
        </p>
      </div>

      {/* KPI Blocks (Now 4 blocks including ROI) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* KPI 1 */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm font-bold uppercase tracking-wider">Auto-Resolution</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-gray-900">78.4%</span>
            <span className="text-xs font-bold text-emerald-600">+3.2%</span>
          </div>
        </div>

        {/* KPI 2 (NEW BUSINESS ROI METRIC) */}
        <div className="flex flex-col justify-between rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-sm font-bold uppercase tracking-wider">Hours Saved (7d)</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-indigo-950">42.5h</span>
            <span className="text-xs font-bold text-indigo-600">~$1,200 ROI</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm font-bold uppercase tracking-wider">Tickets Escalated</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-gray-900">124</span>
            <span className="text-xs font-medium text-gray-500">Routed to CRM</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm font-bold uppercase tracking-wider">Vector Memory</span>
            <Database className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-4 flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900">Online</span>
            <span className="text-xs font-medium text-gray-500 mt-1">15 Docs Synced (Qdrant)</span>
          </div>
        </div>
      </div>

      {/* Recent Escalations Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Recent CRM Dispatches
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              Conversations intercepted by the Triangulation Engine and pushed to human support.
            </p>
          </div>
          <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-mono font-bold text-gray-500 shadow-sm">
            Zero Local Storage • Direct CRM Emitter
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3">Session ID</th>
                <th className="px-5 py-3">Trigger Query</th>
                <th className="px-5 py-3">Escalation Reason</th>
                <th className="px-5 py-3">Retrieval Score</th>
                <th className="px-5 py-3">CRM Status</th>
                <th className="px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-xs">
              {mockEscalations.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-5 py-4 font-sans font-medium text-gray-700 max-w-xs truncate">
                    "{item.query}"
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-gray-600 font-medium">
                      {item.reason}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-500">
                    {/* Visual cue if score drops below threshold */}
                    <span className={item.score < 0.25 ? "text-rose-500 font-bold" : "text-gray-500"}>
                      {item.score.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 font-medium text-gray-600">
                      {item.crmStatus}
                      <ArrowUpRight className="h-3 w-3 text-gray-400" />
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-500">
                    {item.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}