"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Database, 
  Blocks, 
  Activity, 
  LogOut,
  Building2
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Pull company name from your custom NextAuth token
  const companyName = (session?.user as any)?.companyName || "Client Workspace";

  const navItems = [
    { name: "Support Operations", href: "/dashboard", icon: LayoutDashboard },
    { name: "Knowledge Base", href: "/dashboard/knowledge", icon: Database },
    { name: "Integrations & Deploy", href: "/dashboard/deploy", icon: Blocks },
    { name: "Triage Sandbox", href: "/dashboard/sandbox", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center mr-3 shadow-sm">
            <span className="text-white text-xs font-black">R</span>
          </div>
          <span className="font-display font-black text-lg tracking-tight">RESOLVR</span>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <Building2 className="w-4 h-4 text-gray-500" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-gray-900 truncate">{companyName}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Client Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-700" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}