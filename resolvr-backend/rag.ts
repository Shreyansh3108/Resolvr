import { CohereClient } from "cohere-ai";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import dns from "dns";
import http from "http";
import https from "https";

// Forces IPv4 to prevent socket drops on Windows
dns.setDefaultResultOrder('ipv4first');
dotenv.config();

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY as string });

// Extract and sanitize Qdrant credentials
const QDRANT_URL = (process.env.QDRANT_URL as string).replace(/\/$/, ""); // Strips trailing slash if present
const QDRANT_API_KEY = process.env.QDRANT_API_KEY as string;
const COLLECTION_NAME = "resolvr_knowledge";

// 🚀 THE FIX: Keep-Alive Agents prevent the cloud load balancer from dropping the connection (ECONNRESET)
const isHttps = QDRANT_URL.startsWith("https");
const keepAliveAgent = isHttps 
  ? new https.Agent({ keepAlive: true, rejectUnauthorized: false }) 
  : new http.Agent({ keepAlive: true });

const qdrantClient = axios.create({
  baseURL: QDRANT_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": QDRANT_API_KEY,
  },
  httpAgent: keepAliveAgent,
  httpsAgent: keepAliveAgent,
  timeout: 45000, // Give it 45 seconds to wake up from sleep
});

export async function initializeVectorDB() {
  try {
    // 1. Check if collection exists
    try {
      await qdrantClient.get(`/collections/${COLLECTION_NAME}`);
      console.log(`[Qdrant] Collection verified.`);
    } catch (err: any) {
      // 2. If 404, it doesn't exist. Create it via Axios.
      if (err.response && err.response.status === 404) {
        await qdrantClient.put(`/collections/${COLLECTION_NAME}`, { 
          vectors: { size: 1024, distance: "Cosine" } 
        });
        console.log(`[Qdrant] Created collection: ${COLLECTION_NAME}`);

        // 3. Apply the Tenant ID index for partitioned security
        await qdrantClient.put(`/collections/${COLLECTION_NAME}/index`, { 
          field_name: "tenantId", field_schema: "keyword" 
        });
        console.log(`[Qdrant] Ensured payload index for 'tenantId' exists.`);
      } else {
        throw err; // Throw non-404 errors (like networking issues) to the outer catch
      }
    }
  } catch (error: any) {
    console.error(`[Qdrant] Initialization error:`, error.message);
  }
}

export function chunkText(text: string, maxWords: number = 400, overlapWords: number = 50) {
  const cleanText = text.replace(/\s+/g, " ").trim(); 
  const words = cleanText.split(" ");
  const chunks: string[] = [];
  let i = 0;
  
  while (i < words.length) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
    i += (maxWords - overlapWords); 
  }
  return chunks;
}

export async function ingestPDFDocuments(tenantId: string, docName: string, rawText: string) {
  await initializeVectorDB(); 

  const chunks = chunkText(rawText);
  console.log(`[RAG] Split PDF '${docName}' into ${chunks.length} chunks for tenant ${tenantId}`);

  if (chunks.length === 0) throw new Error("No readable text found in document.");

  // Generate vectors using Cohere
  const embedResponse = await cohere.embed({
    texts: chunks,
    model: "embed-english-v3.0",
    inputType: "search_document",
  });

  const embeddings = embedResponse.embeddings as number[][];

  // Format payload for Qdrant
  const points = chunks.map((chunkText, index) => ({
    id: crypto.randomUUID(), 
    vector: embeddings[index] as number[], 
    payload: { 
      tenantId, 
      sourceFile: docName,
      text: chunkText,
      ingestedAt: new Date().toISOString()
    }, 
  }));

  let attempt = 0;
  const maxRetries = 3;

  // Upload to Qdrant
  while (attempt < maxRetries) {
    try {
      await qdrantClient.put(`/collections/${COLLECTION_NAME}/points?wait=true`, { points });
      break; 
    } catch (error: any) {
      attempt++;
      console.log(`[Qdrant] Network Error. Retrying upload (Attempt ${attempt}/${maxRetries})...`);
      if (attempt >= maxRetries) {
        throw new Error(error.response?.data?.status?.error || error.message);
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry to let DB wake up
    }
  }

  console.log(`[RAG] Successfully stored ${chunks.length} vectorized chunks to isolated namespace.`);
  return true;
}

export async function ingestDocument(tenantId: string, docId: string, text: string) {
  return ingestPDFDocuments(tenantId, `manual_doc_${docId}`, text);
}

export async function searchKnowledgeBase(tenantId: string, textQuery: string) {
  const queryEmbed = await cohere.embed({
    texts: [textQuery],
    model: "embed-english-v3.0",
    inputType: "search_query",
  });

  const embedding = (queryEmbed.embeddings as number[][])[0];

  // Search via Axios
  const searchResponse = await qdrantClient.post(`/collections/${COLLECTION_NAME}/points/search`, {
    vector: embedding,
    limit: 5,
    with_payload: true,
    filter: {
      must: [{ key: "tenantId", match: { value: tenantId } }],
    },
  });

  const resultData = searchResponse.data;

  if (!resultData.result || resultData.result.length === 0) {
    return { context: "No relevant documentation found.", maxScore: 0 };
  }

  const maxScore = resultData.result[0].score || 0;
  const context = resultData.result.map((item: any) => item.payload?.text).join("\n\n---\n\n");

  return { context, maxScore };
}