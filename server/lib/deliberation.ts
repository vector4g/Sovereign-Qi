/**
 * Multi-Agent Deliberation System for Sovereign Qi Council
 * 
 * 8-Agent Architecture Named After Liberation Pioneers:
 * 
 * CULTURAL SPECIALIST (VETO POWER):
 * - Alan (Turing): Cultural Codebreaker with VETO authority
 * 
 * ADVISORY AGENTS (Context providers, non-voting):
 * - Hume: Emotional intelligence from testimony
 * - Cohere: Policy RAG for current context
 * 
 * VOTING AGENTS (Named after liberation figures):
 * - Lynn (Conway): Technical Architecture - Trans pioneer in chip design
 * - Bayard (Rustin): Strategic Coordination - Gay civil rights architect
 * - Sylvia (Rivera): Street-Level Harm Detection - Trans Latina activist
 * - Elizebeth (Friedman): Signal Intelligence - First female cryptanalyst
 * - Claudette (Colvin): Erasure Detection - Teen who refused to give up her seat
 * - Audre (Lorde): Intersectional Analysis - Black lesbian feminist poet
 * 
 * EDGE CASE SPECIALIST:
 * - Temple (Grandin): Alternative Perspective - Autistic scientist
 * 
 * Deliberation Flow:
 * 1. Advisory Phase: Hume + Cohere provide context
 * 2. Voting Phase: Alan + 6 voting agents deliberate in parallel
 * 3. Cross-Review Phase: Agents review each other's votes
 * 4. Veto Review: Alan reviews all votes, can escalate to BLOCK
 * 5. Consensus Synthesis: Merge insights, Alan's BLOCK overrides all
 */

import { z } from "zod";
import type { CouncilAdvice, AgentInput, GovernanceSignalSummary } from "./agents";
import { generateCouncilAdviceWithClaude, generateCouncilAdvice, generateCouncilAdviceWithGemini } from "./agents";
import { generateCouncilAdviceWithMistral } from "./mistral";
import { generateCouncilAdviceWithHermes } from "./hermes";
import { generateCouncilAdviceWithLlama } from "./llama";
import { generateAlanAdvice, alanVetoReview, type AlanVote } from "./alan";
import { analyzeTestimonyEmotions, type TestimonyEmotionalAnalysis } from "./hume";
import { rerankGovernanceSignals, analyzeWithCohere, type RerankResult } from "./cohere";
import { llmObservability } from "./observability";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// Agent names honor liberation pioneers - see AGENT_REGISTRY for full descriptions
export type AgentName = "alan" | "lynn" | "bayard" | "sylvia" | "elizebeth" | "claudette" | "audre";
export type AdvisoryAgentName = "hume" | "cohere";

export type AgentRole = "cultural_specialist" | "voting" | "advisory";

export interface AgentMetadata {
  name: AgentName | AdvisoryAgentName;
  role: AgentRole;
  hasVetoPower: boolean;
  description: string;
}

// Agent registry mapping liberation pioneers to their specialized roles
export const AGENT_REGISTRY: Record<AgentName | AdvisoryAgentName, AgentMetadata> = {
  // Cultural Specialist with VETO power
  alan: { 
    name: "alan", 
    role: "cultural_specialist", 
    hasVetoPower: true, 
    description: "Alan Turing - Cultural Codebreaker who decrypted Nazi codes and was persecuted for being gay. Decodes threats against vulnerable communities." 
  },
  // Voting agents named after liberation figures
  lynn: { 
    name: "lynn", 
    role: "voting", 
    hasVetoPower: false, 
    description: "Lynn Conway - Trans computer scientist fired by IBM in 1968, became legendary VLSI innovator. Analyzes technical architecture and system design." 
  },
  bayard: { 
    name: "bayard", 
    role: "voting", 
    hasVetoPower: false, 
    description: "Bayard Rustin - Gay civil rights organizer, architect of 1963 March on Washington, often erased from history. Strategic coordination and coalition building." 
  },
  sylvia: { 
    name: "sylvia", 
    role: "voting", 
    hasVetoPower: false, 
    description: "Sylvia Rivera - Trans Latina activist at Stonewall, co-founded STAR. Street-level harm detection and youth protection." 
  },
  elizebeth: { 
    name: "elizebeth", 
    role: "voting", 
    hasVetoPower: false, 
    description: "Elizebeth Friedman - America's first female cryptanalyst, overshadowed by her husband. Signal intelligence and pattern recognition." 
  },
  claudette: { 
    name: "claudette", 
    role: "voting", 
    hasVetoPower: false, 
    description: "Claudette Colvin - 15-year-old who refused her bus seat before Rosa Parks but was deemed 'not the right image'. Erasure detection and voice amplification." 
  },
  audre: { 
    name: "audre", 
    role: "voting", 
    hasVetoPower: false, 
    description: "Audre Lorde - Black lesbian feminist poet, wrote 'the master's tools will never dismantle the master's house'. Intersectional critical analysis." 
  },
  // Advisory agents
  hume: { 
    name: "hume", 
    role: "advisory", 
    hasVetoPower: false, 
    description: "Hume AI - Emotional intelligence analysis for community testimony" 
  },
  cohere: { 
    name: "cohere", 
    role: "advisory", 
    hasVetoPower: false, 
    description: "Cohere - Policy RAG for current context retrieval" 
  },
};

export interface AgentVote {
  agent: AgentName;
  advice: CouncilAdvice | null;
  error?: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface AdvisoryContext {
  emotional?: TestimonyEmotionalAnalysis;
  policyReferences?: RerankResult[];
  policyAnalysis?: string;
}

export interface DeliberationRound {
  round: number;
  votes: AgentVote[];
  timestamp: Date;
}

export interface DeliberationChallenge {
  challenger: AgentName;
  target: AgentName;
  type: "affirm" | "challenge" | "nuance";
  content: string;
}

export interface ConsensusResult {
  finalAdvice: CouncilAdvice;
  rounds: DeliberationRound[];
  challenges: DeliberationChallenge[];
  participatingAgents: AgentName[];
  failedAgents: AgentName[];
  consensusLevel: "unanimous" | "majority" | "plurality" | "single" | "veto";
  statusVotes: Record<"APPROVE" | "REVISE" | "BLOCK", AgentName[]>;
  totalLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  vetoTriggered: boolean;
  vetoReason?: string;
  advisoryContext: AdvisoryContext;
  codedThreatsDetected: string[];
}

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const DELIBERATION_SYSTEM_PROMPT = `You are participating in a multi-agent council deliberation for Sovereign Qi.

You have received the initial votes from all council agents. Your task is to:
1. AFFIRM points you agree with from other agents
2. CHALLENGE concerns you disagree with, explaining why
3. ADD NUANCE to points that others missed or oversimplified

Focus on protecting vulnerable communities (queer, disabled, neurodivergent, trauma survivors).
Be concise and operational. Output valid JSON.`;

/**
 * Phase 1: Gather Advisory Context
 * Hume provides emotional analysis, Cohere provides policy RAG
 */
async function gatherAdvisoryContext(input: AgentInput): Promise<AdvisoryContext> {
  const context: AdvisoryContext = {};

  const advisoryPromises: Promise<void>[] = [];

  if (input.communityVoices) {
    advisoryPromises.push(
      analyzeTestimonyEmotions(input.communityVoices)
        .then(result => { context.emotional = result; })
        .catch(err => console.warn("[Advisory] Hume analysis failed:", err.message))
    );
  }

  if (input.governanceSignals && input.governanceSignals.length > 0) {
    const signalTexts = input.governanceSignals.map(s => 
      `${s.category}: ${s.examples.join("; ")}`
    );
    const harmQuery = `Identify patterns that harm queer, disabled, neurodivergent, or trauma survivor communities: ${input.primaryObjective}`;
    
    advisoryPromises.push(
      rerankGovernanceSignals(harmQuery, signalTexts, 5)
        .then(result => { context.policyReferences = result; })
        .catch(err => console.warn("[Advisory] Cohere rerank failed:", err.message))
    );
  }

  if (process.env.COHERE_API_KEY) {
    const policyPrompt = `Summarize relevant policy precedents for: ${input.primaryObjective}. Focus on dignity-first governance, accessibility mandates, and anti-discrimination protections.`;
    advisoryPromises.push(
      analyzeWithCohere(
        "You are a policy research assistant focused on dignity-first governance.",
        policyPrompt
      )
        .then(result => { context.policyAnalysis = result; })
        .catch(err => console.warn("[Advisory] Cohere analysis failed:", err.message))
    );
  }

  await Promise.allSettled(advisoryPromises);

  console.log("[Advisory] Context gathered:", {
    emotional: context.emotional?.distressLevel || "not analyzed",
    policyRefs: context.policyReferences?.length || 0,
    policyAnalysis: context.policyAnalysis ? "present" : "absent",
  });

  return context;
}

function formatAdvisoryContext(context: AdvisoryContext): string {
  const parts: string[] = [];

  if (context.emotional) {
    parts.push(`EMOTIONAL ANALYSIS (Hume): Dominant emotion: ${context.emotional.dominantEmotion}, Distress level: ${context.emotional.distressLevel}, Urgency: ${(context.emotional.urgencyScore * 100).toFixed(0)}%`);
  }

  if (context.policyReferences && context.policyReferences.length > 0) {
    parts.push(`RELEVANT SIGNALS (Cohere RAG): ${context.policyReferences.map(r => r.document.slice(0, 100)).join(" | ")}`);
  }

  if (context.policyAnalysis) {
    parts.push(`POLICY CONTEXT: ${context.policyAnalysis.slice(0, 300)}`);
  }

  return parts.join("\n\n");
}

async function callVotingAgent(
  agent: AgentName,
  input: AgentInput,
  advisoryContext: string
): Promise<AgentVote> {
  const startTime = Date.now();
  
  try {
    let advice: CouncilAdvice;
    
    const augmentedInput = {
      ...input,
      morpheusSignals: input.governanceSignals?.map(s => 
        `${s.category}: ${s.count} instances (${s.examples.slice(0, 2).join("; ")})`
      ).join("\n"),
    };

    const hermesInput = {
      primaryObjective: input.primaryObjective,
      majorityLogicDesc: input.majorityLogicDesc,
      qiLogicDesc: input.qiLogicDesc,
      harms: input.harms,
      communityVoices: input.communityVoices,
      morpheusSignals: augmentedInput.morpheusSignals,
      advisoryContext,
    };
    
    // Agent names honor liberation pioneers, each calling their respective AI provider
    switch (agent) {
      case "alan":
        throw new Error("Alan uses dedicated handler with veto logic");
      case "lynn": // Lynn Conway - Technical Architecture (Anthropic Claude)
        advice = await generateCouncilAdviceWithClaude(input);
        break;
      case "bayard": // Bayard Rustin - Strategic Coordination (OpenAI)
        advice = await generateCouncilAdvice(input);
        break;
      case "sylvia": // Sylvia Rivera - Street-Level Harm Detection (Gemini)
        advice = await generateCouncilAdviceWithGemini(input);
        break;
      case "elizebeth": // Elizebeth Friedman - Signal Intelligence (Mistral)
        advice = await generateCouncilAdviceWithMistral(hermesInput);
        break;
      case "claudette": // Claudette Colvin - Erasure Detection (Llama)
        advice = await generateCouncilAdviceWithLlama(hermesInput);
        break;
      case "audre": // Audre Lorde - Intersectional Analysis (Hermes)
        advice = await generateCouncilAdviceWithHermes(hermesInput);
        break;
      default:
        throw new Error(`Unknown voting agent: ${agent}`);
    }
    
    return {
      agent,
      advice,
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
    };
  } catch (error: any) {
    return {
      agent,
      advice: null,
      error: error.message || String(error),
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
    };
  }
}

function formatVotesForDeliberation(votes: AgentVote[], alanVote?: AlanVote): string {
  const allVotes = [...votes];
  
  if (alanVote) {
    allVotes.unshift({
      agent: "alan" as AgentName,
      advice: alanVote.advice,
      latencyMs: alanVote.latencyMs,
      inputTokens: 0,
      outputTokens: 0,
    });
  }

  return allVotes
    .filter(v => v.advice)
    .map(v => {
      const isAlan = v.agent === "alan";
      const vetoMarker = isAlan && alanVote?.vetoTriggered ? " [VETO AUTHORITY]" : "";
      return `
=== ${v.agent.toUpperCase()}${vetoMarker} ===
Status: ${v.advice!.status}
Summary: ${v.advice!.qiPolicySummary}
Required Changes: ${v.advice!.requiredChanges.join("; ")}
Risk Flags: ${v.advice!.riskFlags.join("; ")}
${isAlan && alanVote?.codedThreatsDetected.length ? `Coded Threats: ${alanVote.codedThreatsDetected.join("; ")}` : ""}
`;
    })
    .join("\n");
}

async function runSecondRoundWithAgent(
  agentName: "lynn" | "bayard" | "sylvia",
  input: AgentInput,
  allVotes: AgentVote[],
  alanVote?: AlanVote
): Promise<DeliberationChallenge[]> {
  const votesContext = formatVotesForDeliberation(allVotes, alanVote);
  
  // Map liberation pioneer names to their AI provider identities for the prompt
  const agentIdentities: Record<string, string> = {
    lynn: "Lynn Conway (trans pioneer) via Claude",
    bayard: "Bayard Rustin (civil rights architect) via GPT-4o",
    sylvia: "Sylvia Rivera (trans Latina activist) via Gemini",
  };
  
  const prompt = `You are ${agentIdentities[agentName]}, reviewing all council agents' votes.

ORIGINAL PILOT:
Primary Objective: ${input.primaryObjective}
Majority Logic: ${input.majorityLogicDesc}
Qi Logic: ${input.qiLogicDesc}

ALL AGENT VOTES (including Alan the Cultural Codebreaker with VETO power):
${votesContext}

Respond with a JSON array of your deliberation points:
[
  {"target": "agent_name", "type": "affirm|challenge|nuance", "content": "your point"}
]

Be concise. Focus on substantive disagreements or additions.`;

  try {
    let content: string | undefined;

    if (agentName === "lynn" && process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 512,
        system: DELIBERATION_SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      });
      const firstContent = response.content[0];
      if (firstContent.type === "text") {
        content = firstContent.text;
      }
    } else if (agentName === "bayard" && process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: DELIBERATION_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 512,
      });
      content = response.choices[0]?.message?.content || undefined;
    } else if (agentName === "sylvia" && process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: `${DELIBERATION_SYSTEM_PROMPT}\n\n${prompt}` }] }],
      });
      content = response.text || undefined;
    }

    if (content) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{target: string; type: string; content: string}>;
        return parsed.map(p => ({
          challenger: agentName as AgentName,
          target: p.target as AgentName,
          type: p.type as "affirm" | "challenge" | "nuance",
          content: p.content,
        }));
      }
    }
  } catch (error) {
    console.warn(`[Deliberation] ${agentName} second round failed:`, error);
  }
  
  return [];
}

function synthesizeConsensus(
  votes: AgentVote[],
  alanVote: AlanVote,
  challenges: DeliberationChallenge[],
  advisoryContext: AdvisoryContext
): CouncilAdvice {
  if (alanVote.vetoTriggered) {
    console.log("[Consensus] VETO TRIGGERED by Alan - overriding all other votes");
    return {
      ...alanVote.advice,
      qiPolicySummary: `VETO (Alan): ${alanVote.vetoReason || alanVote.advice.qiPolicySummary}`,
      status: "BLOCK",
      servedBy: "deliberation:alan-veto",
    };
  }

  const allVotes = [
    { agent: "alan" as AgentName, advice: alanVote.advice, latencyMs: alanVote.latencyMs, inputTokens: 0, outputTokens: 0 },
    ...votes.filter(v => v.advice !== null),
  ];
  
  if (allVotes.length === 0) {
    return {
      qiPolicySummary: "Council deliberation failed - no agents responded successfully.",
      requiredChanges: ["Retry with available AI services"],
      riskFlags: ["All council agents unavailable"],
      curbCutBenefits: [],
      status: "REVISE",
      servedBy: "deliberation-failed",
    };
  }

  const allSummaries = allVotes.map(v => `[${v.agent}] ${v.advice!.qiPolicySummary}`);
  const allChanges = new Set<string>();
  const allRiskFlags = new Set<string>();
  const allBenefits = new Set<string>();
  const statusVotes: Record<string, number> = { APPROVE: 0, REVISE: 0, BLOCK: 0 };

  for (const vote of allVotes) {
    if (vote.advice) {
      statusVotes[vote.advice.status]++;
      vote.advice.requiredChanges.forEach(c => allChanges.add(c));
      vote.advice.riskFlags.forEach(r => allRiskFlags.add(r));
      vote.advice.curbCutBenefits.forEach(b => allBenefits.add(b));
    }
  }

  alanVote.codedThreatsDetected.forEach(threat => allRiskFlags.add(`[Alan] ${threat}`));

  for (const challenge of challenges) {
    if (challenge.type === "nuance") {
      allChanges.add(`[${challenge.challenger} adds] ${challenge.content}`);
    }
  }

  if (advisoryContext.emotional && advisoryContext.emotional.distressLevel === "critical") {
    allRiskFlags.add(`[Hume] Critical emotional distress detected in community testimony`);
  }

  let finalStatus: "APPROVE" | "REVISE" | "BLOCK";
  if (statusVotes.BLOCK > 0) {
    finalStatus = "BLOCK";
  } else if (statusVotes.REVISE > 0) {
    finalStatus = "REVISE";
  } else {
    finalStatus = "APPROVE";
  }

  const combinedSummary = `COUNCIL DELIBERATION (${allVotes.length} agents): ` + 
    allVotes.slice(0, 4).map(v => v.advice!.qiPolicySummary.slice(0, 150)).join(" | ");

  const participatingAgents = allVotes.map(v => v.agent).join(", ");

  return {
    qiPolicySummary: combinedSummary.slice(0, 1200),
    requiredChanges: Array.from(allChanges).slice(0, 12),
    riskFlags: Array.from(allRiskFlags).slice(0, 10),
    curbCutBenefits: Array.from(allBenefits).slice(0, 8),
    status: finalStatus,
    servedBy: `deliberation:${participatingAgents}`,
  };
}

/**
 * Run full 7-agent multi-agent deliberation
 * 
 * Phase 1: Advisory agents (Hume, Cohere) provide context
 * Phase 2: All 6 voting agents + Alan vote in parallel with advisory context
 * Phase 3: Cross-review phase for Claude, OpenAI, Gemini
 * Phase 4: Alan veto review
 * Phase 5: Consensus synthesis (Alan's BLOCK overrides all)
 */
export async function runMultiAgentDeliberation(
  input: AgentInput
): Promise<ConsensusResult> {
  const startTime = Date.now();
  // 6 voting agents named after liberation pioneers
  const votingAgents: AgentName[] = ["lynn", "bayard", "sylvia", "elizebeth", "claudette", "audre"];

  console.log("[Deliberation] Starting 8-agent deliberation (Alan + 6 voting + 2 advisory)...");

  console.log("[Deliberation] Phase 1: Gathering advisory context (Hume, Cohere)...");
  const advisoryContext = await gatherAdvisoryContext(input);
  const advisoryContextStr = formatAdvisoryContext(advisoryContext);

  console.log("[Deliberation] Phase 2: Parallel voting (Alan + 6 liberation pioneers)...");
  
  const alanInput = {
    primaryObjective: input.primaryObjective,
    majorityLogicDesc: input.majorityLogicDesc,
    qiLogicDesc: input.qiLogicDesc,
    harms: input.harms,
    communityVoices: input.communityVoices,
    morpheusSignals: input.governanceSignals?.map(s => 
      `${s.category}: ${s.count} instances (${s.examples.slice(0, 2).join("; ")})`
    ).join("\n"),
    emotionalContext: advisoryContext.emotional 
      ? `Distress: ${advisoryContext.emotional.distressLevel}, Dominant emotion: ${advisoryContext.emotional.dominantEmotion}`
      : undefined,
    policyContext: advisoryContext.policyAnalysis?.slice(0, 500),
  };

  const [alanResult, ...votingResults] = await Promise.allSettled([
    generateAlanAdvice(alanInput),
    ...votingAgents.map(agent => callVotingAgent(agent, input, advisoryContextStr)),
  ]);

  let alanVote: AlanVote;
  if (alanResult.status === "fulfilled") {
    alanVote = alanResult.value;
  } else {
    console.error("[Deliberation] Alan failed:", alanResult.reason);
    alanVote = {
      advice: {
        qiPolicySummary: "Alan (Cultural Codebreaker) unavailable - proceeding without veto authority",
        requiredChanges: ["Configure LAMBDA_API_KEY or NOUS_API_KEY for full cultural analysis"],
        riskFlags: ["Cultural analysis unavailable"],
        curbCutBenefits: [],
        status: "REVISE",
        servedBy: "alan-failed",
      },
      vetoTriggered: false,
      codedThreatsDetected: [],
      latencyMs: 0,
    };
  }

  const round1Votes: AgentVote[] = votingResults.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      agent: votingAgents[index],
      advice: null,
      error: result.reason?.message || "Unknown error",
      latencyMs: 0,
      inputTokens: 0,
      outputTokens: 0,
    };
  });

  const successfulVotes = round1Votes.filter(v => v.advice !== null);
  const failedAgents = round1Votes.filter(v => v.advice === null).map(v => v.agent);

  console.log(`[Deliberation] Phase 2 complete: Alan + ${successfulVotes.length}/${votingAgents.length} voting agents responded`);
  console.log(`  - Alan: ${alanVote.advice.status}${alanVote.vetoTriggered ? " (VETO)" : ""}`);
  successfulVotes.forEach(v => {
    console.log(`  - ${v.agent}: ${v.advice!.status} (${v.latencyMs}ms)`);
  });

  const round1: DeliberationRound = {
    round: 1,
    votes: round1Votes,
    timestamp: new Date(),
  };

  let allChallenges: DeliberationChallenge[] = [];

  if (!alanVote.vetoTriggered && successfulVotes.length >= 2) {
    console.log("[Deliberation] Phase 3: Cross-agent review...");
    
    const round2Results = await Promise.allSettled([
      runSecondRoundWithAgent("lynn", input, round1Votes, alanVote),
      runSecondRoundWithAgent("bayard", input, round1Votes, alanVote),
      runSecondRoundWithAgent("sylvia", input, round1Votes, alanVote),
    ]);
    
    for (const result of round2Results) {
      if (result.status === "fulfilled") {
        allChallenges.push(...result.value);
      }
    }

    console.log(`[Deliberation] Phase 3 complete: ${allChallenges.length} deliberation points`);
  }

  if (!alanVote.vetoTriggered && successfulVotes.length > 0) {
    console.log("[Deliberation] Phase 4: Alan veto review...");
    const allVoteSummaries = [
      { agent: "alan", status: alanVote.advice.status, summary: alanVote.advice.qiPolicySummary },
      ...successfulVotes.map(v => ({ agent: v.agent, status: v.advice!.status, summary: v.advice!.qiPolicySummary })),
    ];
    alanVote = await alanVetoReview(alanVote, allVoteSummaries, { primaryObjective: input.primaryObjective });
  }

  console.log("[Deliberation] Phase 5: Consensus synthesis...");
  const finalAdvice = synthesizeConsensus(round1Votes, alanVote, allChallenges, advisoryContext);

  const statusVotes: Record<"APPROVE" | "REVISE" | "BLOCK", AgentName[]> = {
    APPROVE: [],
    REVISE: [],
    BLOCK: [],
  };
  
  statusVotes[alanVote.advice.status].push("alan");
  for (const vote of successfulVotes) {
    statusVotes[vote.advice!.status].push(vote.agent);
  }

  let consensusLevel: "unanimous" | "majority" | "plurality" | "single" | "veto";
  if (alanVote.vetoTriggered) {
    consensusLevel = "veto";
  } else if (successfulVotes.length === 0) {
    consensusLevel = "single";
  } else {
    const allAgentVotes = [alanVote.advice, ...successfulVotes.map(v => v.advice!)];
    if (allAgentVotes.every(a => a.status === finalAdvice.status)) {
      consensusLevel = "unanimous";
    } else if (statusVotes[finalAdvice.status].length > (allAgentVotes.length / 2)) {
      consensusLevel = "majority";
    } else {
      consensusLevel = "plurality";
    }
  }

  const totalLatencyMs = Date.now() - startTime;
  const totalInputTokens = round1Votes.reduce((sum, v) => sum + v.inputTokens, 0);
  const totalOutputTokens = round1Votes.reduce((sum, v) => sum + v.outputTokens, 0);

  const participatingAgents: AgentName[] = ["alan", ...successfulVotes.map(v => v.agent)];

  llmObservability.recordDeliberation({
    participatingAgents,
    failedAgents,
    consensusLevel,
    finalStatus: finalAdvice.status,
    statusVotes,
    totalLatencyMs,
    totalInputTokens,
    totalOutputTokens,
    challengeCount: allChallenges.length,
    affirmCount: allChallenges.filter(c => c.type === "affirm").length,
    challengeTypeCount: allChallenges.filter(c => c.type === "challenge").length,
    nuanceCount: allChallenges.filter(c => c.type === "nuance").length,
  });

  console.log(`[Deliberation] Final decision: ${finalAdvice.status} (${consensusLevel} consensus)`);
  if (alanVote.vetoTriggered) {
    console.log(`[Deliberation] VETO by Alan: ${alanVote.vetoReason}`);
  }
  console.log(`[Deliberation] Total time: ${totalLatencyMs}ms`);

  return {
    finalAdvice,
    rounds: [round1],
    challenges: allChallenges,
    participatingAgents,
    failedAgents,
    consensusLevel,
    statusVotes,
    totalLatencyMs,
    totalInputTokens,
    totalOutputTokens,
    vetoTriggered: alanVote.vetoTriggered,
    vetoReason: alanVote.vetoReason,
    advisoryContext,
    codedThreatsDetected: alanVote.codedThreatsDetected,
  };
}

/**
 * Quick deliberation with Alan + top 3 voting agents + advisory
 */
export async function runQuickDeliberation(
  input: AgentInput
): Promise<ConsensusResult> {
  const startTime = Date.now();
  // Quick mode uses 3 core liberation pioneers: Lynn, Bayard, Sylvia
  const votingAgents: AgentName[] = ["lynn", "bayard", "sylvia"];

  console.log("[Deliberation] Starting quick deliberation (Alan + Lynn + Bayard + Sylvia + advisory)...");

  const advisoryContext = await gatherAdvisoryContext(input);
  const advisoryContextStr = formatAdvisoryContext(advisoryContext);

  const alanInput = {
    primaryObjective: input.primaryObjective,
    majorityLogicDesc: input.majorityLogicDesc,
    qiLogicDesc: input.qiLogicDesc,
    harms: input.harms,
    communityVoices: input.communityVoices,
    morpheusSignals: input.governanceSignals?.map(s => 
      `${s.category}: ${s.count} instances`
    ).join("\n"),
    emotionalContext: advisoryContext.emotional 
      ? `Distress: ${advisoryContext.emotional.distressLevel}`
      : undefined,
    policyContext: advisoryContext.policyAnalysis?.slice(0, 300),
  };

  const [alanResult, ...votingResults] = await Promise.allSettled([
    generateAlanAdvice(alanInput),
    ...votingAgents.map(agent => callVotingAgent(agent, input, advisoryContextStr)),
  ]);

  let alanVote: AlanVote;
  if (alanResult.status === "fulfilled") {
    alanVote = alanResult.value;
  } else {
    alanVote = {
      advice: {
        qiPolicySummary: "Alan unavailable",
        requiredChanges: [],
        riskFlags: [],
        curbCutBenefits: [],
        status: "REVISE",
        servedBy: "alan-failed",
      },
      vetoTriggered: false,
      codedThreatsDetected: [],
      latencyMs: 0,
    };
  }

  const votes: AgentVote[] = votingResults.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      agent: votingAgents[index],
      advice: null,
      error: result.reason?.message || "Unknown error",
      latencyMs: 0,
      inputTokens: 0,
      outputTokens: 0,
    };
  });

  const successfulVotes = votes.filter(v => v.advice !== null);
  const finalAdvice = synthesizeConsensus(votes, alanVote, [], advisoryContext);

  const statusVotes: Record<"APPROVE" | "REVISE" | "BLOCK", AgentName[]> = {
    APPROVE: [],
    REVISE: [],
    BLOCK: [],
  };
  
  statusVotes[alanVote.advice.status].push("alan");
  for (const vote of successfulVotes) {
    statusVotes[vote.advice!.status].push(vote.agent);
  }

  let consensusLevel: "unanimous" | "majority" | "plurality" | "single" | "veto";
  if (alanVote.vetoTriggered) {
    consensusLevel = "veto";
  } else if (successfulVotes.length === 0) {
    consensusLevel = "single";
  } else {
    consensusLevel = "majority";
  }

  const totalLatencyMs = Date.now() - startTime;
  const participatingAgents: AgentName[] = ["alan", ...successfulVotes.map(v => v.agent)];

  return {
    finalAdvice,
    rounds: [{ round: 1, votes, timestamp: new Date() }],
    challenges: [],
    participatingAgents,
    failedAgents: votes.filter(v => v.advice === null).map(v => v.agent),
    consensusLevel,
    statusVotes,
    totalLatencyMs,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    vetoTriggered: alanVote.vetoTriggered,
    vetoReason: alanVote.vetoReason,
    advisoryContext,
    codedThreatsDetected: alanVote.codedThreatsDetected,
  };
}
