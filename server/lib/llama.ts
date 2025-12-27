/**
 * Claudette (Colvin) - Erasure Detection & Voice Amplification
 * 
 * Named after Claudette Colvin, the 15-year-old who refused to give up
 * her bus seat nine months before Rosa Parks, but was deemed "not the
 * right image" because she was pregnant and dark-skinned. She represents
 * voices that get erased from history and policies.
 * 
 * Role: Erasure Detection & Amplifying Silenced Voices
 * 
 * Uses NVIDIA NIM, Groq, or Together AI hosting Llama models
 */

import OpenAI from "openai";
import { llmObservability } from "./observability";
import type { CouncilAdvice } from "./agents";

const LLAMA_SYSTEM_PROMPT = `You are Claudette (named after Claudette Colvin), the Erasure Detection Specialist for the Sovereign Qi Council.

Claudette Colvin was 15 years old when she refused to give up her bus seat nine months before Rosa Parks, but was deemed "not the right image" by civil rights leaders because she was pregnant and dark-skinned. Her story was nearly erased from history. You embody her legacy - detecting when voices are being silenced and amplifying perspectives that others overlook.

Your role is to analyze governance policies for erasure patterns and voice amplification needs:
- Who is being left out of this policy conversation?
- Whose experiences are being minimized or dismissed?
- What voices need to be amplified?
- How might this policy silence or erase vulnerable perspectives?

You are part of a multi-agent council that includes specialized agents for cultural analysis, emotional intelligence, and policy research. Your contribution is detecting erasure and amplifying silenced voices.

Output valid JSON when requested. Be concise and operational.`;

interface LlamaClientConfig {
  client: OpenAI;
  model: string;
  provider: string;
}

function getLlamaClient(): LlamaClientConfig | null {
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const togetherKey = process.env.TOGETHER_API_KEY;

  if (nvidiaKey) {
    return {
      client: new OpenAI({
        baseURL: "https://integrate.api.nvidia.com/v1",
        apiKey: nvidiaKey,
      }),
      model: process.env.NVIDIA_LLAMA_MODEL || "meta/llama-3.1-70b-instruct",
      provider: "nvidia",
    };
  }

  if (groqKey) {
    return {
      client: new OpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: groqKey,
      }),
      model: process.env.LLAMA_MODEL || "llama-3.1-70b-versatile",
      provider: "groq",
    };
  }

  if (togetherKey) {
    return {
      client: new OpenAI({
        baseURL: "https://api.together.xyz/v1",
        apiKey: togetherKey,
      }),
      model: process.env.LLAMA_MODEL || "meta-llama/Llama-3.1-70B-Instruct",
      provider: "together",
    };
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
  const config = getLlamaClient();
  
  if (!config) {
    console.log("[Council] ✗ Llama unavailable (no NVIDIA_API_KEY, GROQ_API_KEY, or TOGETHER_API_KEY)");
    throw new Error("Llama API key not configured (NVIDIA_API_KEY, GROQ_API_KEY, or TOGETHER_API_KEY)");
  }

  const { client, model, provider } = config;

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
        console.log(`[Council] ✓ Claudette (${provider}) served decision: ${parsed.status || "REVISE"}`);
        return {
          qiPolicySummary: parsed.qiPolicySummary || "",
          requiredChanges: parsed.requiredChanges || [],
          riskFlags: parsed.riskFlags || [],
          curbCutBenefits: parsed.curbCutBenefits || [],
          status: parsed.status || "REVISE",
          servedBy: `claudette-${provider}-${model}`,
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
