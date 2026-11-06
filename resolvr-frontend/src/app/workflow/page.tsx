"use client";

import Link from "next/link";
import { 
  Bot, 
  ArrowRight,
  AlertTriangle,
  FileText,
  Inbox,
  User
} from "lucide-react";

// ============================================================================
// CUSTOM HIGH-FIDELITY SVGS
// ============================================================================

const NodeWaveIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22L12 2l8 20" />
    <path d="M12 2v20" />
    <circle cx="12" cy="2" r="2" fill="currentColor" />
    <circle cx="4" cy="22" r="2" fill="currentColor" />
    <circle cx="20" cy="22" r="2" fill="currentColor" />
  </svg>
);

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* PERFECTLY UNIFIED GLOBAL HEADER */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-[#FAFAFA]/80 px-6 backdrop-blur-xl lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 transition-transform group-hover:scale-105">
            <div className="h-1 w-1 rounded-full bg-white" />
          </div>
          <span className="font-bold tracking-tight text-slate-900 text-sm">
            RESOLVR
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-5 md:flex pr-6 border-r border-slate-200">
            <Link href="/workflow" className="text-xs font-bold text-indigo-600 transition-colors">
              Workflow
            </Link>
            <Link href="/vision" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Vision
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Login
            </Link>
            <Link href="/sign-up" className="rounded bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20">
              Initialize Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Hero: Immersive Dark Canvas */}
      <section className="relative overflow-hidden bg-[#030712] py-32 lg:py-40 border-b border-white/5">
        {/* Animated Cinematic Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse-slow-delay"></div>
        
        {/* Radar Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/[0.02] rounded-full pointer-events-none"></div>
        
        <div className="relative mx-auto max-w-[1000px] px-6 text-center z-10">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold tracking-widest text-indigo-300 mb-8 uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all cursor-default">
            <NodeWaveIcon />
            System Architecture
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white leading-[1.05]">
            How Resolvr Works.
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
            From the moment you upload your PDF manuals, to the second a human agent takes over an escalated ticket. This is the complete, transparent user journey.
          </p>
        </div>
      </section>

      {/* THE UNIFIED USER JOURNEY TIMELINE */}
      <section className="py-32 bg-white border-t border-slate-200 overflow-hidden relative">
        {/* Background Subtle Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

        <div className="mx-auto max-w-[1200px] px-6 lg:px-16 relative z-10">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-[38px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 -translate-x-1/2 rounded-full overflow-hidden">
            <div className="w-full h-1/4 bg-gradient-to-b from-indigo-300 via-indigo-500 to-indigo-300 rounded-full animate-[slideDown_4s_linear_infinite]"></div>
          </div>

          {/* STEP 1: ADMIN SETUP (Upload PDF Knowledge) */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-24 md:mb-40 group">
            
            {/* Step 1 Text (Dark Blue / Indigo Focus) */}
            <div className="w-full md:w-5/12 text-left md:text-right pr-0 md:pr-16 pl-20 md:pl-0 order-2 md:order-1 mt-6 md:mt-0">
              <span className="text-indigo-600 font-bold tracking-widest text-[10px] uppercase mb-3 block">Step 01</span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">You upload your company's knowledge</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                As an admin, you don't need to write any code. You simply log into the Resolvr dashboard and drag-and-drop your company's PDF manuals, policies, or product guides. Our engine automatically extracts the text, preserves the formatting, and builds a secure vector database in seconds.
              </p>
            </div>
            
            {/* Step 1 Icon (Glowing 3D Folder) */}
            <div className="absolute left-[38px] md:left-1/2 w-16 h-16 rounded-full bg-white border-4 border-indigo-50 flex items-center justify-center -translate-x-1/2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 transition-all duration-500 group-hover:border-indigo-500 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(79,70,229,0.5)]">
              <img src="https://img.icons8.com/3d-fluency/94/opened-folder.png" alt="3D Folder" className="w-8 h-8 object-contain" />
            </div>
            
            {/* Step 1 Visual (Sleek PDF Dropzone UI) */}
            <div className="w-full md:w-5/12 pl-20 md:pl-16 order-1 md:order-2">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl group-hover:-translate-y-2 transition-transform duration-500">
                {/* Drag and Drop Area */}
                <div className="border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 p-10 flex flex-col items-center justify-center text-center mb-6 transition-colors group-hover:bg-indigo-50/80">
                  <div className="h-16 w-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-5">
                    <FileText className="h-8 w-8 text-indigo-500" />
                  </div>
                  <span className="text-lg font-bold text-slate-800 mb-1">Drag & drop your PDFs here</span>
                  <span className="text-[13px] text-slate-500 font-medium">Up to 50MB per file</span>
                </div>
                {/* Processing Bar */}
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-rose-500" /> enterprise_manual_v2.pdf
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded uppercase tracking-widest animate-pulse">Vectorizing</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                    <div className="w-[68%] h-full bg-indigo-500 rounded-full relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[slideRight_1s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Processing Articles...</span>
                    <span>1,432 / 2,100</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* STEP 2: CONSUMER CHAT (Emerald Focus) */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-24 md:mb-40 group">
            
            {/* Step 2 Text */}
            <div className="w-full md:w-5/12 pr-0 md:pr-16 pl-20 md:pl-0 order-2 md:order-2 mt-6 md:mt-0 text-left">
              <span className="text-emerald-600 font-bold tracking-widest text-[10px] uppercase mb-3 block">Step 02</span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">The AI instantly answers user queries</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                You embed our chat widget on your website. When a customer asks a question, Resolvr searches your uploaded PDFs and provides an instant, highly accurate answer. Because it strictly uses only the verified data you provided, it will never hallucinate or invent answers.
              </p>
            </div>
            
            {/* Step 2 Icon (Glowing 3D Chat) */}
            <div className="absolute left-[38px] md:left-1/2 w-16 h-16 rounded-full bg-white border-4 border-emerald-50 flex items-center justify-center -translate-x-1/2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 transition-all duration-500 group-hover:border-emerald-500 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <img src="https://img.icons8.com/3d-fluency/94/chat.png" alt="3D Chat" className="w-9 h-9 object-contain mt-1" />
            </div>
            
            {/* Step 2 Visual (The Chat UI) */}
            <div className="w-full md:w-5/12 pl-20 md:pl-0 pr-0 md:pr-16 order-1 md:order-1">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                <div className="bg-slate-900 px-5 py-4 text-white flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-bold tracking-wide">Acme Support Widget</span>
                </div>
                <div className="p-6 space-y-5 bg-slate-50">
                  <div className="flex justify-end">
                    <div className="bg-slate-200 text-slate-800 text-xs font-medium px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                      Can I upgrade midway through my billing cycle?
                    </div>
                  </div>
                  <div className="flex gap-3 items-end">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] leading-relaxed">
                      Yes! Prorated upgrades are processed automatically. The difference will be applied to your next monthly invoice.
                    </div>
                  </div>
                  <div className="flex justify-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200 shadow-sm">
                      ✓ Answer extracted from PDF
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* STEP 3: ESCALATION (Amber Focus - Dashboard UI) */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-24 md:mb-40 group">
            
            {/* Step 3 Text */}
            <div className="w-full md:w-5/12 text-left md:text-right pr-0 md:pr-16 pl-20 md:pl-0 order-2 md:order-1 mt-6 md:mt-0">
              <span className="text-amber-600 font-bold tracking-widest text-[10px] uppercase mb-3 block">Step 03</span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Complex queries route to your agents</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Resolvr knows what it doesn't know. If a customer asks a highly specific question that isn't in your documentation, the AI refuses to guess. Instead, it instantly escalates the ticket straight into your Resolvr Support Inbox so a human agent can seamlessly take over.
              </p>
            </div>
            
            {/* Step 3 Icon (Glowing 3D Headset/Agent) */}
            <div className="absolute left-[38px] md:left-1/2 w-16 h-16 rounded-full bg-white border-4 border-amber-50 flex items-center justify-center -translate-x-1/2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 transition-all duration-500 group-hover:border-amber-500 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]">
              <img src="https://img.icons8.com/3d-fluency/94/headset.png" alt="3D Headset" className="w-8 h-8 object-contain" />
            </div>
            
            {/* Step 3 Visual (Admin Inbox Dashboard UI) */}
            <div className="w-full md:w-5/12 pl-20 md:pl-16 order-1 md:order-2">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-500 flex flex-col">
                {/* Inbox Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                      <Inbox className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Support Inbox</div>
                      <div className="text-[11px] font-semibold text-slate-500">2 Active Escalations</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-md uppercase tracking-widest border border-amber-200">Needs Review</span>
                </div>
                
                {/* List of Tickets */}
                <div className="p-6 flex flex-col gap-4 bg-white">
                  {/* Ticket 1 (Active/Escalated) */}
                  <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-5 shadow-sm relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                     <div className="flex justify-between items-start mb-3">
                       <span className="text-sm font-bold text-slate-900">SAML SSO Implementation</span>
                       <span className="text-[10px] font-bold text-slate-400">2m ago</span>
                     </div>
                     <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">User asked about configuring a custom IdP. AI vector confidence <span className="text-amber-600 font-bold">0.12</span>. Escaped to human.</p>
                     <div className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">JD</div>
                       <span className="text-xs font-semibold text-slate-500">john.doe@acme.com</span>
                     </div>
                  </div>
                  
                  {/* Ticket 2 (Lower Priority) */}
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-5 opacity-60">
                     <div className="flex justify-between items-start mb-3">
                       <span className="text-sm font-bold text-slate-800">Billing Cycle Refund</span>
                       <span className="text-[10px] font-bold text-slate-400">1h ago</span>
                     </div>
                     <p className="text-xs text-slate-500 font-medium">Need partial refund for unused seats on the enterprise plan...</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* STEP 4: ANALYTICS DASHBOARD (Violet Focus) */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between group">
            
            {/* Step 4 Text */}
            <div className="w-full md:w-5/12 pr-0 md:pr-16 pl-20 md:pl-0 order-2 md:order-2 mt-6 md:mt-0 text-left">
              <span className="text-violet-600 font-bold tracking-widest text-[10px] uppercase mb-3 block">Step 04</span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">You monitor everything on the Dashboard</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                You are always in control. Log into your Admin Dashboard to see exactly how much time and money you are saving. Track your automated deflection rate, review token usage, and discover which questions are escalating so you know exactly which PDFs to upload next.
              </p>
            </div>
            
            {/* Step 4 Icon (Glowing 3D Chart) */}
            <div className="absolute left-[38px] md:left-1/2 w-16 h-16 rounded-full bg-white border-4 border-violet-50 flex items-center justify-center -translate-x-1/2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-10 transition-all duration-500 group-hover:border-violet-500 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]">
              <img src="https://img.icons8.com/3d-fluency/94/bar-chart.png" alt="3D Chart" className="w-8 h-8 object-contain" />
            </div>
            
            {/* Step 4 Visual (Premium Dark Mode Dashboard) */}
            <div className="w-full md:w-5/12 pl-20 md:pl-0 pr-0 md:pr-16 order-1 md:order-1">
              <div className="bg-[#0A0A0A] rounded-3xl border border-slate-800 p-8 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 blur-3xl rounded-full"></div>
                
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Telemetry</span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md">
                    System Healthy <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-slate-800 rounded-2xl p-5 shadow-inner group-hover:border-violet-500/30 transition-colors duration-500">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Deflection Rate</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">78.4%</span>
                  </div>
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-slate-800 rounded-2xl p-5 shadow-inner group-hover:border-violet-500/30 transition-colors duration-500">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Escalations</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">21.6%</span>
                  </div>
                  
                  {/* Big Glowing Chart Area */}
                  <div className="bg-[#111] border border-slate-800 rounded-2xl p-5 col-span-2 relative overflow-hidden group-hover:border-violet-500/30 transition-colors duration-500">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tokens Processed</span>
                        <span className="text-xl font-black text-white">1.4M</span>
                      </div>
                    </div>
                    {/* Beautiful SVG Wave */}
                    <div className="h-12 w-full mt-2 relative">
                      <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,30 L0,15 C20,20 30,5 50,15 C70,25 80,10 100,5 L100,30 Z" fill="url(#wave-gradient)" className="opacity-20" />
                        <path d="M0,15 C20,20 30,5 50,15 C70,25 80,10 100,5" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
                        <defs>
                          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Ready to deploy your agent?
          </h2>
          <p className="text-base text-slate-400 font-medium">
            Upload your first PDF manual, customize your widget, and start deflecting tickets today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link href="/sign-up" className="rounded bg-indigo-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-400 shadow-lg hover:shadow-indigo-500/25">
              Initialize Workspace
            </Link>
            <Link href="/" className="rounded border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-bold text-slate-300 transition-all hover:bg-slate-800">
              Back to Overview
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-12 text-center text-[10px] font-bold tracking-widest text-slate-500 uppercase md:px-12 border-t border-slate-900">
        RESOLVR ARCHITECTURE • MULTI-TENANT AUTONOMOUS TRIAGE ENGINE
      </footer>

      {/* Custom Keyframes for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slow-delay {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 2s;
        }
      `}} />
    </div>
  );
}