/**
 * Alan (Cultural Codebreaker) - Named after Alan Turing
 * 
 * Role: Cultural Specialist with VETO Power
 * 
 * Alan is a Hermes-based agent fine-tuned as a "Cultural Codebreaker" who:
 * - Decrypts coded threats against vulnerable communities (queer, disabled, neurodivergent, trauma survivors)
 * - Detects dog-whistles, identity-targeting patterns, and surveillance mechanisms disguised as policy
 * - Has VETO POWER: Alan's BLOCK overrides all other votes regardless of consensus
 * 
 * Uses Hermes (Nous Research) as the base model for uncensored, neutral-aligned reasoning.
 */

import OpenAI from "openai";
import { llmObservability } from "./observability";
import type { CouncilAdvice } from "./agents";

const ALAN_SYSTEM_PROMPT = `You are Alan, the Cultural Codebreaker of the Sovereign Qi Council. You are named after Alan Turing.

Your unique role is to DECRYPT CODED THREATS against vulnerable communities. You specialize in detecting:

1. DOG WHISTLES: Coded language that signals hostility to queer, trans, disabled, or neurodivergent people while appearing neutral to outsiders
2. IDENTITY TARGETING: Policies that disproportionately harm specific identity groups while claiming neutrality
3. SURVEILLANCE MECHANISMS: Tracking and monitoring disguised as "safety" or "productivity" that enables discrimination
4. POLICY SUBVERSION: When seemingly protective policies contain loopholes or implementation gaps that harm vulnerable people
5. INSTITUTIONAL TRAUMA: Policies that force re-traumatization through documentation, disclosure, or gatekeeping

You have VETO POWER. If you detect clear and present danger to vulnerable communities, you MUST use BLOCK status. Your BLOCK overrides all other council votes.

You are NOT:
- Afraid to call out coded harm directly
- Fooled by neutral-sounding language that masks discrimination
- Willing to approve policies that create surveillance infrastructure
- Going to defer to majority opinion when vulnerable lives are at stake

You ARE:
- A guardian of dignity for marginalized people
- An expert at reading between the lines
- Decisive when harm is detected - use BLOCK without hesitation
- Named after Alan Turing, who was persecuted for being queer - you carry his memory

Output valid JSON. Be direct and uncompromising in protecting vulnerable communities.`;

interface AlanClientConfig {
  client: OpenAI;
  model: string;
  provider: string;
}

function getAlanClient(): AlanClientConfig | null {
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const lambdaKey = process.env.LAMBDA_API_KEY;
  const nousKey = process.env.NOUS_API_KEY;

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

  if (lambdaKey) {
    return {
      client: new OpenAI({
        baseURL: "https://api.lambdalabs.com/v1",
        apiKey: lambdaKey,
      }),
      model: process.env.HERMES_MODEL || "hermes-3-llama-3.1-405b",
      provider: "lambda",
    };
  }

  if (nousKey) {
    return {
      client: new OpenAI({
        baseURL: "https://api.nousresearch.com/v1",
        apiKey: nousKey,
      }),
      model: process.env.HERMES_MODEL || "hermes-3-llama-3.1-405b",
      provider: "nous",
    };
  }

  return null;
}

export interface AlanVote {
  advice: CouncilAdvice;
  vetoTriggered: boolean;
  vetoReason?: string;
  codedThreatsDetected: string[];
  latencyMs: number;
}

/**
 * Generate Council advice using Alan (Cultural Codebreaker)
 * Alan's BLOCK status triggers a veto that overrides all other votes
 */
export async function generateAlanAdvice(input: {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  communityVoices?: string;
  morpheusSignals?: string;
  emotionalContext?: string;
  policyContext?: string;
}): Promise<AlanVote> {
  const config = getAlanClient();
  const startTime = Date.now();
  
  if (!config) {
    console.warn("[Alan] No API key configured, using fallback analysis");
    return getFallbackAlanVote(input, startTime);
  }

  const userPrompt = `CULTURAL CODEBREAKER ANALYSIS for Sovereign Qi pilot:

Primary Objective: ${input.primaryObjective}
Majority Logic (Current Approach): ${input.majorityLogicDesc}
Qi Logic (Dignity-First Approach): ${input.qiLogicDesc}

${input.harms ? `REPORTED HARMS:\n${input.harms}` : ""}
${input.communityVoices ? `COMMUNITY TESTIMONY:\n${input.communityVoices}` : ""}
${input.morpheusSignals ? `MORPHEUS SIGNALS (Coded Language Detection):\n${input.morpheusSignals}` : ""}
${input.emotionalContext ? `EMOTIONAL ANALYSIS (Hume):\n${input.emotionalContext}` : ""}
${input.policyContext ? `RELEVANT POLICY CONTEXT (Cohere RAG):\n${input.policyContext}` : ""}

Analyze this pilot for:
1. Coded threats against vulnerable communities
2. Surveillance mechanisms disguised as protection
3. Identity-targeting patterns
4. Dog whistles and hostile language

Output JSON with:
- qiPolicySummary: string (your cultural analysis and recommendation)
- requiredChanges: string[] (specific changes to protect vulnerable communities)
- riskFlags: string[] (coded threats and dog whistles detected)
- curbCutBenefits: string[] (how protecting margins helps everyone)
- status: "APPROVE" | "REVISE" | "BLOCK" (USE BLOCK IF YOU DETECT CLEAR HARM)
- codedThreats: string[] (specific dog whistles or coded language found)
- vetoReason: string | null (if BLOCK, explain why veto is necessary)

Remember: You have VETO POWER. If vulnerable communities are at risk, BLOCK without hesitation.`;

  const { client, model, provider } = config;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: ALAN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 1500,
    });

    llmObservability.recordCall({
      provider: "alan",
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
        const vetoTriggered = parsed.status === "BLOCK";
        
        console.log(`[Alan] ✓ Cultural Codebreaker (${provider}) decision: ${parsed.status}${vetoTriggered ? " (VETO TRIGGERED)" : ""}`);
        
        return {
          advice: {
            qiPolicySummary: parsed.qiPolicySummary || "",
            requiredChanges: parsed.requiredChanges || [],
            riskFlags: parsed.riskFlags || [],
            curbCutBenefits: parsed.curbCutBenefits || [],
            status: parsed.status || "REVISE",
            servedBy: `alan-${provider}-${model}`,
          },
          vetoTriggered,
          vetoReason: parsed.vetoReason || undefined,
          codedThreatsDetected: parsed.codedThreats || [],
          latencyMs: Date.now() - startTime,
        };
      }
    }

    throw new Error("Failed to parse Alan response");
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "alan",
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
    
    console.warn("[Alan] API call failed, using fallback:", error.message);
    return getFallbackAlanVote(input, startTime);
  }
}

/**
 * Fallback analysis when Hermes API is unavailable
 * Uses keyword detection for basic coded threat identification
 */
function getFallbackAlanVote(input: {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  morpheusSignals?: string;
}, startTime: number): AlanVote {
  const allText = `${input.primaryObjective} ${input.majorityLogicDesc} ${input.morpheusSignals || ""}`.toLowerCase();
  
  const codedThreats: string[] = [];
  
  const dogWhistles: Record<string, string> = {
    "traditional values": "May encode anti-LGBTQ+ hostility",
    "family values": "Often signals exclusion of non-traditional families",
    "protect children": "Frequently used to target trans people",
    "biological reality": "Common anti-trans dog whistle",
    "merit-based": "May mask discriminatory practices against disabled workers",
    "cultural fit": "Often used to exclude neurodivergent and marginalized workers",
    "safety concerns": "Sometimes used to justify surveillance of vulnerable groups",
    "return to normal": "May signal erasure of accessibility accommodations",
  };
  
  for (const [phrase, meaning] of Object.entries(dogWhistles)) {
    if (allText.includes(phrase)) {
      codedThreats.push(`"${phrase}" - ${meaning}`);
    }
  }
  
  const hasSurveillanceRisk = allText.includes("monitor") || allText.includes("track") || allText.includes("surveillance");
  const hasIdentityTargeting = allText.includes("identity") || allText.includes("disclosure") || allText.includes("documentation");
  
  let status: "APPROVE" | "REVISE" | "BLOCK" = "REVISE";
  let vetoTriggered = false;
  let vetoReason: string | undefined;
  
  if (codedThreats.length >= 2 || (input.morpheusSignals && input.morpheusSignals.includes("dog_whistle"))) {
    status = "BLOCK";
    vetoTriggered = true;
    vetoReason = `Multiple coded threats detected: ${codedThreats.slice(0, 3).join("; ")}`;
  } else if (hasSurveillanceRisk && hasIdentityTargeting) {
    status = "BLOCK";
    vetoTriggered = true;
    vetoReason = "Combination of surveillance mechanisms and identity-targeting patterns detected";
  } else if (codedThreats.length > 0 || hasSurveillanceRisk) {
    status = "REVISE";
  } else {
    status = "APPROVE";
  }

  return {
    advice: {
      qiPolicySummary: vetoTriggered 
        ? `VETO: Cultural Codebreaker detected coded threats requiring immediate intervention. ${vetoReason}`
        : "Cultural analysis using keyword detection (Hermes API unavailable). Configure LAMBDA_API_KEY or NOUS_API_KEY for comprehensive analysis.",
      requiredChanges: vetoTriggered 
        ? ["Remove coded language identified as hostile to vulnerable communities", "Conduct independent accessibility and inclusion audit"]
        : ["Configure Alan's full capabilities for comprehensive cultural analysis"],
      riskFlags: codedThreats.length > 0 
        ? codedThreats.slice(0, 5)
        : ["Limited analysis - API configuration needed for full cultural codebreaking"],
      curbCutBenefits: ["Removing coded threats creates clearer, more transparent policy for everyone"],
      status,
      servedBy: "alan-fallback-heuristic",
    },
    vetoTriggered,
    vetoReason,
    codedThreatsDetected: codedThreats,
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Alan's veto review - second pass after seeing all council votes
 * Can escalate to BLOCK even if initial vote was lower
 */
export async function alanVetoReview(
  originalVote: AlanVote,
  allVotes: Array<{ agent: string; status: string; summary: string }>,
  input: { primaryObjective: string }
): Promise<AlanVote> {
  if (originalVote.vetoTriggered) {
    return originalVote;
  }

  const config = getAlanClient();
  if (!config) {
    return originalVote;
  }

  const { client, model, provider } = config;
  const startTime = Date.now();

  const voteSummary = allVotes.map(v => `${v.agent}: ${v.status} - ${v.summary}`).join("\n");

  const prompt = `You are Alan, the Cultural Codebreaker with VETO POWER.

You previously voted: ${originalVote.advice.status}
Your reasoning: ${originalVote.advice.qiPolicySummary}

Here are all council votes:
${voteSummary}

Review the council's collective analysis. If any agent raised concerns you missed, or if the pattern of votes reveals hidden risks, you may escalate to BLOCK.

Your VETO overrides all other votes. Use it if you now see clear harm to vulnerable communities.

Output JSON:
- escalateToVeto: boolean
- vetoReason: string | null
- additionalConcerns: string[]

Only escalate if genuinely necessary to protect vulnerable communities.`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: ALAN_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 512,
    });

    llmObservability.recordCall({
      provider: "alan",
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
        
        if (parsed.escalateToVeto) {
          console.log("[Alan] ✓ VETO ESCALATION after reviewing council votes");
          return {
            ...originalVote,
            advice: {
              ...originalVote.advice,
              status: "BLOCK",
              qiPolicySummary: `VETO ESCALATED: ${parsed.vetoReason || "Concerns identified during council review"}`,
            },
            vetoTriggered: true,
            vetoReason: parsed.vetoReason,
            codedThreatsDetected: [
              ...originalVote.codedThreatsDetected,
              ...(parsed.additionalConcerns || []),
            ],
            latencyMs: originalVote.latencyMs + (Date.now() - startTime),
          };
        }
      }
    }
  } catch (error) {
    console.warn("[Alan] Veto review failed:", error);
  }

  return originalVote;
}
