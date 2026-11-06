"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, AlertTriangle, Crosshair, Lock, Users, Code2 } from "lucide-react";

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* PERFECTLY UNIFIED GLOBAL HEADER */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white/60 px-6 backdrop-blur-xl lg:px-12">
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
            <Link href="/workflow" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Workflow
            </Link>
            <Link href="/vision" className="text-xs font-bold text-indigo-600 transition-colors">
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

      {/* Hero: Immersive Dark Manifesto Intro */}
      <section className="relative overflow-hidden bg-[#030712] py-24 lg:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative mx-auto max-w-[900px] px-6 text-center z-10 flex flex-col items-center">
          <div className="mb-8 animate-float">
            <img src="https://img.icons8.com/3d-fluency/94/dice.png" alt="3D Dice" className="w-14 h-14 object-contain drop-shadow-[0_10px_20px_rgba(244,63,94,0.3)]" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-300 mb-6 uppercase backdrop-blur-md">
            Our Philosophy
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white leading-[1.05] max-w-3xl">
            Customer support shouldn't be a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">slot machine.</span>
          </h1>
          
          <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
            Why we built a deterministic, math-driven architecture for an inherently unpredictable technology.
          </p>
        </div>
      </section>
        
      {/* EDITORIAL CONTENT: The Sierra/Decagon Glossy Canvas */}
      <article className="relative z-10 pb-24 overflow-hidden bg-[#F4F7FB]">
        
        {/* PRISTINE STRUCTURAL BACKGROUND (Extended full length) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* TOP SMOOTH FADE: Dark hero transition into the light canvas */}
          <div className="absolute top-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-b from-[#030712] to-transparent z-30"></div>
          
          {/* Subtle Edge Glows: Extended down the page to keep the cool tones consistent */}
          <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[700px] bg-indigo-300/20 blur-[120px] rounded-full z-0"></div>
          <div className="absolute top-[30%] right-[-10%] w-[40%] h-[600px] bg-sky-300/20 blur-[120px] rounded-full z-0"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[700px] bg-indigo-300/15 blur-[120px] rounded-full z-0"></div>

          {/* Architectural Precision Grid: Linear mask extends it all the way down to the footer */}
          <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)] opacity-[0.6]"></div>

          {/* The Core Light: Height changed to full so the center illumination doesn't abruptly stop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full bg-[radial-gradient(ellipse_100%_100%_at_top,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_100%)] z-10"></div>
        </div>
        {/* Intro Block (Glossy Glassmorphism) ... [The rest of your code continues exactly as is below this] */}
        
        <section className="relative mx-auto max-w-[850px] px-6 mb-24 mt-12 z-10">
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white overflow-hidden text-center">
            {/* The Glossy Lip */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 pointer-events-none"></div>
            
            <h2 className="relative z-10 text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-6">
              The first wave of AI support tools made the exact same critical error: <br className="hidden md:block" />
              <span className="text-slate-500">they optimized for conversation over accuracy.</span>
            </h2>
            <div className="relative z-10 h-px w-16 bg-slate-300 mx-auto mb-6"></div>
            <p className="relative z-10 text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              They connected Large Language Models directly to chat widgets, allowing the AI to freestyle answers, summarize vaguely, and prioritize sounding "human" over being strictly correct. For a consumer app, this is charming. For a B2B enterprise company, it is a massive liability.
            </p>
          </div>
        </section>

        {/* SECTION 1: The Problem */}
        <section className="relative mx-auto max-w-[1000px] px-6 mb-28 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-2 py-1 rounded">The Risk</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">The Hallucination Epidemic</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">
                When a customer asks a highly technical question about API rate limits, billing cycles, or SOC 2 compliance, they do not need a conversational partner. They need a precise database query masquerading as a sentence.
              </p>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                If standard chatbots cannot find an answer, they are fundamentally trained to guess. This results in fabricated return policies, invented technical specs, and broken trust. Imagine an AI offering a 90-day refund when your enterprise contract explicitly states 30 days. In B2B support, a hallucination isn't just an error—<strong className="text-slate-900">it's a breach of contract.</strong>
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              {/* Glossy Circle Plate */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/50 backdrop-blur-xl flex items-center justify-center border border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-float">
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/60 pointer-events-none"></div>
                <img src="https://img.icons8.com/3d-fluency/94/error.png" alt="3D Warning" className="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(244,63,94,0.2)]" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: The Solution */}
        <section className="relative mx-auto max-w-[1000px] px-6 mb-28 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-1 md:order-1 flex justify-center md:justify-start">
              {/* Glossy Circle Plate */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/50 backdrop-blur-xl flex items-center justify-center border border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-float-delay">
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/60 pointer-events-none"></div>
                <img src="https://img.icons8.com/3d-fluency/94/mind-map.png" alt="3D Triangulation" className="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(99,102,241,0.2)]" />
              </div>
            </div>
            <div className="order-2 md:order-2">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">The Architecture</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">The Triangulation Engine</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">
                We built Resolvr to be a system of strict boundaries. We physically separated the retrieval of your verified PDF information from the generative AI text model. Standard models generate text token-by-token. Triangulation measures semantic proximity before a single token is ever generated.
              </p>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Before the agent types a word, it calculates a mathematical vector score against your documentation. If the user's query maps closely to your data, the LLM is permitted to format the response. If the score falls below a hard-coded <code className="text-slate-800 bg-white border border-slate-200 shadow-sm px-1.5 py-0.5 rounded font-mono text-xs">0.25</code> threshold, the system immediately cuts power to the generative engine. It simply refuses to guess.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Engineering Reality */}
        <section className="relative mx-auto max-w-[1000px] px-6 mb-28 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">For Developers</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Software Engineering, Not Prompt Engineering</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">
                Most AI wrappers rely on massive, fragile system prompts to control behavior. When developers try to update logic, they are forced to "prompt whisper"—tweaking adjectives and hoping the model listens.
              </p>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Resolvr replaces fragile prompts with a strictly typed execution pipeline. Vector scoring, fallback protocols, and CRM webhooks are handled by raw backend code, not LLM interpretations. We built a tool that engineering teams can actually trust in production.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              {/* Glossy Circle Plate */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/50 backdrop-blur-xl flex items-center justify-center border border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-float">
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/60 pointer-events-none"></div>
                
                {/* CUSTOM CSS CODE WINDOW */}
                <div className="relative z-10 w-28 h-28 md:w-32 md:h-32 bg-[#0B0F19] rounded-xl border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden">
                  <div className="h-5 md:h-6 w-full bg-[#1A202C] flex items-center px-2.5 gap-1.5 border-b border-slate-700/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                  </div>
                  <div className="p-3.5 flex flex-col gap-2 md:gap-2.5 justify-center h-full">
                    <div className="flex gap-1.5"><div className="h-1 md:h-1.5 w-6 bg-indigo-400 rounded-full"></div><div className="h-1 md:h-1.5 w-12 bg-slate-400 rounded-full"></div></div>
                    <div className="flex gap-1.5 pl-3"><div className="h-1 md:h-1.5 w-8 bg-sky-400 rounded-full"></div><div className="h-1 md:h-1.5 w-10 bg-slate-500 rounded-full"></div></div>
                    <div className="flex gap-1.5 pl-3"><div className="h-1 md:h-1.5 w-14 bg-indigo-400 rounded-full"></div></div>
                    <div className="flex gap-1.5"><div className="h-1 md:h-1.5 w-5 bg-emerald-400 rounded-full"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Strict Multi-Tenancy (KEPT EXACTLY AS IT WAS) */}
        <section className="relative mx-auto max-w-[1000px] px-6 mb-24 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-1 md:order-1 flex justify-center md:justify-start">
              <div className="relative w-full max-w-[360px] rounded-xl bg-[#0B0F19] border border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full"></div>
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-[#1A202C]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Namespace Isolation</span>
                  <Lock className="h-3.5 w-3.5 text-violet-400" />
                </div>
                <div className="p-5 space-y-4">
                  {/* Mock Tenant Row 1 */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-violet-500/20">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse"></div>
                      <span className="text-xs font-mono text-slate-300">tenant_acme_corp</span>
                    </div>
                    <span className="text-[9px] font-bold text-violet-400 uppercase bg-violet-500/10 px-2 py-1 rounded">Secured</span>
                  </div>
                  {/* Mock Tenant Row 2 */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-slate-600"></div>
                      <span className="text-xs font-mono text-slate-500">tenant_stark_ind</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase bg-slate-800 px-2 py-1 rounded">Isolated</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2 md:order-2">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">Data Governance</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Strict Multi-Tenancy</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium mb-4">
                In the enterprise, your proprietary documentation is your moat. Pushing private PDF manuals into a public AI model's training dataset is a catastrophic security failure.
              </p>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Powered by Clerk authentication and isolated PostgreSQL/Qdrant databases, every enterprise gets a strictly partitioned workspace. Your documents are vectorized into isolated namespaces. The models use your data strictly as read-only context during a live session. <strong className="text-slate-900">Your data never bleeds, and it is never used to train our base models.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: The Operational Guarantees Grid (True Glossy UI) */}
        <section className="relative mx-auto max-w-[1000px] px-6 mb-32 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Decagon-Style Glossy Card 1 */}
            <div className="relative group h-full rounded-3xl bg-white/70 backdrop-blur-2xl border border-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-default">
              {/* Glossy Top Edge Highlight */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">01 // Model Agnosticism</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Immune to Vendor Lock-in</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 group-hover:text-slate-700 transition-colors duration-300">
                    Resolvr physically separates the vector retrieval logic from the text generation. If a better LLM releases tomorrow, you can swap Gemini for another model instantly without rebuilding your data pipeline.
                  </p>
                </div>
                {/* Hardware-Style Status Badge */}
                <div className="mt-auto inline-flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-md px-3 py-1.5 shadow-sm w-fit">
                  <span className="text-[10px] font-mono text-slate-400">Active Engine:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-bold text-slate-700">Gemini 1.5 Pro</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decagon-Style Glossy Card 2 */}
            <div className="relative group h-full rounded-3xl bg-white/70 backdrop-blur-2xl border border-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-default">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">02 // Telemetry</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Context-Preserving Handoff</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    When the engine escalates to a human, it doesn't just send an alert. Backed by PostgreSQL, it packages the complete chat transcript, user metadata, and vector scores directly into your CRM. Users never repeat themselves.
                  </p>
                </div>
              </div>
            </div>

            {/* Decagon-Style Glossy Card 3 */}
            <div className="relative group h-full rounded-3xl bg-white/70 backdrop-blur-2xl border border-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-default">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">03 // Deployment</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">API-First Architecture</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 group-hover:text-slate-700 transition-colors duration-300">
                    You aren't forced to use our UI. Built on Next.js edge functions, Resolvr is fully headless. Ping our <code className="text-[10px] bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 font-mono shadow-sm">/api/triage</code> endpoint from your own custom dashboards, mobile apps, or internal tools.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* THE FOUNDER's LETTER (Glossy Frame) */}
        <section className="relative mx-auto max-w-[750px] px-6 mb-32 z-10">
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl p-10 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white overflow-hidden">
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 pointer-events-none"></div>
            
            <div className="absolute top-6 left-8 text-6xl text-slate-200 font-serif leading-none select-none">"</div>
            <div className="relative z-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 pb-4 border-b border-slate-200/60 inline-block">A Letter from the Founder</h3>
              <div className="space-y-6 text-slate-700 font-serif text-lg leading-relaxed">
                <p>
                  When I began architecting Resolvr, I watched enterprise teams try to force conversational AI into their customer support pipelines. The results were universally terrifying. Models were confidently hallucinating refund policies, inventing API endpoints, and breaking enterprise SLAs, all because they were fundamentally designed to be creative rather than accurate.
                </p>
                <p>
                  I realized that B2B support did not need a better creative writing bot. It needed a deterministic triage engine. It needed a system that treated large language models as a dangerous, volatile resource that had to be mathematically constrained before it was allowed to speak. 
                </p>
                <p>
                  We built Resolvr for engineering and operations teams who value accuracy over conversation. If the system knows the answer, it resolves the ticket. If it doesn't, it immediately packages the context and routes it to a human. Zero guesswork. Zero liability.
                </p>
              </div>
              <div className="mt-10 pt-8 border-t border-slate-200/60 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                  S
                </div>
                <div>
                  <div className="font-bold text-slate-900 tracking-tight">Shreyansh Dwivedi</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5 uppercase tracking-wider">Software Engineer & Founder</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TECH STACK TRANSPARENCY GRID (Glossy Pills) */}
        <section className="relative mx-auto max-w-[1000px] px-6 mb-32 z-10">
          <div className="text-center mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Architected For Scale With</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { name: "Next.js", role: "Edge Framework" },
              { name: "Qdrant", role: "Vector Storage" },
              { name: "PostgreSQL", role: "Relational DB" },
              { name: "Clerk", role: "Auth & Identity" },
              { name: "Cohere", role: "Embeddings" },
              { name: "Gemini", role: "Generative Logic" }
            ].map((tech) => (
              <div key={tech.name} className="relative flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl border border-white px-6 py-4 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] min-w-[140px]">
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/60 pointer-events-none"></div>
                <span className="relative z-10 font-bold text-slate-900 mb-1">{tech.name}</span>
                <span className="relative z-10 text-[9px] font-mono uppercase tracking-widest text-slate-500">{tech.role}</span>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* Big Conversion CTA (Existing) */}
      <section className="bg-slate-900 py-24 md:py-32 text-white relative overflow-hidden">
        {/* BOTTOM SMOOTH FADE: Clean alpha fade to eliminate muddy mid-tones */}
        <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-b from-[#FAFAFC] to-[#FAFAFC]/0 pointer-events-none z-10"></div>
        
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center z-20">
          <div className="h-16 w-16 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] mb-2">
            <ShieldCheck className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Ready to secure your support pipeline?
          </h2>
          <p className="text-base text-slate-400 font-medium mb-4 max-w-xl mx-auto">
            Join the enterprise teams using deterministic routing to safely automate their B2B customer support.
          </p>
          <Link href="/sign-up" className="group flex items-center gap-3 rounded-full bg-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-0.5 hover:bg-indigo-400">
            <span>Deploy Resolvr Today</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer (Existing) */}
      <footer className="bg-slate-950 px-6 py-10 text-center text-[10px] font-bold tracking-widest text-slate-500 uppercase md:px-12 border-t border-slate-900">
        RESOLVR ARCHITECTURE • MULTI-TENANT AUTONOMOUS TRIAGE ENGINE
      </footer>

      {/* Custom Keyframes (Existing) */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}} />
    </div>
  );
}