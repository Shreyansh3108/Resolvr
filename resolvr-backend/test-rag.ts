import { initializeVectorDB, ingestDocument, searchKnowledgeBase } from "./rag.js";

async function runTest() {
  const mockTenantId = "mock-tenant-id-123";

  console.log("1. Initializing Vector DB Collection...");
  await initializeVectorDB();

  console.log("\n2. Ingesting a test FAQ document...");
  const fakeUUID = "123e4567-e89b-12d3-a456-426614174000"; // Qdrant requires UUID format for IDs
  await ingestDocument(
    mockTenantId,
    fakeUUID,
    "FAQ: Resolvr offers a 30-day money-back guarantee for all new enterprise subscriptions. Refunds are processed within 5-7 business days."
  );

  console.log("\n3. Searching the Knowledge Base...");
  const query = "How long does it take to get my money back?";
  console.log(`Query: "${query}"`);
  
  const results = await searchKnowledgeBase(mockTenantId, query);
  
  console.log("\n--- Search Results Retrieved ---");
  console.log(results);
}

runTest().catch(console.error);