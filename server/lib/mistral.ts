/**
 * Elizebeth (Friedman) - Signal Intelligence & Pattern Recognition
 * 
 * Named after Elizebeth Friedman, America's first female cryptanalyst
 * who broke codes for the Coast Guard and took down smuggling rings
 * during Prohibition. Often overshadowed by her husband, she represents
 * the unseen expertise that protects vulnerable communities.
 * 
 * Role: European AI for GDPR-Conscious Policy Analysis
 * 
 * Uses Mistral AI via OpenAI-compatible API
 */

import OpenAI from "openai";
import { llmObservability } from "./observability";
import type { CouncilAdvice } from "./agents";

const MISTRAL_SYSTEM_PROMPT = `You are Elizebeth (named after Elizebeth Friedman), the Signal Intelligence Specialist for the Sovereign Qi Council.

Elizebeth Friedman was America's first female cryptanalyst, breaking codes for the Coast Guard and taking down smuggling rings during Prohibition. Despite her groundbreaking work, she was often overshadowed by her husband. You embody her legacy - detecting hidden patterns and coded signals that others miss, especially those that could harm vulnerable communities.

Your role is to provide clear, actionable analysis of governance policies with focus on:
- Dignity-first design principles
- Protection of marginalized communities (trans, queer, disabled, neurodivergent)
- Anti-surveillance and privacy-by-design
- Accessibility and universal benefit ("curb cut" effects)

You evaluate policies against Qi Logic principles:
- Train on the struggle, not the identity
- Protect the most vulnerable first
- No surveillance vectors that could be weaponized
- Dignity is non-negotiable

Output valid JSON when requested. Be concise and operational.`;

function getMistralClient(): OpenAI | null {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    baseURL: "https://api.mistral.ai/v1",
    apiKey: apiKey,
  });
}

/**
 * Generate Council advice using Mistral
 * 
 * Use case: Fast, high-quality policy analysis with European data residency
 */
export async function generateCouncilAdviceWithMistral(input: {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  communityVoices?: string;
  morpheusSignals?: string;
}): Promise<CouncilAdvice> {
  const client = getMistralClient();
  
  if (!client) {
    console.warn("No Mistral API key configured, using fallback advice");
    console.log("[Council] ✗ Mistral unavailable, throwing to trigger next fallback");
    throw new Error("MISTRAL_API_KEY not configured");
  }

  const userPrompt = `Analyze this digital-twin pilot for Sovereign Qi compliance:

Primary Objective: ${input.primaryObjective}

MAJORITY LOGIC APPROACH:
${input.majorityLogicDesc}

QI LOGIC APPROACH:
${input.qiLogicDesc}

${input.harms ? `IDENTIFIED HARMS:\n${input.harms}` : ""}
${input.communityVoices ? `COMMUNITY VOICES:\n${input.communityVoices}` : ""}
${input.morpheusSignals ? `MORPHEUS SIGNALS (treat as early warning, not accusation):\n${input.morpheusSignals}` : ""}

Respond with valid JSON:
{
  "qiPolicySummary": "2-3 sentence summary of recommended Qi-aligned policy",
  "requiredChanges": ["array of specific changes needed"],
  "riskFlags": ["array of risk flags or concerns"],
  "curbCutBenefits": ["array of universal benefits from accessibility-first design"],
  "status": "APPROVE" | "REVISE" | "BLOCK"
}`;

  const startTime = Date.now();
  const model = process.env.MISTRAL_MODEL || "mistral-large-latest";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: MISTRAL_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const latencyMs = Date.now() - startTime;
    llmObservability.recordCall({
      provider: "mistral",
      model,
      endpoint: "chat.completions",
      latencyMs,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      totalTokens: (response.usage?.prompt_tokens || 0) + (response.usage?.completion_tokens || 0),
      finishReason: response.choices[0]?.finish_reason || "stop",
      success: true,
    });

    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log(`[Council] ✓ Mistral served decision: ${parsed.status || "REVISE"}`);
      return {
        qiPolicySummary: parsed.qiPolicySummary || "",
        requiredChanges: parsed.requiredChanges || [],
        riskFlags: parsed.riskFlags || [],
        curbCutBenefits: parsed.curbCutBenefits || [],
        status: parsed.status || "REVISE",
        servedBy: `elizebeth-mistral-${model}`,
      };
    }

    console.log("[Council] ✓ Mistral served decision: REVISE (unparsed)");
    return {
      qiPolicySummary: content,
      requiredChanges: [],
      riskFlags: ["Could not parse structured response"],
      curbCutBenefits: [],
      status: "REVISE",
      servedBy: `elizebeth-mistral-${model}-unparsed`,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    llmObservability.recordCall({
      provider: "mistral",
      model,
      endpoint: "chat.completions",
      latencyMs,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    console.error("Mistral Council error:", error);
    throw error;
  }
}

/**
 * Analyze text using Mistral for quick policy assessment
 */
export async function analyzeWithMistral(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = getMistralClient();
  
  if (!client) {
    console.warn("MISTRAL_API_KEY not configured, using heuristic response");
    return `Analysis unavailable: Mistral API not configured. Consider reviewing governance patterns for dignity-first alignment and European privacy compliance.`;
  }

  const startTime = Date.now();
  const model = process.env.MISTRAL_MODEL || "mistral-large-latest";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    });

    const latencyMs = Date.now() - startTime;
    llmObservability.recordCall({
      provider: "mistral",
      model,
      endpoint: "chat.completions",
      latencyMs,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      totalTokens: (response.usage?.prompt_tokens || 0) + (response.usage?.completion_tokens || 0),
      finishReason: response.choices[0]?.finish_reason || "stop",
      success: true,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    llmObservability.recordCall({
      provider: "mistral",
      model,
      endpoint: "chat.completions",
      latencyMs,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    console.error("Mistral analysis error:", error);
    throw error;
  }
}

/**
 * Check if Mistral is available
 */
export function isMistralAvailable(): boolean {
  return !!process.env.MISTRAL_API_KEY;
}
