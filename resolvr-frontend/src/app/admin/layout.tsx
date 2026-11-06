"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  ShieldAlert, 
  Activity, 
  CreditCard, 
  LogOut,
  Settings,
  Lock
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navItems = [
    { name: "System Metrics", href: "/admin", icon: Activity },
    { name: "Billing & Usage", href: "/admin/billing", icon: CreditCard },
    { name: "Global Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* TOP NAVIGATION (Visually distinct from the client sidebar) */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            {/* Super Admin Brand */}
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <ShieldAlert className="h-5 w-5 text-rose-500" />
              </div>
              <span className="font-bold tracking-widest text-sm uppercase text-slate-100">
                Resolvr <span className="text-rose-500">Admin</span>
              </span>
            </Link>

            {/* Top Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-slate-800 text-white border border-slate-700/80 shadow-inner" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-rose-400" : ""}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Privacy Mode Pill + Admin Identity + Logout */}
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[11px] font-mono text-slate-300">
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>ZERO-PII TELEMETRY MODE</span>
            </div>

            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="font-semibold text-slate-200">
                {session?.user?.email || "System Root"}
              </span>
              <span className="text-rose-400/90 font-mono text-[11px]">
                Super Administrator
              </span>
            </div>

            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors border border-transparent hover:border-slate-700"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT VIEWPORT */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        {status === "loading" ? (
          <div className="h-64 flex items-center justify-center text-slate-400 font-medium text-sm gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            Verifying Root Access...
          </div>
        ) : (
          children
        )}
      </main>

    </div>
  );
}