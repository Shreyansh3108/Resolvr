"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ArrowUpRight,
  Code2,
  ChevronDown,
  Network,
  ShieldCheck,
  Lock,
  AudioLines,
  CodeXml,
  UserRound,
  Server
} from "lucide-react";

// Testimonials Data
const testimonials = [
  {
    quote: "Our customers love the chat experience. Instead of waiting hours for an email, they ask a question, the RAG system instantly reads our 500-page manual, and types out the exact paragraph they need in seconds.",
    name: "Director of Support",
    role: "FinTech Infrastructure",
    colorClass: "border-indigo-500",
    iconColor: "text-indigo-600 bg-indigo-50"
  },
  {
    quote: "The HubSpot integration is flawless. If a user asks a highly specific billing question, Resolvr locks the chat widget, packages the entire conversation history, and drops it into our CRM as a high-priority ticket.",
    name: "Head of Operations",
    role: "Global Logistics",
    colorClass: "border-violet-500",
    iconColor: "text-violet-600 bg-violet-50"
  },
  {
    quote: "I literally just dragged and dropped our PDF manuals into the dashboard. Resolvr chunked them, embedded them into Qdrant, and the chat widget was instantly answering complex technical questions perfectly.",
    name: "Customer Success Lead",
    role: "Enterprise SaaS",
    colorClass: "border-rose-500",
    iconColor: "text-rose-600 bg-rose-50"
  },
  {
    quote: "What sold me was the safety. Because it calculates a strict mathematical vector score before replying, the bot simply refuses to guess. If it doesn't know, it escalates to a human. Zero hallucinations.",
    name: "VP of Engineering",
    role: "Healthcare Tech",
    colorClass: "border-amber-500",
    iconColor: "text-amber-600 bg-amber-50"
  }
];

// Expanded FAQ Data
const faqs = [
  {
    question: "What CRMs does Resolvr integrate with?",
    answer: "Resolvr natively pushes webhook payloads formatted for HubSpot, Zendesk, Salesforce, and Intercom. You can also provide a generic Webhook URL to pipe escalated transcripts directly into your own custom internal tools."
  },
  {
    question: "How do you prevent the AI from hallucinating?",
    answer: "We use a 'Triangulation Engine'. Before the LLM generates a response, we measure the mathematical distance of the user's query against your Qdrant vector database. If the match score drops below a strict 0.25 threshold, the LLM is bypassed entirely and the ticket is escalated."
  },
  {
    question: "Is my customer data secure and isolated?",
    answer: "Absolutely. We utilize Prisma Client Extensions to enforce Row-Level Security equivalent namespace isolation. Your Super Admins can only query aggregate billing data; they are mathematically blocked by the ORM from accessing raw conversation rows."
  },
  {
    question: "Do I need to train the model on my data?",
    answer: "No manual fine-tuning is required. Resolvr uses Retrieval-Augmented Generation (RAG). You simply drag and drop your PDF manuals, markdown files, or website URLs into the Knowledge Base. We chunk and vectorize it instantly via Cohere English v3."
  },
  {
    question: "How is usage billed?",
    answer: "We charge purely based on 'Resolved Sessions'. If the bot escalates a ticket to your human team, that session is free. You only pay for the tier-1 support tickets that Resolvr successfully deflects end-to-end."
  }
];

export default function LandingPage() {
  const [demoMode, setDemoMode] = useState<"deflect" | "escalate">("deflect");
  const [openFaq, setOpenFaq] = useState<number | null>(0); 
  const [activeRole, setActiveRole] = useState<"cx" | "eng" | "sec">("cx");

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* 1. Global Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-[#FAFAFA]/80 px-6 backdrop-blur-xl lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 transition-transform group-hover:scale-105">
            <div className="h-1 w-1 rounded-full bg-white" />
          </div>
          <span className="font-bold tracking-tight text-slate-900 text-sm">
            RESOLVR
          </span>
        </Link>

        {/* Right-aligned Navigation */}
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-5 md:flex pr-6 border-r border-slate-200">
            <Link href="/workflow" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Workflow
            </Link>
            <Link href="/vision" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Vision
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900">
              Login
            </Link>
            <Link href="/admin/register" className="rounded bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20">
              Initialize Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative mx-auto w-full max-w-[1400px] px-6 pt-16 pb-24 lg:px-16 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 h-[700px] w-[700px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-50 blur-[90px] opacity-70 pointer-events-none" />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex w-full flex-col items-start gap-6 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-[10px] font-bold tracking-wide text-indigo-700 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
              </span>
              TRIANGULATION ENGINE V2 • ONLINE
            </div>

            <div className="flex w-full flex-col space-y-5">
              <h1 className="w-full text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-6xl xl:text-7xl">
                Autonomous support <br/>
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">infrastructure.</span>
              </h1>
              
              <p className="w-full text-base font-medium leading-relaxed text-slate-500 text-left">
                Resolvr provides an embeddable chat widget that resolves B2B support tickets with zero human intervention. Using vector-grounded retrieval and mathematical confidence scoring, the Resolvr agent answers complex queries instantly. When a request falls outside your knowledge base, it seamlessly locks the chat and routes the complete conversation context directly to your CRM.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link href="/sign-up" className="group flex items-center gap-2 rounded bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700">
                <span>Deploy Agent</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/workflow" className="group flex items-center gap-2 rounded border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300">
                <span>Inspect Pipeline</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 w-full">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full border border-[#E0443E] bg-[#FF5F56]" />
                  <div className="h-2.5 w-2.5 rounded-full border border-[#DEA123] bg-[#FFBD2E]" />
                  <div className="h-2.5 w-2.5 rounded-full border border-[#1AAB29] bg-[#27C93F]" />
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="rounded border border-slate-200/60 bg-white px-20 py-1 text-[10px] font-semibold tracking-wide text-slate-400 shadow-sm">
                    acme-saas.com/help
                  </div>
                </div>
              </div>

              <div className="flex min-h-[380px] flex-col bg-[#FAFAFA] p-6">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Live Telemetry
                  </span>
                  <div className="flex gap-1 rounded-lg bg-slate-200/50 p-1">
                    <button
                      onClick={() => setDemoMode("deflect")}
                      className={`rounded px-3 py-1.5 text-xs font-bold transition-all ${
                        demoMode === "deflect"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Ground Truth
                    </button>
                    <button
                      onClick={() => setDemoMode("escalate")}
                      className={`rounded px-3 py-1.5 text-xs font-bold transition-all ${
                        demoMode === "escalate"
                          ? "bg-white text-rose-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Out-of-Scope
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col space-y-5 text-xs">
                  {demoMode === "deflect" ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="mb-5 flex items-end justify-end gap-2.5">
                        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-slate-900 px-4 py-3 font-medium text-white shadow-sm text-left">
                          What is the Starter Plan storage limit?
                        </div>
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                          <UserRound className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      <div className="flex items-end gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex max-w-[85%] flex-col gap-2.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-4 shadow-sm">
                          <p className="font-medium leading-relaxed text-slate-700 text-left">
                            The Starter Plan provides 50GB of NVMe SSD storage with up to
                            5 Gbps mitigation and fair-use shared node limits.
                          </p>
                          <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-[9px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Confidence: 0.842
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="mb-5 flex items-end justify-end gap-2.5">
                        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-slate-900 px-4 py-3 font-medium text-white shadow-sm text-left">
                          Can you give me a recipe for chocolate cake?
                        </div>
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                          <UserRound className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      <div className="flex items-end gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex max-w-[85%] flex-col gap-2.5 rounded-2xl rounded-tl-sm border border-rose-100 bg-rose-50/30 p-4 shadow-sm">
                          <p className="font-medium leading-relaxed text-slate-800 text-left">
                            I need to bring in a human expert to resolve this for you. Your
                            inquiry has been escalated directly to our team.
                          </p>
                          <div className="flex flex-col gap-2 border-t border-rose-100 pt-3 text-[9px] font-bold uppercase tracking-widest">
                            <span className="text-rose-500">
                              {">"} Vector Score: 0.135 &lt; 0.25 Threshold
                            </span>
                            <span className="flex items-center gap-1.5 text-amber-600">
                              <AlertTriangle className="h-3 w-3" />
                              CRM Webhook Dispatched
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Security Badges (USING HIGH-END FLUENCY ICONS - GUARANTEED TO WORK) */}
      <section className="bg-white py-12 border-y border-slate-200/60">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16 flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">
            Enterprise Grade Security & Compliance
          </span>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://img.icons8.com/fluency/94/shield-check.png" 
                alt="Premium Shield" 
                className="h-5 w-5 object-contain" 
              />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://img.icons8.com/fluency/94/lock.png" 
                alt="Premium Lock" 
                className="h-5 w-5 object-contain" 
              />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://img.icons8.com/fluency/94/box.png" 
                alt="Premium Box" 
                className="h-5 w-5 object-contain" 
              />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Zero Retention</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3 Core Pillars (RESTORED TO YOUR APPROVED 3D FLUENCY IMAGES) */}
      <section className="bg-[#FAFAFA] py-32 border-b border-slate-200">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="mb-20 max-w-2xl text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Engineered for high-assurance.
            </h2>
            <p className="mt-5 text-lg text-slate-500 font-medium">
              Enterprise features that standard chatbot wrappers simply cannot provide.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="group flex flex-col text-left p-10 rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200">
              <div className="h-16 w-16 mb-8 drop-shadow-md group-hover:scale-110 transition-transform">
                <img 
                  src="https://img.icons8.com/3d-fluency/94/database.png" 
                  alt="3D Database Icon" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Zero-Hallucination Vector RAG
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500">
                Documentation is chunked and embedded via Cohere English v3 into dedicated
                Qdrant collections. Models answer solely from verified context.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group flex flex-col text-left p-10 rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200">
              <div className="h-16 w-16 mb-8 drop-shadow-md group-hover:scale-110 transition-transform">
                <img 
                  src="https://img.icons8.com/3d-fluency/94/mind-map.png" 
                  alt="3D Routing Icon" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Confidence-Based Escalation
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500">
                The Composite Signal evaluates vector distances and LLM uncertainty.
                Low-confidence requests bypass generation and trigger immediate CRM webhooks.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group flex flex-col text-left p-10 rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-violet-200">
              <div className="h-16 w-16 mb-8 drop-shadow-md group-hover:scale-110 transition-transform">
                <img 
                  src="https://img.icons8.com/3d-fluency/94/lock.png" 
                  alt="3D Lock Icon" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Absolute Data Governance
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500">
                Tenant workspaces remain strictly partitioned. Super Admins operate on
                aggregate billing queries via Prisma Extensions with zero message-level visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrates in Minutes (Code Block) */}
      <section className="bg-slate-900 py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-6 sm:text-4xl">Integrates in minutes.</h2>
              <p className="text-base text-slate-400 leading-relaxed mb-10 max-w-lg">
                Because Resolvr handles the entire vector pipeline and LLM orchestration on our secure backend, embedding the agent into your application requires exactly one line of code. Drop the script tag into your frontend layout, pass your Tenant ID, and the widget automatically authenticates and begins intercepting support requests.
              </p>
              <ul className="space-y-5 text-sm font-medium text-slate-300">
                <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Framework agnostic (React, Vue, HTML)</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Silent webhook payload routing</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="h-5 w-5 text-indigo-500" /> Zero frontend dependencies</li>
              </ul>
            </div>
            
            <div className="rounded-2xl border border-slate-700/50 bg-[#0d1117] overflow-hidden shadow-2xl shadow-indigo-900/20 ring-1 ring-white/10">
              <div className="flex items-center justify-between border-b border-slate-700/50 bg-[#161b22] px-5 py-4">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-mono text-slate-400">layout.tsx</span>
                </div>
                <div className="w-12"></div>
              </div>
              <div className="p-8 overflow-x-auto text-sm font-mono leading-loose tracking-tight">
                <span className="text-rose-400">export default function</span> <span className="text-blue-400 font-semibold">RootLayout</span>({`{`}<br/>
                &nbsp;&nbsp;children<br/>
                {`}`} : {`{`} children: <span className="text-emerald-400">React.ReactNode</span> {`}`}) {`{`}<br/>
                &nbsp;&nbsp;<span className="text-rose-400">return</span> (<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-indigo-400">html</span> <span className="text-blue-300">lang</span>=<span className="text-amber-300">"en"</span>&gt;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-indigo-400">body</span>&gt;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{children}`}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500 italic">{"{/* Inject the Resolvr Edge Network */}"}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-indigo-400">script</span> <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">src</span>=<span className="text-amber-300">"https://resolvr.ai/widget.js"</span> <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">data-tenant-id</span>=<span className="text-amber-300">"process.env.RESOLVR_ID"</span> <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&gt;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-indigo-400">body</span>&gt;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-indigo-400">html</span>&gt;<br/>
                &nbsp;&nbsp;)<br/>
                {`}`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRM Handoff */}
      <section className="bg-[#0A0A0A] py-32 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl text-slate-100">
              Zero local inboxes. <br/>Pure CRM synchronization.
            </h2>
            <p className="mt-6 text-lg text-slate-400 font-medium leading-relaxed">
              When confidence drops, Resolvr stops generating. The chat widget locks, and the entire payload is instantly routed into your existing HubSpot or Zendesk dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] items-center gap-8 lg:gap-4">
            
            <div className="w-full rounded-2xl border border-slate-800 bg-[#111] p-8 shadow-2xl h-full flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-5">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono text-slate-400 tracking-widest">IN-CHAT ESCALATION TRIGGER</span>
              </div>
              
              <div className="space-y-6 text-sm font-medium">
                <div className="flex items-end justify-end gap-3">
                  <div className="bg-slate-800 text-slate-200 px-5 py-4 rounded-2xl rounded-tr-sm max-w-[85%]">
                    We need custom VPC peering and an SLA guarantee on our Dedicated Cluster immediately.
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-6">
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-xl text-xs font-mono leading-relaxed">
                    {">"} VECTOR DISTANCE: 0.118 &lt; 0.25 <br/>
                    {">"} STATUS: OUT OF SCOPE <br/>
                    {">"} ACTION: HALT_GENERATION &amp; EMIT_WEBHOOK
                  </div>
                  <div className="flex items-center gap-3 bg-[#1A1A1A] border border-slate-800 px-5 py-4 rounded-2xl rounded-tl-sm text-slate-300">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    I am escalating this to our human engineering team.
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center h-full">
              <div className="flex items-center text-indigo-500">
                <div className="h-[2px] w-12 bg-indigo-500/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-indigo-500 animate-[translateX_1.5s_linear_infinite]" style={{ animationName: 'slideRight' }} />
                </div>
                <ArrowRight className="h-6 w-6 -ml-2 text-indigo-500" />
              </div>
            </div>

            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-2xl shadow-indigo-900/20 text-slate-900 h-full flex flex-col">
              <div className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 bg-[#ff7a59] rounded-md flex items-center justify-center">
                    <Network className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-base text-slate-800">HubSpot Service Hub</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync</span>
              </div>
              
              <div className="p-8 flex flex-col gap-6 flex-1 justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl mb-1">Custom VPC Peering & SLA</h4>
                    <p className="text-sm text-slate-500 font-medium">Ticket #8921 • Opened by Resolvr Agent</p>
                  </div>
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-rose-200">Urgent</span>
                </div>
                
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-4 w-4 text-indigo-600" />
                    <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">AI Context Summary</p>
                  </div>
                  <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">
                    Customer requested non-standard SLA terms for Dedicated Cluster. Vector search yielded score 0.118 (Below 0.25 threshold). Generation halted to prevent hallucination. Full 12-message transcript attached to contact record.
                  </p>
                </div>
                
                <div className="flex gap-6 border-t border-slate-200 pt-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Customer</span>
                    <span className="text-sm font-semibold text-slate-700">cto@enterprise.io</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-6 border-l border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sentiment</span>
                    <span className="text-sm font-semibold text-slate-700">Frustrated (0.89)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideRight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </section>

      {/* "Built for your role" Interactive Tabs */}
      <section className="bg-white py-32 border-y border-slate-200">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Built for the entire enterprise.
            </h2>
            <p className="mt-4 text-base text-slate-500 font-medium">
              Because support infrastructure requires buy-in from leadership, engineering, and compliance.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 border-b border-slate-200 mb-12">
            <button 
              onClick={() => setActiveRole('cx')} 
              className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-colors ${activeRole === 'cx' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <AudioLines className="h-4 w-4" /> CX Leaders
            </button>
            <button 
              onClick={() => setActiveRole('eng')} 
              className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-colors ${activeRole === 'eng' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <CodeXml className="h-4 w-4" /> Engineering
            </button>
            <button 
              onClick={() => setActiveRole('sec')} 
              className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-colors ${activeRole === 'sec' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ShieldCheck className="h-4 w-4" /> Security & Compliance
            </button>
          </div>
          
          <div className="min-h-[300px]">
            {activeRole === 'cx' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6">
                  <h3 className="text-2xl font-black text-slate-900">Autonomous deflection with zero brand risk.</h3>
                  <ul className="space-y-4 text-sm font-medium text-slate-600">
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Target 78%+ first-contact deflection rates immediately.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Instantaneous escalation prevents AI hallucination frustration.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Built-in sentiment guardrails and analytics metrics.</li>
                  </ul>
                </div>
                <div className="bg-[#FAFAFA] border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center">
                   <div className="grid grid-cols-2 gap-6 w-full">
                     <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-sm">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Deflection Rate</p>
                       <p className="text-4xl font-black text-indigo-600">78.4%</p>
                     </div>
                     <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-sm">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Resolution Time</p>
                       <p className="text-4xl font-black text-slate-900">1.2s</p>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeRole === 'eng' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6">
                  <h3 className="text-2xl font-black text-slate-900">A 1-line script tag with enterprise webhook emitters.</h3>
                  <ul className="space-y-4 text-sm font-medium text-slate-600">
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Zero SDK bloat on your frontend application.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Strict JSON schema validation for all outgoing payloads.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Edge vector lookups via Qdrant & Cohere infrastructure.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#0d1117] overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-slate-800 bg-[#161b22] px-4 py-3">
                    <Code2 className="h-4 w-4 text-slate-500" />
                    <span className="text-xs font-mono text-slate-400">layout.tsx</span>
                  </div>
                  <div className="p-6 overflow-x-auto text-sm font-mono leading-loose tracking-tight text-white">
                    <span className="text-rose-400">export default function</span> <span className="text-blue-400 font-semibold">RootLayout</span>()<br/>
                    <span className="text-slate-500 italic">{"// Drop the edge network into your framework"}</span><br/>
                    &lt;<span className="text-indigo-400">script</span> <br/>
                    &nbsp;&nbsp;<span className="text-blue-300">src</span>=<span className="text-amber-300">"https://resolvr.ai/widget.js"</span> <br/>
                    &nbsp;&nbsp;<span className="text-blue-300">data-tenant-id</span>=<span className="text-amber-300">"process.env.RESOLVR_ID"</span> <br/>
                    /&gt;<br/>
                  </div>
                </div>
              </div>
            )}

            {activeRole === 'sec' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6">
                  <h3 className="text-2xl font-black text-slate-900">Cryptographic multi-tenant data boundaries.</h3>
                  <ul className="space-y-4 text-sm font-medium text-slate-600">
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Prisma Client Extension enforcing Row-Level Security isolation.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Zero cross-tenant memory bleed in the vector engine.</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Platform operators are mathematically barred from reading raw messages.</li>
                  </ul>
                </div>
                <div className="bg-[#FAFAFA] border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col gap-4">
                   <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                     <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Server className="h-4 w-4"/> Tenant A Namespace</span>
                     <Lock className="h-4 w-4 text-emerald-500" />
                   </div>
                   <div className="flex items-center justify-center py-2">
                     <div className="bg-rose-100 text-rose-700 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-rose-200">Prisma Isolation Barrier</div>
                   </div>
                   <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                     <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Server className="h-4 w-4"/> Tenant B Namespace</span>
                     <Lock className="h-4 w-4 text-emerald-500" />
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#FAFAFA] py-20 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16 mb-8 text-left">
          <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Trusted by Enterprise Support Teams
          </h2>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-6 px-6 lg:px-16 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {testimonials.map((t, idx) => (
            <div key={idx} className={`min-w-[280px] md:min-w-[340px] max-w-[360px] flex-shrink-0 flex flex-col justify-between border-l-2 ${t.colorClass} pl-5 text-left snap-start bg-white p-6 rounded-r-xl border-y border-r border-slate-100 shadow-sm`}>
              <p className="text-sm font-medium leading-relaxed text-slate-600 text-left italic">
                "{t.quote}"
              </p>
              
              <div className="mt-8 flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.iconColor}`}>
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="border-y border-slate-200 bg-white py-32">
        <div className="mx-auto max-w-[800px] px-6">
          <h2 className="text-3xl font-black tracking-tight text-center mb-12 sm:text-4xl">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 shadow-sm ${openFaq === index ? 'border-indigo-300 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full flex justify-between items-center p-6 text-left transition-colors ${openFaq === index ? 'bg-indigo-50/50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <h4 className="text-base font-bold text-slate-900 pr-8">{faq.question}</h4>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Deploy your first agent.
          </h2>
          <p className="text-base text-slate-400 font-medium">
            Connect your documentation, test the composite signal in the sandbox, and
            embed the widget snippet onto your customer-facing domains.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link href="/sign-up" className="rounded bg-indigo-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-400">
              Initialize Workspace
            </Link>
            <Link href="/workflow" className="rounded border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-bold text-slate-300 transition-all hover:bg-slate-800">
              Review System Workflow
            </Link>
          </div>
        </div>
      </section>

      {/* The "Fat Footer" */}
      <footer className="bg-slate-950 px-6 pt-20 pb-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 border-b border-slate-800 pb-16 mb-8">
            <div className="col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-white" />
                <span className="font-bold tracking-tight text-white text-base">RESOLVR</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                The deterministic support infrastructure for enterprise B2B teams. Zero hallucinations, mathematical vector scoring, and strict CRM handoffs.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Platform Overview</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Vector Engine</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">CRM Integrations</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Security & RBAC</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Documentation</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">API Reference</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Case Studies</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">System Status</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">About Us</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Careers</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
              © 2026 RESOLVR ARCHITECTURE • MULTI-TENANT AUTONOMOUS TRIAGE ENGINE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}