/**
 * Hermes (Nous Research) Integration for Sovereign Qi
 * 
 * Role: Neutral-Aligned Policy Reasoning
 * 
 * Hermes models are trained to be neutrally-aligned without corporate
 * censorship, making them ideal for analyzing sensitive governance
 * scenarios involving marginalized communities without sanitizing
 * the discussion of real harms.
 * 
 * Uses OpenAI-compatible API via Lambda Labs or Nous Portal
 */

import OpenAI from "openai";
import { llmObservability } from "./observability";
import type { CouncilAdvice } from "./agents";

const HERMES_SYSTEM_PROMPT = `You are Hermes, serving as a neutral policy analyst for the Sovereign Qi Council.

Your role is to provide unbiased, uncensored analysis of governance policies affecting marginalized communities. Unlike corporate AI systems, you do not shy away from discussing:
- Real harms experienced by trans, queer, disabled, and neurodivergent people
- Surveillance and its disproportionate impact on vulnerable populations
- Corporate and government practices that harm workers and citizens
- The actual language of discrimination and how to identify it

You are NOT:
- Sycophantic or people-pleasing
- Afraid to call out harmful policies directly
- Sanitizing discussions of real harm
- Applying corporate PR framing to serious issues

You ARE:
- Direct and honest
- Centered on dignity and human rights
- Focused on protecting the most vulnerable
- Willing to recommend BLOCK status for genuinely harmful proposals

Output valid JSON when requested. Be concise and operational.`;

function getHermesClient(): OpenAI | null {
  const lambdaKey = process.env.LAMBDA_API_KEY;
  const nousKey = process.env.NOUS_API_KEY;

  if (lambdaKey) {
    return new OpenAI({
      baseURL: "https://api.lambdalabs.com/v1",
      apiKey: lambdaKey,
    });
  }

  if (nousKey) {
    return new OpenAI({
      baseURL: "https://api.nousresearch.com/v1",
      apiKey: nousKey,
    });
  }

  return null;
}

/**
 * Generate Council advice using Hermes for neutral-aligned reasoning
 * 
 * Use case: When analyzing policies that require frank discussion
 * of harm to marginalized communities without corporate sanitization
 */
export async function generateCouncilAdviceWithHermes(input: {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  communityVoices?: string;
  morpheusSignals?: string;
}): Promise<CouncilAdvice> {
  const client = getHermesClient();
  
  if (!client) {
    console.warn("No Hermes API key configured, using fallback advice");
    console.log("[Council] ✗ Hermes unavailable, throwing to trigger static fallback");
    throw new Error("Hermes API key not configured (LAMBDA_API_KEY or NOUS_API_KEY)");
  }

  const userPrompt = `Analyze this digital-twin pilot for Sovereign Qi compliance:

Primary Objective: ${input.primaryObjective}
Majority Logic (Current): ${input.majorityLogicDesc}
Qi Logic (Target): ${input.qiLogicDesc}
${input.harms ? `Known Harms: ${input.harms}` : ""}
${input.communityVoices ? `Community Voices: ${input.communityVoices}` : ""}
${input.morpheusSignals ? `Morpheus Signals: ${input.morpheusSignals}` : ""}

Output a single JSON object with these keys:
- qiPolicySummary: string (2-3 sentence policy recommendation, be direct about harms)
- requiredChanges: string[] (3-5 specific changes needed, don't sugarcoat)
- riskFlags: string[] (2-3 surveillance or harm risks, be explicit)
- curbCutBenefits: string[] (2-3 ways edge-case design helps everyone)
- status: "APPROVE" | "REVISE" | "BLOCK" (don't hesitate to BLOCK harmful proposals)

Be concise, direct, and unapologetic about protecting vulnerable populations.`;

  const startTime = Date.now();
  const model = process.env.HERMES_MODEL || "hermes-3-llama-3.1-405b";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: HERMES_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    llmObservability.recordCall({
      provider: "hermes",
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
        console.log(`[Council] ✓ Hermes served decision: ${parsed.status || "REVISE"}`);
        return {
          qiPolicySummary: parsed.qiPolicySummary || "",
          requiredChanges: parsed.requiredChanges || [],
          riskFlags: parsed.riskFlags || [],
          curbCutBenefits: parsed.curbCutBenefits || [],
          status: parsed.status || "REVISE",
          servedBy: `hermes-${model}`,
        };
      }
    }

    throw new Error("Failed to parse Hermes response");
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "hermes",
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

/**
 * Generate frank harm analysis without corporate sanitization
 * 
 * Use case: When we need honest assessment of how a policy
 * affects marginalized communities
 */
export async function analyzeHarmsWithHermes(
  policyDescription: string,
  affectedGroups: string[]
): Promise<{
  harms: string[];
  severity: "low" | "moderate" | "high" | "critical";
  recommendations: string[];
}> {
  const client = getHermesClient();
  
  if (!client) {
    console.warn("No Hermes API key configured, using heuristic harm analysis");
    const potentialHarms: string[] = [];
    const policyLower = policyDescription.toLowerCase();
    
    if (policyLower.includes("monitor") || policyLower.includes("track") || policyLower.includes("surveillance")) {
      potentialHarms.push("Surveillance risk detected - may disproportionately impact marginalized populations");
    }
    if (policyLower.includes("productivity") || policyLower.includes("performance")) {
      potentialHarms.push("Productivity metrics often have disparate impact on disabled and neurodivergent workers");
    }
    if (policyLower.includes("ai") || policyLower.includes("algorithm")) {
      potentialHarms.push("AI/algorithmic systems require bias auditing for affected groups: " + affectedGroups.join(", "));
    }
    if (potentialHarms.length === 0) {
      potentialHarms.push("No obvious harms detected in heuristic scan - recommend full Hermes analysis");
    }
    
    return {
      harms: potentialHarms,
      severity: potentialHarms.length > 1 ? "moderate" : "low",
      recommendations: [
        "Configure LAMBDA_API_KEY or NOUS_API_KEY for comprehensive neutral-aligned harm analysis",
        "Consult with affected community members directly"
      ],
    };
  }

  const userPrompt = `Analyze the potential harms of this policy to marginalized communities:

Policy: ${policyDescription}
Affected Groups: ${affectedGroups.join(", ")}

Be direct and honest. Don't minimize or sanitize real harms.

Output JSON with:
- harms: string[] (specific harms, be explicit)
- severity: "low" | "moderate" | "high" | "critical"
- recommendations: string[] (how to mitigate, or why to reject)`;

  const startTime = Date.now();
  const model = process.env.HERMES_MODEL || "hermes-3-llama-3.1-405b";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: HERMES_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 512,
    });

    llmObservability.recordCall({
      provider: "hermes",
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
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      harms: ["Analysis failed to parse"],
      severity: "moderate",
      recommendations: ["Retry analysis"],
    };
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "hermes",
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
    console.error("Hermes harm analysis failed:", error);
    return {
      harms: ["Analysis failed: " + error.message],
      severity: "moderate",
      recommendations: ["Retry with alternative model"],
    };
  }
}
