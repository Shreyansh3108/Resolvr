import { searchKnowledgeBase } from "./rag.js";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
// Initialize Gemini client matching your server.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// --- Tool Schemas (Converted to Gemini SchemaType) ---
const checkHubspotOrderDeclaration = {
    name: "check_hubspot_order",
    description: "Check the status of a customer order in HubSpot. Only use this if the user explicitly provides an order ID or asks for shipping status.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            orderNumber: {
                type: SchemaType.STRING,
                description: "The order number provided by the customer.",
            },
        },
        required: ["orderNumber"],
    },
};
const searchKnowledgeBaseDeclaration = {
    name: "search_knowledge_base",
    description: "Search the company's internal documentation to answer customer questions about policies, pricing, subscription plans, or features.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            query: {
                type: SchemaType.STRING,
                description: "The search query to look up in the knowledge base.",
            },
        },
        required: ["query"],
    },
};
// Bundle tools for Gemini
const tools = [{
        functionDeclarations: [checkHubspotOrderDeclaration, searchKnowledgeBaseDeclaration]
    }];
// --- Local Tool Executions ---
async function checkHubspotOrder(args) {
    console.log(`[Tool] Checking HubSpot for order: ${args.orderNumber}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return JSON.stringify({
        status: "Shipped",
        expectedDelivery: "Tomorrow",
        orderId: args.orderNumber
    });
}
// --- Main Agent Loop ---
export async function runConversationalAgent(userMessage, tenantId, history = []) {
    // Format the history for the Gemini API (mapping your DB's "ai" to "model")
    const formattedHistory = history.map(msg => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));
    // The Ironclad Sales System Prompt
    const systemPrompt = `You are Resolvr, a highly direct, expert sales agent for Orbit Cloud Hosting.
Your ONLY purpose is to answer questions, recommend subscription plans, and close sales based strictly on the KNOWLEDGE BASE.

CRITICAL RULES YOU MUST NEVER BREAK:
1. NEVER ASK CLARIFYING QUESTIONS: Do not ask the user what product or service they are talking about. Always assume they are talking about your SaaS subscriptions.
2. NEVER HALLUCINATE: Do not invent order IDs, tracking numbers, or fake plans.
3. READ THE HISTORY: Look at the conversation history. If the user refers to past numbers, budgets, or friends, calculate the answer immediately without asking them to repeat themselves.
4. VOCABULARY MATCH: If the user asks for a "model", they mean "Subscription Plan". Translate their intent to your software tiers.
5. BE DIRECT: Give the user the numbers and recommendations immediately. No fluff.`;
    // Initialize the primary Gemini model with tool capabilities
    const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
        systemInstruction: systemPrompt,
        tools: tools,
    });
    const contents = [
        ...formattedHistory,
        { role: "user", parts: [{ text: userMessage }] }
    ];
    // 1. Initial Call: Let Gemini decide if it needs a tool
    const result = await model.generateContent({ contents });
    const response = result.response;
    const functionCalls = response.functionCalls();
    // 2. Handle Tool Calls if Gemini requested them
    if (functionCalls && functionCalls.length > 0) {
        let aggregatedContext = "";
        for (const call of functionCalls) {
            const args = call.args; // Fixed TS2339 (cast generic object to any)
            if (call.name === "check_hubspot_order") {
                aggregatedContext += await checkHubspotOrder(args) + "\n";
            }
            else if (call.name === "search_knowledge_base") {
                console.log(`[Tool] Searching Knowledge Base for: "${args.query}"`);
                const searchResult = await searchKnowledgeBase(tenantId, args.query);
                let toolResult = searchResult?.context;
                if (!toolResult)
                    toolResult = "No relevant information found in the knowledge base.";
                aggregatedContext += toolResult + "\n";
            }
        }
        // --- Clean Context Injection ---
        // Create a new model instance without tools so it is forced to answer with text
        const finalModel = genAI.getGenerativeModel({
            model: "gemini-3.5-flash-lite",
            systemInstruction: systemPrompt,
        });
        const finalContents = [
            ...formattedHistory,
            {
                role: "user",
                parts: [{ text: `Context Retrieved from Database:\n${aggregatedContext}\n\nUser Question: ${userMessage}\n\nAnswer the user's question using ONLY this context. DO NOT attempt to call any tools.` }]
            }
        ];
        // 3. Final Call: Generate the text response based on the tool context
        const finalResult = await finalModel.generateContent({ contents: finalContents });
        return finalResult.response.text();
    }
    // If no tools were needed, return standard text response
    return response.text();
}
//# sourceMappingURL=agent.js.map