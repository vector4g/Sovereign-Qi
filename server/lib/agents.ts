import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { summariseCommunityVoices } from "./communitySignals";
import { llmObservability } from "./observability";

export interface CouncilAdvice {
  qiPolicySummary: string;
  requiredChanges: string[];
  riskFlags: string[];
  curbCutBenefits: string[];
  status: "APPROVE" | "REVISE" | "BLOCK";
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

const COUNCIL_SYSTEM_PROMPT = `You are Alan, speaking on behalf of the Sovereign Qi Council. You review digital-twin pilots to ensure they are accessibility-first, queer-led, and compliant with data minimisation and purpose limitation. You must not recommend anything that creates surveillance.

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
        return {
          qiPolicySummary: parsed.qiPolicySummary || "",
          requiredChanges: parsed.requiredChanges || [],
          riskFlags: parsed.riskFlags || [],
          curbCutBenefits: parsed.curbCutBenefits || [],
          status: parsed.status || "REVISE",
        };
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
        return {
          qiPolicySummary: parsed.qiPolicySummary || "",
          requiredChanges: parsed.requiredChanges || [],
          riskFlags: parsed.riskFlags || [],
          curbCutBenefits: parsed.curbCutBenefits || [],
          status: parsed.status || "REVISE",
        };
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

export async function generateCouncilAdviceWithFallback(input: AgentInput): Promise<CouncilAdvice> {
  try {
    return await generateCouncilAdviceWithClaude(input);
  } catch (claudeError) {
    console.warn("Claude failed, falling back to OpenAI:", claudeError);
    try {
      return await generateCouncilAdvice(input);
    } catch (openaiError) {
      console.error("Both AI providers failed:", openaiError);
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
        ],
        curbCutBenefits: [
          "Design for queer and neurodivergent safety improves clarity and predictability for everyone.",
          "Anti-harassment detection tuned on anti-trans dog-whistles also catches subtle school and workplace bullying.",
          "Healthcare bias checks built for trans patients improve care pathways for all edge-case diagnostics.",
        ],
        status: "REVISE",
      };
    }
  }
}
