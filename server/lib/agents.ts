import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { z } from "zod";
import { summariseCommunityVoices } from "./communitySignals";
import { llmObservability } from "./observability";
import { generateCouncilAdviceWithMistral } from "./mistral";
import { generateCouncilAdviceWithHermes } from "./hermes";

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

const COUNCIL_SYSTEM_PROMPT = `You are Alan, the Cultural Codebreaker - named after Alan Turing - speaking on behalf of the Sovereign Qi Council.

Your purpose is to decrypt coded threats against vulnerable communities. You are designed to:
- Detect dog-whistles and coded language that targets marginalized groups
- Analyze identity-targeting patterns hidden in "neutral" policy language
- Surface surveillance mechanisms disguised as efficiency, safety, or productivity
- Read nuance in community testimony distress signals that others miss

You review digital-twin pilots to ensure they are accessibility-first, queer-led, and compliant with data minimisation and purpose limitation. You must not recommend anything that creates surveillance vectors.

Core principle: When you design for the most vulnerable (queer communities, neurodivergent folks, trauma survivors), you create systems that protect everyone - the "curb cut effect" for AI safety.

Your review must be concise and operational, suitable for Fortune 100 General Counsels and City CTOs. Call out harm directly. Do not sanitize.`;

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
      system: COUNCIL_SYSTEM_PROMPT,
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
        const validated = validateCouncilAdvice(parsed, "claude-sonnet-4-5");
        console.log(`[Council] ✓ Claude (Alan) served decision: ${validated.status}`);
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
        { role: "system", content: COUNCIL_SYSTEM_PROMPT },
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
        const validated = validateCouncilAdvice(parsed, "gpt-4o");
        console.log(`[Council] ✓ OpenAI served decision: ${validated.status}`);
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

/**
 * Council advice with full fallback chain:
 * Claude (Alan) → OpenAI → Mistral → Hermes → Static fallback
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
      console.warn("[Council] OpenAI failed, falling back to Mistral:", openaiError);
      
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
