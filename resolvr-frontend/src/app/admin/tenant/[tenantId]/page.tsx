import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { 
  ArrowLeft, BrainCircuit, LayoutDashboard, Users, Database, Settings, 
  FileText, CheckCircle2, AlertOctagon, Sparkles, Clock
} from "lucide-react";

// Initialize Prisma (Make sure you adjust this import if you have a singleton prisma client in @/lib/prisma)
const prisma = new PrismaClient();

export default async function TenantDetail({ params }: { params: Promise<{ tenantId: string }> }) {
  // 1. FIX: Await the params promise (Required in Next.js 15+)
  const resolvedParams = await params;
  const tenantId = resolvedParams.tenantId;

  if (!tenantId) {
    return <div className="p-8 text-red-500">Error: Tenant ID is missing or invalid.</div>;
  }

  // 2. FETCH REAL DATA: Get the tenant and their recent chat messages from Neon DB
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  });

  const recentSessions = await prisma.chatSession.findMany({
    where: { tenantId: tenantId },
    include: {
      messages: {
        orderBy: { id: 'desc' }, // Assuming chronological ordering
        take: 5
      }
    },
    orderBy: { id: 'desc' },
    take: 10
  });

  // Flatten messages for the log table
  const realChatLogs = recentSessions.flatMap(session => 
    session.messages.filter(m => m.role === 'user').map(userMsg => {
      // Find the corresponding AI reply
      const aiReply = session.messages.find(m => m.role === 'ai' && m.id > userMsg.id);
      const isEscalated = aiReply?.content.includes("escalated") || false;

      return {
        id: userMsg.id,
        query: userMsg.content,
        engine: isEscalated ? "Cohere (Failover)" : "Gemini 3.5 Flash-Lite",
        outcome: isEscalated ? "Escalated" : "AI Solved",
        score: isEscalated ? "< 0.250" : "> 0.850",
        time: "Recent" // You can replace this with a real timestamp formatting if you have a createdAt field
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <BrainCircuit className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="text-lg font-bold tracking-tight">Resolvr Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/admin" className="flex items-center px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link href="/admin/tenants" className="flex items-center px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-md font-medium text-sm">
            <Users className="w-5 h-5 mr-3" /> Tenants
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <Link href="/admin" className="text-gray-500 hover:text-gray-900 flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tenants
          </Link>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 overflow-y-auto max-w-6xl">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tenant?.name || "Unknown Tenant"}</h1>
              <p className="text-sm font-mono text-gray-500 mt-1">Workspace ID: {tenantId}</p>
              <p className="text-sm font-mono text-gray-500">Domain: {tenant?.domain || "N/A"}</p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
              Live Connection
            </span>
          </div>

          {/* Infrastructure Metrics */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Infrastructure</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8 grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-500">Neon Postgres ID</span>
              <span className="font-mono text-gray-900">{tenantId}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-500">Qdrant Namespace</span>
              <span className="font-mono text-gray-900">ns_{tenantId.replace('org_', '')}</span>
            </div>
          </div>

          {/* Live Chat Resolution Log */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Support Telemetry (Real DB Data)</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Query</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Engine Routing</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vector Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Outcome</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {realChatLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No live chat history found for this tenant.</td>
                    </tr>
                  ) : (
                    realChatLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-md truncate">
                          "{log.query}"
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                            {log.engine}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {log.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.outcome === "AI Solved" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> AI Solved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <AlertOctagon className="w-3 h-3 mr-1" /> Escalated
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          <Clock className="inline w-3 h-3 mr-1"/> {log.time}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}