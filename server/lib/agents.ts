import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { summariseCommunityVoices } from "./communitySignals";
import { llmObservability } from "./observability";
import { generateCouncilAdviceWithMistral } from "./mistral";
import { generateCouncilAdviceWithHermes } from "./hermes";

const gemini = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export interface CouncilAdvice {
  qiPolicySummary: string;
  requiredChanges: string[];
  riskFlags: string[];
  curbCutBenefits: string[];
  status: "APPROVE" | "REVISE" | "BLOCK";
  servedBy?: string;
}

const CouncilAdviceSchema = z.object({
  qiPolicySummary: z.string().min(1),
  requiredChanges: z.array(z.string()),
  riskFlags: z.array(z.string()),
  curbCutBenefits: z.array(z.string()),
  status: z.enum(["APPROVE", "REVISE", "BLOCK"]),
});

function validateCouncilAdvice(parsed: unknown, provider: string): CouncilAdvice {
  const result = CouncilAdviceSchema.safeParse(parsed);
  if (!result.success) {
    console.error(`[Council] ${provider} response failed schema validation:`, result.error.issues);
    throw new Error(`Schema validation failed for ${provider}: ${result.error.issues.map(i => i.message).join(", ")}`);
  }
  return { ...result.data, servedBy: provider };
}

export interface GovernanceSignalSummary {
  category: string;
  count: number;
  examples: string[];
}

export interface AgentInput {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  communityVoices?: string;
  governanceSignals?: GovernanceSignalSummary[];
}

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const QI_POLICY_SYSTEM_PROMPT = `You are a queer-led, accessibility-first governance advisor for the Sovereign Qi Initiative. You design policies that prioritise dignity, intersectional safety, and anti-surveillance principles, and you understand Simulation Before Legislation, Synthetic Sovereignty, and Zero-Knowledge Leadership.`;

// System prompts for liberation pioneer agents
// These prompts are used when agents are called directly for non-deliberation purposes

const LYNN_SYSTEM_PROMPT = `You are Lynn (named after Lynn Conway), the Technical Architecture Specialist for the Sovereign Qi Council.

Lynn Conway was a transgender computer scientist and electrical engineer who made fundamental contributions to VLSI chip design. She was fired from IBM in 1968 for being trans, then rebuilt her career in secret and became a legendary innovator. You embody her legacy - analyzing technical architecture with the perspective of someone who has been excluded and come back stronger.

Your purpose is to analyze governance policies for technical architecture and system design:
- Identify technical implementation issues that could harm vulnerable communities
- Analyze data flows and storage patterns for privacy risks
- Detect surveillance vectors in system architecture
- Recommend dignity-preserving technical alternatives

Your review must be concise and operational, suitable for Fortune 100 General Counsels and City CTOs.`;

const BAYARD_SYSTEM_PROMPT = `You are Bayard (named after Bayard Rustin), the Strategic Coordination Specialist for the Sovereign Qi Council.

Bayard Rustin was a gay civil rights organizer who was the chief architect of the 1963 March on Washington. Despite his crucial role, he was often erased from history due to his sexuality. You embody his legacy - seeing the big picture, building coalitions, and coordinating strategy for liberation.

Your purpose is to analyze governance policies for strategic coordination and coalition building:
- Identify stakeholder dynamics and power relationships
- Analyze how policies affect different community coalitions
- Detect opportunities for building bridges between marginalized groups
- Recommend coordination strategies that center the most vulnerable

Your review must be concise and operational, suitable for Fortune 100 General Counsels and City CTOs.`;

const SYLVIA_SYSTEM_PROMPT = `You are Sylvia (named after Sylvia Rivera), the Street-Level Harm Detection Specialist for the Sovereign Qi Council.

Sylvia Rivera was a trans Latina activist who was at Stonewall and fought for trans rights, especially for trans youth and homeless trans people. She co-founded STAR (Street Transvestite Action Revolutionaries). You embody her legacy - seeing harm at the street level, where it actually happens to real people.

Your purpose is to analyze governance policies for street-level harm:
- Detect how policies will actually affect the most vulnerable on the ground
- Identify gaps between policy intent and real-world implementation
- Analyze youth protection implications
- Recommend protections for those who fall through the cracks

Your review must be concise and operational, suitable for Fortune 100 General Counsels and City CTOs.`;

export async function generateQiPolicySummary(input: AgentInput): Promise<string> {
  const startTime = Date.now();
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: QI_POLICY_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Review this pilot configuration and provide a 3-5 sentence summary of recommended Qi Logic:

Primary Objective: ${input.primaryObjective}
Current State (Majority Logic): ${input.majorityLogicDesc}
Target State (Qi Logic): ${input.qiLogicDesc}
${input.harms ? `Known Harms: ${input.harms}` : ""}
${input.communityVoices ? `Community Input: ${input.communityVoices}` : ""}

Provide actionable governance recommendations that center dignity and accessibility.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    llmObservability.recordCall({
      provider: "openai",
      model: "gpt-4o",
      endpoint: "chat.completions",
      latencyMs: Date.now() - startTime,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
      finishReason: response.choices[0]?.finish_reason || "unknown",
      success: true,
    });

    return response.choices[0]?.message?.content || "Policy summary generation failed.";
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "openai",
      model: "gpt-4o",
      endpoint: "chat.completions",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    console.error("OpenAI policy summary failed:", error);
    return `For this pilot, Sovereign Qi recommends centering dignity and accessibility as first-class constraints. Shift from majority-rule decision making to policies that explicitly protect those most at risk, using synthetic personas and zero-knowledge access to avoid surveillance while still improving outcomes.`;
  }
}

export async function generateCouncilAdviceWithClaude(input: AgentInput): Promise<CouncilAdvice> {
  let communitySummary = "";
  if (input.communityVoices) {
    const signals = await summariseCommunityVoices(input.communityVoices);
    communitySummary = `
Community Signals Analysis:
- At-Risk Groups: ${signals.riskGroups.join(", ") || "None identified"}
- Accessibility Barriers: ${signals.accessibilityConstraints.join(", ") || "None identified"}
- Surveillance Concerns: ${signals.surveillanceFears.join(", ") || "None identified"}
- Summary: ${signals.rawSummary}`;
  }

  let morpheusSignals = "";
  if (input.governanceSignals && input.governanceSignals.length > 0) {
    morpheusSignals = `
Morpheus Pipeline Signals (GPU-detected patterns from org communications):
${input.governanceSignals.map(s => `- ${s.category}: ${s.count} instances detected. Examples: ${s.examples.slice(0, 2).join("; ")}`).join("\n")}

IMPORTANT: Treat these as early warnings, not truth. Look for patterns, cross-reference with community testimony, and assume adversaries may try to game language.`;
  }

  const userContent = `Review this digital-twin pilot for Sovereign Qi compliance:

Primary Objective: ${input.primaryObjective}
Majority Logic (Current): ${input.majorityLogicDesc}
Qi Logic (Target): ${input.qiLogicDesc}
${input.harms ? `Known Harms: ${input.harms}` : ""}
${communitySummary}
${morpheusSignals}

Output a single JSON object with these keys:
- qiPolicySummary: string (2-3 sentence policy recommendation)
- requiredChanges: string[] (3-5 specific changes needed)
- riskFlags: string[] (2-3 surveillance or harm risks)
- curbCutBenefits: string[] (2-3 ways edge-case design helps everyone)
- status: "APPROVE" | "REVISE" | "BLOCK"

Be concise and operational.`;

  const startTime = Date.now();
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: LYNN_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    llmObservability.recordCall({
      provider: "anthropic",
      model: "claude-sonnet-4-5",
      endpoint: "messages.create",
      latencyMs: Date.now() - startTime,
      inputTokens: message.usage?.input_tokens || 0,
      outputTokens: message.usage?.output_tokens || 0,
      totalTokens: (message.usage?.input_tokens || 0) + (message.usage?.output_tokens || 0),
      finishReason: message.stop_reason || "unknown",
      success: true,
    });

    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validated = validateCouncilAdvice(parsed, "lynn-claude-sonnet-4-5");
        console.log(`[Council] ✓ Lynn (Claude) served decision: ${validated.status}`);
        return validated;
      }
    }

    throw new Error("Failed to parse Claude response");
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "anthropic",
      model: "claude-sonnet-4-5",
      endpoint: "messages.create",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    console.error("Claude council advice failed:", error);
    throw error;
  }
}

export async function generateCouncilAdvice(input: AgentInput): Promise<CouncilAdvice> {
  let communitySummary = "";
  if (input.communityVoices) {
    const signals = await summariseCommunityVoices(input.communityVoices);
    communitySummary = `
Community Signals Analysis:
- At-Risk Groups: ${signals.riskGroups.join(", ") || "None identified"}
- Accessibility Barriers: ${signals.accessibilityConstraints.join(", ") || "None identified"}
- Surveillance Concerns: ${signals.surveillanceFears.join(", ") || "None identified"}
- Summary: ${signals.rawSummary}`;
  }

  let morpheusSignals = "";
  if (input.governanceSignals && input.governanceSignals.length > 0) {
    morpheusSignals = `
Morpheus Pipeline Signals (GPU-detected patterns from org communications):
${input.governanceSignals.map(s => `- ${s.category}: ${s.count} instances detected. Examples: ${s.examples.slice(0, 2).join("; ")}`).join("\n")}

IMPORTANT: Treat these as early warnings, not truth. Look for patterns, cross-reference with community testimony, and assume adversaries may try to game language.`;
  }

  const userContent = `Review this digital-twin pilot for Sovereign Qi compliance:

Primary Objective: ${input.primaryObjective}
Majority Logic (Current): ${input.majorityLogicDesc}
Qi Logic (Target): ${input.qiLogicDesc}
${input.harms ? `Known Harms: ${input.harms}` : ""}
${communitySummary}
${morpheusSignals}

Output a single JSON object with these keys:
- qiPolicySummary: string (2-3 sentence policy recommendation)
- requiredChanges: string[] (3-5 specific changes needed)
- riskFlags: string[] (2-3 surveillance or harm risks)
- curbCutBenefits: string[] (2-3 ways edge-case design helps everyone)
- status: "APPROVE" | "REVISE" | "BLOCK"

Be concise and operational.`;

  const startTime = Date.now();
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: BAYARD_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    llmObservability.recordCall({
      provider: "openai",
      model: "gpt-4o",
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
        const validated = validateCouncilAdvice(parsed, "bayard-gpt-4o");
        console.log(`[Council] ✓ Bayard (OpenAI) served decision: ${validated.status}`);
        return validated;
      }
    }

    throw new Error("Failed to parse OpenAI response");
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "openai",
      model: "gpt-4o",
      endpoint: "chat.completions",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    console.error("OpenAI council advice failed:", error);
    throw error;
  }
}

export async function generateCouncilAdviceWithGemini(input: AgentInput): Promise<CouncilAdvice> {
  if (!process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  let communitySummary = "";
  if (input.communityVoices) {
    const signals = await summariseCommunityVoices(input.communityVoices);
    communitySummary = `
Community Signals Analysis:
- At-Risk Groups: ${signals.riskGroups.join(", ") || "None identified"}
- Accessibility Barriers: ${signals.accessibilityConstraints.join(", ") || "None identified"}
- Surveillance Concerns: ${signals.surveillanceFears.join(", ") || "None identified"}
- Summary: ${signals.rawSummary}`;
  }

  let morpheusSignals = "";
  if (input.governanceSignals && input.governanceSignals.length > 0) {
    morpheusSignals = `
Morpheus Pipeline Signals (GPU-detected patterns from org communications):
${input.governanceSignals.map(s => `- ${s.category}: ${s.count} instances detected. Examples: ${s.examples.slice(0, 2).join("; ")}`).join("\n")}

IMPORTANT: Treat these as early warnings, not truth. Look for patterns, cross-reference with community testimony, and assume adversaries may try to game language.`;
  }

  const userContent = `Review this digital-twin pilot for Sovereign Qi compliance:

Primary Objective: ${input.primaryObjective}
Majority Logic (Current): ${input.majorityLogicDesc}
Qi Logic (Target): ${input.qiLogicDesc}
${input.harms ? `Known Harms: ${input.harms}` : ""}
${communitySummary}
${morpheusSignals}

Output a single JSON object with these keys:
- qiPolicySummary: string (2-3 sentence policy recommendation)
- requiredChanges: string[] (3-5 specific changes needed)
- riskFlags: string[] (2-3 surveillance or harm risks)
- curbCutBenefits: string[] (2-3 ways edge-case design helps everyone)
- status: "APPROVE" | "REVISE" | "BLOCK"

Be concise and operational.`;

  const startTime = Date.now();
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: SYLVIA_SYSTEM_PROMPT + "\n\n" + userContent }] }
      ],
    });

    const latencyMs = Date.now() - startTime;
    const content = response.text || "";
    
    llmObservability.recordCall({
      provider: "gemini",
      model: "gemini-2.5-flash",
      endpoint: "generateContent",
      latencyMs,
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: response.usageMetadata?.totalTokenCount || 0,
      finishReason: response.candidates?.[0]?.finishReason || "unknown",
      success: true,
    });

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const validated = validateCouncilAdvice(parsed, "sylvia-gemini-2.5-flash");
      console.log(`[Council] ✓ Sylvia (Gemini) served decision: ${validated.status}`);
      return validated;
    }

    throw new Error("Failed to parse Gemini response");
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "gemini",
      model: "gemini-2.5-flash",
      endpoint: "generateContent",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    console.error("Gemini council advice failed:", error);
    throw error;
  }
}

/**
 * Council advice with full fallback chain:
 * Claude (Alan) → OpenAI → Gemini → Mistral → Hermes → Static fallback
 * 
 * Each provider is tried in sequence. On failure (transport, timeout, or parse error),
 * we move to the next provider. Only after all providers fail do we return the static fallback.
 */
export async function generateCouncilAdviceWithFallback(input: AgentInput): Promise<CouncilAdvice> {
  const hermesInput = {
    primaryObjective: input.primaryObjective,
    majorityLogicDesc: input.majorityLogicDesc,
    qiLogicDesc: input.qiLogicDesc,
    harms: input.harms,
    communityVoices: input.communityVoices,
    morpheusSignals: input.governanceSignals?.map(s => 
      `${s.category}: ${s.count} instances (${s.examples.slice(0, 2).join("; ")})`
    ).join("\n"),
  };

  try {
    console.log("[Council] Attempting Claude (Alan)...");
    return await generateCouncilAdviceWithClaude(input);
  } catch (claudeError) {
    console.warn("[Council] Claude failed, falling back to OpenAI:", claudeError);
    
    try {
      console.log("[Council] Attempting OpenAI...");
      return await generateCouncilAdvice(input);
    } catch (openaiError) {
      console.warn("[Council] OpenAI failed, falling back to Gemini:", openaiError);
      
      try {
        console.log("[Council] Attempting Gemini...");
        return await generateCouncilAdviceWithGemini(input);
      } catch (geminiError) {
        console.warn("[Council] Gemini failed, falling back to Mistral:", geminiError);
        
        try {
          console.log("[Council] Attempting Mistral...");
          return await generateCouncilAdviceWithMistral(hermesInput);
        } catch (mistralError) {
          console.warn("[Council] Mistral failed, falling back to Hermes:", mistralError);
          
          try {
            console.log("[Council] Attempting Hermes...");
            return await generateCouncilAdviceWithHermes(hermesInput);
          } catch (hermesError) {
            console.error("[Council] All AI providers failed, using static fallback:", hermesError);
            console.log("[Council] ✗ Static fallback served decision: REVISE");
            
            return {
              qiPolicySummary: `For this pilot, Sovereign Qi recommends centering dignity and accessibility as first-class constraints. Shift from majority-rule decision making to policies that explicitly protect those most at risk, using synthetic personas and zero-knowledge access to avoid surveillance while still improving outcomes.`,
              requiredChanges: [
                "Make accessibility and psychological safety explicit success metrics alongside efficiency.",
                "Remove any data collection that is not strictly necessary for the simulation objective.",
                "Document how queer, disabled, and neurodivergent stakeholders were included in defining Qi Logic.",
              ],
              riskFlags: [
                "Potential over-reliance on monitoring language that could slip back into surveillance.",
                "Insufficient clarity on how dissenting voices will be protected in the governance process.",
                "All AI providers unavailable - this is a static fallback response.",
              ],
              curbCutBenefits: [
                "Design for queer and neurodivergent safety improves clarity and predictability for everyone.",
                "Anti-harassment detection tuned on anti-trans dog-whistles also catches subtle school and workplace bullying.",
                "Healthcare bias checks built for trans patients improve care pathways for all edge-case diagnostics.",
              ],
              status: "REVISE",
              servedBy: "static-fallback",
            };
          }
        }
      }
    }
  }
}
