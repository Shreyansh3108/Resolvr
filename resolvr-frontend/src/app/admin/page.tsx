import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { 
  LayoutDashboard, Users, Database, Settings, Bell, Search, 
  FileText, BrainCircuit 
} from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  
  // FETCH REAL DATA: Pull all tenants from Neon DB
  const dbTenants = await prisma.tenant.findMany({
    include: {
      chatSessions: true
    },
    orderBy: { id: 'asc' }
  });

  // Calculate dynamic stats
  const totalTenants = dbTenants.length;
  const totalSessions = dbTenants.reduce((acc, curr) => acc + curr.chatSessions.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <BrainCircuit className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="text-lg font-bold tracking-tight">Resolvr Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/admin" className="flex items-center px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-md font-medium text-sm">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors">
            <Users className="w-5 h-5 mr-3" /> Tenants
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">SD</div>
            <div className="ml-3">
              <p className="text-sm font-medium">Shreyansh Dwivedi</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex-1 flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tenants or workspace IDs..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600"><Bell className="w-5 h-5" /></button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              + New Tenant
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Shreyansh</h1>
            <p className="text-sm text-gray-500 mt-1">Live infrastructure telemetry synced with Neon Database.</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Tenants</p>
              <p className="text-3xl font-bold text-gray-900">{totalTenants}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Live Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Database Status</p>
              <p className="text-3xl font-bold text-emerald-600">Connected</p>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Active Workspaces (Real Data)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspace ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chat Sessions</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dbTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{tenant.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-500">{tenant.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {tenant.domain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tenant.chatSessions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/tenant/${tenant.id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}