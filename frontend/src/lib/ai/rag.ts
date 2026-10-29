// src/lib/ai/rag.ts
// Knowledge base retrieval engine for GrowthOS agents.
// Pulls real-world Indian D2C benchmarks, logistics data, and payment playbooks.

import { db } from "@/lib/db";

export interface KnowledgeSnippet {
  id: string;
  content: string;
  source: string;
  category: string;
}

export async function retrieveKnowledgeChunks(
  category: string,
  industry?: string | null,
  limit: number = 3
): Promise<KnowledgeSnippet[]> {
  try {
    const chunks = await db.knowledgeChunk.findMany({
      where: {
        category,
        OR: [
          { industry: industry ?? undefined },
          { industry: null },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return chunks.map((c: any) => ({
      id: c.id,
      content: c.content,
      source: c.source,
      category: c.category,
    }));
  } catch (err) {
    console.error("[RAG RETRIEVAL ERROR]", err);
    return [];
  }
}

export async function buildRAGPromptBlock(
  category: string,
  industry?: string | null
): Promise<string> {
  const snippets = await retrieveKnowledgeChunks(category, industry, 3);
  if (!snippets.length) return "";

  const snippetText = snippets
    .map(
      (s, idx) =>
        `[Fact ${idx + 1} — Source: ${s.source}]\n"${s.content}"`
    )
    .join("\n\n");

  return `
KNOWLEDGE BASE (Retrieved Indian D2C Benchmarks & Playbooks):
${snippetText}
Use these empirical facts to validate your recommendations and cite source reports where applicable.`.trim();
}
