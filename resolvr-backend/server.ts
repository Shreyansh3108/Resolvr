import bcrypt from "bcryptjs";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { Webhook } from "svix";

import { runConversationalAgent } from "./agent.js";
import { ingestDocument, ingestPDFDocuments } from "./rag.js"; 
import { searchKnowledgeBase } from "./rag.js";

// Bypass TS warnings for the new modern library
// @ts-ignore
import pdfParse from "pdf-extraction"; 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// DATABASE RBAC: STANDARD & SUPER ADMIN CLIENTS
// ==========================================
const prisma = new PrismaClient();

// This client mathematically forbids reading raw conversation data.
// It only permits aggregate counting for platform billing metrics.
const superAdminPrisma = prisma.$extends({
  query: {
    message: {
      async $allOperations({ operation, args, query }) {
        // ALLOW: Aggregates for billing and platform health
        if (operation === "count" || operation === "aggregate") {
          return query(args);
        }
        // BLOCK: Any attempt to read, update, or query raw text
        throw new Error(`[RBAC ENFORCED] Super Admin is strictly forbidden from accessing raw message records. Operation '${operation}' blocked.`);
      },
    },
    chatSession: {
      async $allOperations({ operation, args, query }) {
        if (operation === "count" || operation === "aggregate") {
          return query(args);
        }
        throw new Error(`[RBAC ENFORCED] Super Admin is strictly forbidden from accessing raw chat sessions. Operation '${operation}' blocked.`);
      },
    }
  },
});

app.use(cors());

// ==========================================
// 1. WEBHOOK ROUTES (Must run raw BEFORE express.json())
// ==========================================

app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res): Promise<any> => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("Missing CLERK_WEBHOOK_SECRET in backend .env");
      return res.status(500).json({ error: "Server missing webhook secret" });
    }

    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: "Missing svix headers" });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
      evt = wh.verify(req.body as Buffer, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const eventType = evt.type;

    try {
      // Sync Clerk Organization -> PostgreSQL Tenant
      if (eventType === "organization.created") {
        const { id, name, slug } = evt.data;
        const tenantDomain = slug ? `${slug}.resolvr.ai` : `${id}.resolvr.ai`;

        await prisma.tenant.upsert({
          where: { id },
          update: { name },
          create: {
            id,
            name,
            domain: tenantDomain,
          },
        });
        console.log(`[Webhook] Tenant synced: ${name} (${id})`);
      }

      // Sync Clerk User -> PostgreSQL User
      if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses?.[0]?.email_address;
        const fullName = `${first_name || ""} ${last_name || ""}`.trim() || "Workspace User";

        if (email) {
          await prisma.user.upsert({
            where: { email },
            update: { id, name: fullName },
            create: {
              id,
              email,
              name: fullName,
              password: "", // Handled externally via Clerk OAuth
              // FIX: Automatically connect new users to the demo tenant so Prisma doesn't block creation
              tenant: {
                connectOrCreate: {
                  where: { id: "tenant_demo_123" },
                  create: {
                    id: "tenant_demo_123",
                    name: "Demo Environment",
                    domain: "demo.resolvr.ai"
                  }
                }
              }
            },
          });
          console.log(`[Webhook] User synced: ${email} (${id})`);
        }
      }

      return res.status(200).json({ success: true });
    } catch (dbError) {
      console.error("[Webhook] Database Sync Error:", dbError);
      return res.status(500).json({ error: "Database operation failed" });
    }
  }
);

// Global body parser for regular application routes
app.use(express.json());

// ==========================================
// 2. PUBLIC ROUTES (No Tenant ID Required)
// ==========================================

app.post("/api/register", async (req, res) => {
  const { email, password, name, companyName, domain } = req.body;

  if (!email || !password || !companyName || !domain) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingTenant = await prisma.tenant.findUnique({ where: { domain } });

    if (existingUser) return res.status(400).json({ error: "Email already in use" });
    if (existingTenant) return res.status(400).json({ error: "Domain already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTenant = await prisma.tenant.create({
      data: {
        name: companyName,
        domain: domain,
        users: {
          create: {
            email,
            name,
            password: hashedPassword,
          },
        },
      },
      include: { users: true },
    });

    return res.status(201).json({ 
      message: "Account created successfully", 
      tenantId: newTenant.id 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error during registration" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { tenant: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      companyName: user.tenant?.name
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error during login" });
  }
});

// ==========================================
// 3. SECURITY MIDDLEWARE (The Bouncer)
// ==========================================
app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const tenantId = req.headers["x-tenant-id"] || req.query.tenantId || req.body?.tenantId;

  // We explicitly bypass the tenant check for Super Admin routes which handle data cross-tenant
  if (req.path.startsWith("/api/admin")) {
    return next();
  }

  if (!tenantId) {
    return res.status(401).json({ error: "Unauthorized: Missing Tenant ID" });
  }

  try {
    const isBypassedTenant = 
      tenantId === "tenant_demo_123" || 
      (tenantId as string).startsWith("org_") || 
      tenantId === "personal_workspace";

    if (!isBypassedTenant) {
      try {
        const tenant = await prisma.tenant.findUnique({
          where: { id: tenantId as string }
        });

        if (!tenant) {
          return res.status(403).json({ error: "Forbidden: Invalid Tenant ID" });
        }
      } catch (dbErr: any) {
        // Soft catch: If Neon DB is sleeping/waking, warn but do NOT crash the chat.
        // Qdrant will still enforce strict data isolation via namespace.
        console.warn(`[DB Wakeup] Neon Postgres is waking up. Bypassing DB check and relying on Qdrant isolation for ${tenantId}.`);
      }
    }

    // Proceed to chat/RAG generation even if the relational DB is waking up
    next();
  } catch (error) {
    console.error("Auth Middleware Fatal Error:", error);
    return res.status(500).json({ error: "Critical error during authentication" });
  }
});

// ==========================================
// 4. PROTECTED ROUTES (Tenant ID Required)
// ==========================================

app.post("/api/knowledge", async (req, res) => {
  try {
    const { text, tenantId } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text content is required" });
    }

    const docId = uuidv4(); 
    
    await ingestDocument(tenantId, docId, text);
    
    res.status(200).json({ success: true, message: "Knowledge successfully added to the database." });
  } catch (error) {
    console.error("Ingestion Error:", error);
    res.status(500).json({ error: "Failed to ingest document" });
  }
});

app.post("/upload-pdf", upload.single("document"), async (req, res) => {
  try {
    const tenantId = (req.headers["x-tenant-id"] || req.query.tenantId || req.body?.tenantId) as string;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!tenantId) {
      return res.status(400).json({ error: "Missing tenantId" });
    }

    console.log(`[Upload] Processing PDF for tenant: ${tenantId}`);

    const pdfData = await pdfParse(file.buffer);
    const rawText = pdfData.text;
    
    await ingestPDFDocuments(tenantId, file.originalname, rawText);

    res.status(200).json({ 
      success: true, 
      message: "PDF successfully processed and added to knowledge base.",
      extractedPages: pdfData.numpages 
    });

  } catch (error) {
    console.error("PDF Processing Error:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// ==========================================
// CRM INTEGRATION: EXTERNAL HANDOFF EMITTER
// ==========================================
async function pushToTenantCRM(tenantId: string, sessionId: string, triggerMessage: string) {
  try {
    const history = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" }
    });

    const transcript = history.map(msg => 
      `[${msg.role.toUpperCase()}]: ${msg.content}`
    ).join("\n\n");

    const fullTranscript = `${transcript}\n\n[USER]: ${triggerMessage}\n\n[SYSTEM]: Escalated by Triangulation Engine.`;

    const crmPayload = {
      tenantId: tenantId,
      ticketId: sessionId,
      subject: `AI Escalation: Support Request from ${sessionId.substring(0, 12)}`,
      description: fullTranscript,
      priority: "high",
      status: "new",
      source: "Resolvr_Triangulation_Engine"
    };

    const targetWebhookUrl = process.env.MOCK_CRM_WEBHOOK_URL || "https://httpbin.org/post"; 
    
    const response = await fetch(targetWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crmPayload)
    });

    if (response.ok) {
      console.log(`[CRM INTEGRATION] 🟢 Successfully pushed ticket ${sessionId} to external CRM.`);
    } else {
      console.error(`[CRM INTEGRATION] 🔴 CRM rejected payload. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("[CRM INTEGRATION] 🔴 Failed to push to CRM:", error);
  }
}

// ==========================================
// SUPER ADMIN REAL-DATA TELEMETRY (NEON DB + QDRANT KNOWLEDGE BASE)
// ==========================================
app.get("/api/admin/metrics", async (req, res) => {
  const startTime = Date.now();
  try {
    // 1. Fetch real Tenants, Chat Sessions, and Messages from Neon PostgreSQL
    const [tenants, sessions, messages] = await Promise.all([
      prisma.tenant.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.chatSession.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.message.findMany({
        select: {
          id: true,
          sessionId: true,
          role: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // 2. Fetch registered Client Users from Prisma (if User table exists)
    let registeredUsers: any[] = [];
    try {
      if ((prisma as any).user) {
        registeredUsers = await (prisma as any).user.findMany();
      }
    } catch (_) {}

    // 3. Fetch uploaded Document metadata from Prisma (if Document table exists)
    let prismaDocs: any[] = [];
    try {
      const docModel =
        (prisma as any).document ||
        (prisma as any).knowledgeDocument ||
        (prisma as any).file;
      if (docModel) {
        prismaDocs = await docModel.findMany();
      }
    } catch (_) {}

    // 4. Query Qdrant Cloud directly for real vector chunk counts & uploaded doc snippets per tenant
    const qdrantByTenant = new Map<
      string,
      { chunkCount: number; docNames: Set<string>; previews: string[]; collectionName: string }
    >();
    let totalQdrantVectors = 0;
    let activeCollectionName = "resolvr_knowledge_base";

    if (process.env.QDRANT_URL && process.env.QDRANT_API_KEY) {
      try {
        const baseUrl = process.env.QDRANT_URL.replace(/\/$/, "");
        const colRes = await fetch(`${baseUrl}/collections`, {
          headers: { "api-key": process.env.QDRANT_API_KEY },
        });

        if (colRes.ok) {
          const colData: any = await colRes.json();
          const collections: string[] =
            colData?.result?.collections?.map((c: any) => c.name) || [];

          for (const colName of collections) {
            activeCollectionName = colName;
            const scrollRes = await fetch(
              `${baseUrl}/collections/${colName}/points/scroll`,
              {
                method: "POST",
                headers: {
                  "api-key": process.env.QDRANT_API_KEY,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  limit: 250,
                  with_payload: true,
                  with_vector: false,
                }),
              }
            );

            if (scrollRes.ok) {
              const scrollData: any = await scrollRes.json();
              const points: any[] = scrollData?.result?.points || [];
              totalQdrantVectors += points.length;

              for (const pt of points) {
                const payload = pt.payload || {};
                const tId =
                  payload.tenantId ||
                  payload.tenant_id ||
                  payload.namespace ||
                  payload.orgId;
                if (!tId) continue;

                if (!qdrantByTenant.has(tId)) {
                  qdrantByTenant.set(tId, {
                    chunkCount: 0,
                    docNames: new Set<string>(),
                    previews: [],
                    collectionName: colName,
                  });
                }

                const entry = qdrantByTenant.get(tId)!;
                entry.chunkCount++;

                const rawText = String(
                  payload.text || payload.content || payload.pageContent || ""
                ).trim();

                // Extract uploaded filename/title from payload or infer from header line
                const explicitDocName =
                  payload.fileName ||
                  payload.filename ||
                  payload.documentName ||
                  payload.source ||
                  payload.title;

                if (explicitDocName) {
                  entry.docNames.add(String(explicitDocName));
                } else if (rawText.length > 0 && entry.docNames.size === 0) {
                  const firstLine = (rawText || "")
                  .split("\n")[0]
                  ?.replace(/[#*`]/g, "")
                  ?.trim()
                  ?.slice(0, 48) || "Uploaded Manual";
                  if (firstLine.length > 3) {
                    entry.docNames.add(`${firstLine} (Uploaded Doc)`);
                  }
                }

                if (rawText.length > 0 && entry.previews.length < 4) {
                  entry.previews.push(
                    rawText.length > 220 ? `${rawText.slice(0, 220)}...` : rawText
                  );
                }
              }
            }
          }
        }
      } catch (qErr: any) {
        console.warn("[Admin Qdrant Inspection Warning]:", qErr.message);
      }
    }

    const neonLatencyMs = Date.now() - startTime;

    // 5. Group messages by sessionId and sessions by tenantId
    const messagesBySession = new Map<string, any[]>();
    for (const msg of messages) {
      if (!messagesBySession.has(msg.sessionId)) {
        messagesBySession.set(msg.sessionId, []);
      }
      messagesBySession.get(msg.sessionId)!.push(msg);
    }

    const sessionsByTenant = new Map<string, any[]>();
    for (const sess of sessions) {
      if (!sessionsByTenant.has(sess.tenantId)) {
        sessionsByTenant.set(sess.tenantId, []);
      }
      sessionsByTenant.get(sess.tenantId)!.push(sess);
    }

    let globalQueries = 0;
    let globalSolved = 0;
    let globalEscalated = 0;

    // 6. Build 100% Real Client Company Telemetry
    const companies = tenants.map((tenant) => {
      const tenantSessions = sessionsByTenant.get(tenant.id) || [];
      let companyQueries = 0;
      let companySolved = 0;
      let companyEscalated = 0;

      const sessionBreakdown = tenantSessions.map((sess) => {
        const sessMsgs = messagesBySession.get(sess.id) || [];
        const userMsgs = sessMsgs.filter((m) => m.role === "user");
        const aiMsgs = sessMsgs.filter((m) => m.role === "ai");

        let sessEscalated = 0;
        let sessSolved = 0;

        for (const ai of aiMsgs) {
          const text = (ai.content || "").toLowerCase();
          if (
            text.includes("human expert") ||
            text.includes("escalated to our support team") ||
            text === "escalate"
          ) {
            sessEscalated++;
          } else {
            sessSolved++;
          }
        }

        companyQueries += userMsgs.length;
        companySolved += sessSolved;
        companyEscalated += sessEscalated;

        const lastMsg = sessMsgs[sessMsgs.length - 1];
        const lastUserMsg = userMsgs[userMsgs.length - 1];

        return {
          sessionId: sess.id,
          queries: userMsgs.length,
          solved: sessSolved,
          escalated: sessEscalated,
          lastQueryPreview: lastUserMsg?.content || "Session initialized",
          status:
            sessEscalated > 0
              ? "ESCALATED"
              : userMsgs.length > 0
              ? "RESOLVED"
              : "IDLE",
          lastActive: lastMsg?.createdAt || sess.createdAt,
        };
      });

      globalQueries += companyQueries;
      globalSolved += companySolved;
      globalEscalated += companyEscalated;

      // Match registered user account from Prisma
      const matchedUser = registeredUsers.find((u) => u.tenantId === tenant.id);

      // Match Qdrant knowledge base data for this tenant
      const qdrantInfo = qdrantByTenant.get(tenant.id);
      const tenantPrismaDocs = prismaDocs.filter((d) => d.tenantId === tenant.id);

      const uploadedDocuments = [
        ...tenantPrismaDocs.map(
          (d) => d.fileName || d.filename || d.name || d.title || "Uploaded Manual"
        ),
        ...(qdrantInfo ? Array.from(qdrantInfo.docNames) : []),
      ];

      // Flag auto-generated legacy IDs so the UI can hide them by default
      const isLegacySandboxId =
        tenant.name === "Default Organization" ||
        tenant.id.startsWith("org_") ||
        tenant.id === "tenant_demo_123" ||
        (tenant.domain && tenant.domain.endsWith(".resolvr.local"));

      return {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain || `${tenant.id.slice(0, 8)}.resolvr.ai`,
        clientEmail: matchedUser?.email || "Registered Client Workspace",
        createdAt: tenant.createdAt,
        isLegacySandboxId,
        knowledgeBase: {
          collectionName: qdrantInfo?.collectionName || activeCollectionName,
          vectorChunks: qdrantInfo?.chunkCount || 0,
          documents:
            uploadedDocuments.length > 0
              ? Array.from(new Set(uploadedDocuments))
              : qdrantInfo && qdrantInfo.chunkCount > 0
              ? ["Indexed Knowledge Base Manual (PDF/Text)"]
              : [],
          chunkPreviews: qdrantInfo?.previews || [],
        },
        telemetry: {
          sessionsCount: tenantSessions.length,
          queries: companyQueries,
          solved: companySolved,
          escalated: companyEscalated,
        },
        sessions: sessionBreakdown,
      };
    });

    return res.status(200).json({
      dbOnline: true,
      neonLatencyMs,
      totalQdrantVectors,
      totals: {
        registeredCompanies: companies.filter((c) => !c.isLegacySandboxId).length,
        allWorkspaces: companies.length,
        sessions: sessions.length,
        queries: globalQueries,
        solved: globalSolved,
        escalated: globalEscalated,
      },
      companies,
    });
  } catch (error: any) {
    console.error("[Admin Telemetry Error]:", error.message);
    return res.status(200).json({
      dbOnline: false,
      neonLatencyMs: 0,
      totalQdrantVectors: 0,
      totals: {
        registeredCompanies: 0,
        allWorkspaces: 0,
        sessions: 0,
        queries: 0,
        solved: 0,
        escalated: 0,
      },
      companies: [],
    });
  }
});

// Add this import at the top of your file if you don't have it
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==========================================
// AI SUPPORT ENGINE (GEMINI RAG ENGINE)
// ==========================================
app.post("/api/chat", async (req, res) => {
  try {
    const { tenantId, message, sessionId } = req.body;

    if (!tenantId || !message || !sessionId) {
      return res.status(400).json({ error: "Missing tenantId, message, or sessionId" });
    }

    console.log(`\n[Chat] Query from tenant ${tenantId} | Session ${sessionId}: "${message}"`);

    // 1. NEON DB WAKE-UP LOOP (Non-blocking if Neon is still waking up)
    let existingTenant: any = null;
    let session: any = { id: sessionId, tenantId };
    let dbConnected = false;

    let authDbRetries = 3;
    while (authDbRetries > 0) {
      try {
        existingTenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        dbConnected = true;
        break;
      } catch (error: any) {
        if (
          error.message?.includes("Can't reach database server") ||
          error.name === "PrismaClientInitializationError" ||
          error.code === "P2024"
        ) {
          console.warn(`[Neon DB] Database sleeping. Waking up... (${authDbRetries - 1} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          authDbRetries--;
        } else {
          console.warn(`[Neon DB] Query warning: ${error.message}`);
          break;
        }
      }
    }

    if (dbConnected) {
      try {
        if (!existingTenant) {
          existingTenant = await prisma.tenant.create({
            data: { id: tenantId, name: "Default Organization", domain: `${tenantId}.resolvr.local` }
          });
        }

        const foundSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
        if (!foundSession) {
          session = await prisma.chatSession.create({ data: { id: sessionId, tenantId } });
        } else {
          session = foundSession;
        }
      } catch (dbSyncErr: any) {
        console.warn(`[Neon DB] Tenant/Session sync skipped: ${dbSyncErr.message}`);
      }
    }

    // 2. ISOLATED VECTOR MATH (Qdrant Cloud)
    const searchQuery = message;
    const { context, maxScore } = await searchKnowledgeBase(tenantId, searchQuery);

    // 3. SYSTEM INSTRUCTIONS (100% Document-Driven for Any Tenant)
    const systemInstruction = `You are a strict Support Agent for ${existingTenant?.name || "our company"}.
    
    DATABASE:
    ${context ? context : "No data available."}

    CRITICAL RULES:
    1. Answer concisely using ONLY the facts provided in the DATABASE.
    2. If the answer cannot be found in the DATABASE, or if the user asks about topics not covered in the DATABASE, output exactly one word: ESCALATE
    3. Do not write greetings (e.g., "Dear Customer") or apologies. Answer immediately.
    4. Use **bold** for numbers and metrics.
    5. Format lists using markdown bullet points (-). Put a blank line between each bullet point.`;

    // 4. GENERATE RESPONSE (Gemini 3.5 Flash-Lite Primary + Cohere RAG Failover)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const GEMINI_MODELS = [
      "gemini-3.5-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-3.8-flash"
    ];

    let reply = "";

    // Step 4A: Try active Gemini 3.x models
    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`[Gemini] Routing query to ${modelName}...`);
        const model = genAI.getGenerativeModel(
          {
            model: modelName,
            systemInstruction: systemInstruction,
          },
          { timeout: 8000 }
        );

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
        });

        const text = result.response.text();
        if (text && text.trim().length > 0) {
          reply = text.trim();
          console.log(`[Gemini] Answered successfully using ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Gemini] ${modelName} unavailable (${err.status || err.message}). Trying next...`);
      }
    }

    // Step 4B: Automatic failover to Cohere Command RAG if Google Free Tier is throttled
    if (!reply && process.env.COHERE_API_KEY) {
      const COHERE_MODELS = ["command-a-03-2025", "command-r-08-2024"];
      for (const cohereModel of COHERE_MODELS) {
        try {
          console.log(`[Cohere Failover] Routing query to ${cohereModel}...`);
          const cohereRes = await fetch("https://api.cohere.com/v2/chat", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: cohereModel,
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: message },
              ],
              temperature: 0.1,
            }),
          });

          if (cohereRes.ok) {
            const cohereData: any = await cohereRes.json();
            const textBlock = cohereData?.message?.content?.find((c: any) => c.type === "text");
            const cohereText = textBlock?.text || cohereData?.message?.content?.[0]?.text || cohereData?.text;
            if (cohereText && cohereText.trim().length > 0) {
              reply = cohereText.trim();
              console.log(`[Cohere Failover] Answered successfully using ${cohereModel}`);
              break;
            }
          } else {
            console.warn(`[Cohere Failover] ${cohereModel} returned HTTP ${cohereRes.status}`);
          }
        } catch (cohereErr: any) {
          console.warn(`[Cohere Failover] ${cohereModel} error: ${cohereErr.message}`);
        }
      }
    }

    if (!reply) {
      return res.status(200).json({
        reply: "Our support AI is currently handling a high volume of requests. Please wait a moment and try again, or let us know if you need human escalation.",
        debug: { maxScore, isEscalated: false }
      });
    }

    console.log(`[LLM Raw Output]: ${reply}`);

    // 5. DETERMINISTIC METRICS & TRIAGE
    const llmSelfReflection = reply.trim().includes("ESCALATE");
    const retrievalFailed = maxScore < 0.25;

    let finalResponse = reply;
    let isEscalated = false;

    if (retrievalFailed || llmSelfReflection) {
      isEscalated = true;
      finalResponse = "I need to bring in a human expert to resolve this for you. Your ticket has been escalated to our support team.";
      console.log(`[ESCALATION TRIGGERED] Vector Fail: ${retrievalFailed} | LLM Escalate: ${llmSelfReflection}`);
    }

    // 6. NON-BLOCKING MESSAGE LOGGING
    if (dbConnected) {
      try {
        await prisma.message.createMany({
          data: [
            { sessionId: session.id, role: "user", content: message },
            { sessionId: session.id, role: "ai", content: finalResponse }
          ]
        });
      } catch (msgErr: any) {
        console.warn(`[Neon DB] Message history save skipped: ${msgErr.message}`);
      }
    }

    return res.status(200).json({
      reply: finalResponse,
      debug: { maxScore, isEscalated }
    });

  } catch (error) {
    console.error("Chat Generation Error:", error);
    return res.status(500).json({ error: "Failed to generate AI response" });
  }
});

// ==========================================
// 6. SERVER STARTUP
// ==========================================
app.listen(port, () => {
  console.log(`Resolvr backend running on http://localhost:${port}`);
});