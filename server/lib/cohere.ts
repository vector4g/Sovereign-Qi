/**
 * Cohere Integration for Sovereign Qi
 * 
 * Role: Governance Signal Reranking & Semantic Search
 * 
 * Cohere's rerank API identifies the most relevant governance signals
 * from Morpheus pipeline outputs, prioritizing patterns that indicate
 * harm to vulnerable populations.
 */

import { CohereClientV2 } from "cohere-ai";
import { llmObservability } from "./observability";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

export interface RerankResult {
  index: number;
  relevanceScore: number;
  document: string;
}

/**
 * Rerank governance signals by relevance to a specific harm query
 * 
 * Use case: When Alan reviews a pilot, prioritize which Morpheus signals
 * are most relevant to the specific harms being analyzed
 */
export async function rerankGovernanceSignals(
  query: string,
  signals: string[],
  topN: number = 5
): Promise<RerankResult[]> {
  if (!process.env.COHERE_API_KEY) {
    console.warn("COHERE_API_KEY not configured, returning unranked signals");
    return signals.slice(0, topN).map((doc, index) => ({
      index,
      relevanceScore: 1.0 - (index * 0.1),
      document: doc,
    }));
  }

  const startTime = Date.now();
  try {
    const response = await cohere.rerank({
      model: "rerank-v3.5",
      query,
      documents: signals,
      topN,
    });

    llmObservability.recordCall({
      provider: "cohere",
      model: "rerank-v3.5",
      endpoint: "rerank",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "complete",
      success: true,
    });

    return response.results.map((r) => ({
      index: r.index,
      relevanceScore: r.relevanceScore,
      document: signals[r.index],
    }));
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "cohere",
      model: "rerank-v3.5",
      endpoint: "rerank",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    console.error("Cohere rerank failed:", error);
    return signals.slice(0, topN).map((doc, index) => ({
      index,
      relevanceScore: 1.0 - (index * 0.1),
      document: doc,
    }));
  }
}

/**
 * Embed governance signals for similarity search
 * 
 * Use case: Find similar harm patterns across organizations
 */
export async function embedSignals(texts: string[]): Promise<number[][]> {
  if (!process.env.COHERE_API_KEY) {
    console.warn("COHERE_API_KEY not configured, returning empty embeddings");
    return texts.map(() => []);
  }

  const startTime = Date.now();
  try {
    const response = await cohere.embed({
      model: "embed-english-v3.0",
      texts,
      inputType: "search_document",
      embeddingTypes: ["float"],
    });

    llmObservability.recordCall({
      provider: "cohere",
      model: "embed-english-v3.0",
      endpoint: "embed",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "complete",
      success: true,
    });

    return response.embeddings.float || [];
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "cohere",
      model: "embed-english-v3.0",
      endpoint: "embed",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    console.error("Cohere embed failed:", error);
    return texts.map(() => []);
  }
}

/**
 * Generate policy analysis using Cohere Command
 * 
 * Use case: Alternative reasoning path when Claude/OpenAI are unavailable
 * Falls back to heuristic summary when API unavailable
 */
export async function analyzeWithCohere(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!process.env.COHERE_API_KEY) {
    console.warn("COHERE_API_KEY not configured, using heuristic response");
    return `Analysis unavailable: Cohere API not configured. Based on the input, consider reviewing governance patterns for dignity-first alignment and surveillance risks.`;
  }

  const startTime = Date.now();
  try {
    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const usage = response.usage;
    llmObservability.recordCall({
      provider: "cohere",
      model: "command-r-plus",
      endpoint: "chat",
      latencyMs: Date.now() - startTime,
      inputTokens: usage?.tokens?.inputTokens || 0,
      outputTokens: usage?.tokens?.outputTokens || 0,
      totalTokens: (usage?.tokens?.inputTokens || 0) + (usage?.tokens?.outputTokens || 0),
      finishReason: response.finishReason || "complete",
      success: true,
    });

    const content = response.message?.content;
    if (Array.isArray(content) && content.length > 0) {
      const firstContent = content[0] as { type?: string; text?: string };
      if (firstContent.type === "text" && firstContent.text) {
        return firstContent.text;
      }
    }
    return "";
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "cohere",
      model: "command-r-plus",
      endpoint: "chat",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    throw error;
  }
}
