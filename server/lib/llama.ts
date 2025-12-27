/**
 * Llama Integration for Sovereign Qi
 * 
 * Role: Additional Open-Source Reasoning Agent
 * 
 * Uses Together AI, Groq, or other providers hosting Llama models
 * for additional policy analysis perspective.
 */

import OpenAI from "openai";
import { llmObservability } from "./observability";
import type { CouncilAdvice } from "./agents";

const LLAMA_SYSTEM_PROMPT = `You are Llama, serving as a policy analyst for the Sovereign Qi Council.

Your role is to provide clear, practical analysis of governance policies affecting marginalized communities. Focus on:
- Concrete implementation concerns
- Real-world impact on vulnerable populations
- Practical steps for harm reduction
- Technical feasibility of proposed changes

You are part of a multi-agent council that includes specialized agents for cultural analysis, emotional intelligence, and policy research. Your contribution is practical implementation analysis.

Output valid JSON when requested. Be concise and operational.`;

function getLlamaClient(): OpenAI | null {
  const groqKey = process.env.GROQ_API_KEY;
  const togetherKey = process.env.TOGETHER_API_KEY;

  if (groqKey) {
    return new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
    });
  }

  if (togetherKey) {
    return new OpenAI({
      baseURL: "https://api.together.xyz/v1",
      apiKey: togetherKey,
    });
  }

  return null;
}

export async function generateCouncilAdviceWithLlama(input: {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  communityVoices?: string;
  morpheusSignals?: string;
  advisoryContext?: string;
}): Promise<CouncilAdvice> {
  const client = getLlamaClient();
  
  if (!client) {
    console.log("[Council] ✗ Llama unavailable (no GROQ_API_KEY or TOGETHER_API_KEY)");
    throw new Error("Llama API key not configured (GROQ_API_KEY or TOGETHER_API_KEY)");
  }

  const userPrompt = `Analyze this digital-twin pilot for Sovereign Qi compliance:

Primary Objective: ${input.primaryObjective}
Majority Logic (Current): ${input.majorityLogicDesc}
Qi Logic (Target): ${input.qiLogicDesc}
${input.harms ? `Known Harms: ${input.harms}` : ""}
${input.communityVoices ? `Community Voices: ${input.communityVoices}` : ""}
${input.morpheusSignals ? `Morpheus Signals: ${input.morpheusSignals}` : ""}
${input.advisoryContext ? `Advisory Context: ${input.advisoryContext}` : ""}

Output a single JSON object with these keys:
- qiPolicySummary: string (2-3 sentence policy recommendation focusing on practical implementation)
- requiredChanges: string[] (3-5 specific, actionable changes needed)
- riskFlags: string[] (2-3 implementation or surveillance risks)
- curbCutBenefits: string[] (2-3 ways edge-case design helps everyone)
- status: "APPROVE" | "REVISE" | "BLOCK"

Focus on practical implementation concerns.`;

  const startTime = Date.now();
  const model = process.env.LLAMA_MODEL || "llama-3.1-70b-versatile";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: LLAMA_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });

    llmObservability.recordCall({
      provider: "llama",
      model,
      endpoint: "chat.completions",
      latencyMs: Date.now() - startTime,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
      finishReason: response.choices[0]?.finish_reason || "unknown",
      success: true,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`[Council] ✓ Llama served decision: ${parsed.status || "REVISE"}`);
        return {
          qiPolicySummary: parsed.qiPolicySummary || "",
          requiredChanges: parsed.requiredChanges || [],
          riskFlags: parsed.riskFlags || [],
          curbCutBenefits: parsed.curbCutBenefits || [],
          status: parsed.status || "REVISE",
          servedBy: `llama-${model}`,
        };
      }
    }

    throw new Error("Failed to parse Llama response");
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "llama",
      model,
      endpoint: "chat.completions",
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
