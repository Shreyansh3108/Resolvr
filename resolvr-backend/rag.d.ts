export declare function initializeVectorDB(): Promise<void>;
export declare function chunkText(text: string, maxWords?: number, overlapWords?: number): string[];
export declare function ingestPDFDocuments(tenantId: string, docName: string, rawText: string): Promise<boolean>;
export declare function ingestDocument(tenantId: string, docId: string, text: string): Promise<boolean>;
export declare function searchKnowledgeBase(tenantId: string, textQuery: string): Promise<{
    context: any;
    maxScore: any;
}>;
//# sourceMappingURL=rag.d.ts.map