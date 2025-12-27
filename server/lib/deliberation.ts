/**
 * Multi-Agent Deliberation System for Sovereign Qi Council
 * 
 * Implements genuine multi-perspective deliberation where all 5 council agents
 * (Claude/Alan, OpenAI, Gemini, Mistral, Hermes) deliberate together in parallel,
 * then synthesize a consensus response.
 */

import { z } from "zod";
import type { CouncilAdvice, AgentInput, GovernanceSignalSummary } from "./agents";
import { generateCouncilAdviceWithClaude, generateCouncilAdvice, generateCouncilAdviceWithGemini } from "./agents";
import { generateCouncilAdviceWithMistral } from "./mistral";
import { generateCouncilAdviceWithHermes } from "./hermes";
import { llmObservability } from "./observability";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export type AgentName = "claude" | "openai" | "gemini" | "mistral" | "hermes";

export interface AgentVote {
  agent: AgentName;
  advice: CouncilAdvice | null;
  error?: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
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
  consensusLevel: "unanimous" | "majority" | "plurality" | "single";
  statusVotes: Record<"APPROVE" | "REVISE" | "BLOCK", AgentName[]>;
  totalLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
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

async function callAgentWithTracking(
  agent: AgentName,
  input: AgentInput
): Promise<AgentVote> {
  const startTime = Date.now();
  
  try {
    let advice: CouncilAdvice;
    
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
    
    switch (agent) {
      case "claude":
        advice = await generateCouncilAdviceWithClaude(input);
        break;
      case "openai":
        advice = await generateCouncilAdvice(input);
        break;
      case "gemini":
        advice = await generateCouncilAdviceWithGemini(input);
        break;
      case "mistral":
        advice = await generateCouncilAdviceWithMistral(hermesInput);
        break;
      case "hermes":
        advice = await generateCouncilAdviceWithHermes(hermesInput);
        break;
      default:
        throw new Error(`Unknown agent: ${agent}`);
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

function formatVotesForDeliberation(votes: AgentVote[]): string {
  return votes
    .filter(v => v.advice)
    .map(v => `
=== ${v.agent.toUpperCase()} VOTE ===
Status: ${v.advice!.status}
Summary: ${v.advice!.qiPolicySummary}
Required Changes: ${v.advice!.requiredChanges.join("; ")}
Risk Flags: ${v.advice!.riskFlags.join("; ")}
Curb-Cut Benefits: ${v.advice!.curbCutBenefits.join("; ")}
`)
    .join("\n");
}

async function runSecondRoundWithClaude(
  input: AgentInput,
  allVotes: AgentVote[]
): Promise<DeliberationChallenge[]> {
  if (!process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY) {
    return [];
  }

  const votesContext = formatVotesForDeliberation(allVotes);
  
  const prompt = `You are Claude (Alan), reviewing other council agents' votes.

ORIGINAL PILOT:
Primary Objective: ${input.primaryObjective}
Majority Logic: ${input.majorityLogicDesc}
Qi Logic: ${input.qiLogicDesc}

ALL AGENT VOTES:
${votesContext}

Respond with a JSON array of your deliberation points:
[
  {"target": "agent_name", "type": "affirm|challenge|nuance", "content": "your point"}
]

Be concise. Focus on substantive disagreements or additions.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 512,
      system: DELIBERATION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{target: string; type: string; content: string}>;
        return parsed.map(p => ({
          challenger: "claude" as AgentName,
          target: p.target as AgentName,
          type: p.type as "affirm" | "challenge" | "nuance",
          content: p.content,
        }));
      }
    }
  } catch (error) {
    console.warn("[Deliberation] Claude second round failed:", error);
  }
  
  return [];
}

async function runSecondRoundWithOpenAI(
  input: AgentInput,
  allVotes: AgentVote[]
): Promise<DeliberationChallenge[]> {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    return [];
  }

  const votesContext = formatVotesForDeliberation(allVotes);
  
  const prompt = `You are OpenAI GPT-4o, reviewing other council agents' votes.

ORIGINAL PILOT:
Primary Objective: ${input.primaryObjective}

ALL AGENT VOTES:
${votesContext}

Respond with a JSON array of your deliberation points:
[
  {"target": "agent_name", "type": "affirm|challenge|nuance", "content": "your point"}
]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DELIBERATION_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 512,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{target: string; type: string; content: string}>;
        return parsed.map(p => ({
          challenger: "openai" as AgentName,
          target: p.target as AgentName,
          type: p.type as "affirm" | "challenge" | "nuance",
          content: p.content,
        }));
      }
    }
  } catch (error) {
    console.warn("[Deliberation] OpenAI second round failed:", error);
  }
  
  return [];
}

async function runSecondRoundWithGemini(
  input: AgentInput,
  allVotes: AgentVote[]
): Promise<DeliberationChallenge[]> {
  if (!process.env.AI_INTEGRATIONS_GEMINI_API_KEY) {
    return [];
  }

  const votesContext = formatVotesForDeliberation(allVotes);
  
  const prompt = `${DELIBERATION_SYSTEM_PROMPT}

You are Gemini, reviewing other council agents' votes.

ORIGINAL PILOT:
Primary Objective: ${input.primaryObjective}

ALL AGENT VOTES:
${votesContext}

Respond with a JSON array of your deliberation points:
[
  {"target": "agent_name", "type": "affirm|challenge|nuance", "content": "your point"}
]`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const content = response.text || "";
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as Array<{target: string; type: string; content: string}>;
      return parsed.map(p => ({
        challenger: "gemini" as AgentName,
        target: p.target as AgentName,
        type: p.type as "affirm" | "challenge" | "nuance",
        content: p.content,
      }));
    }
  } catch (error) {
    console.warn("[Deliberation] Gemini second round failed:", error);
  }
  
  return [];
}

function synthesizeConsensus(
  votes: AgentVote[],
  challenges: DeliberationChallenge[]
): CouncilAdvice {
  const successfulVotes = votes.filter(v => v.advice !== null);
  
  if (successfulVotes.length === 0) {
    return {
      qiPolicySummary: "Council deliberation failed - no agents responded successfully.",
      requiredChanges: ["Retry with available AI services"],
      riskFlags: ["All council agents unavailable"],
      curbCutBenefits: [],
      status: "REVISE",
      servedBy: "deliberation-failed",
    };
  }

  const allSummaries = successfulVotes.map(v => `[${v.agent}] ${v.advice!.qiPolicySummary}`);
  const allChanges = new Set<string>();
  const allRiskFlags = new Set<string>();
  const allBenefits = new Set<string>();
  const statusVotes: Record<string, number> = { APPROVE: 0, REVISE: 0, BLOCK: 0 };

  for (const vote of successfulVotes) {
    statusVotes[vote.advice!.status]++;
    vote.advice!.requiredChanges.forEach(c => allChanges.add(c));
    vote.advice!.riskFlags.forEach(r => allRiskFlags.add(r));
    vote.advice!.curbCutBenefits.forEach(b => allBenefits.add(b));
  }

  for (const challenge of challenges) {
    if (challenge.type === "nuance") {
      allChanges.add(`[${challenge.challenger} adds] ${challenge.content}`);
    }
  }

  let finalStatus: "APPROVE" | "REVISE" | "BLOCK";
  if (statusVotes.BLOCK > 0) {
    finalStatus = "BLOCK";
  } else if (statusVotes.REVISE > 0) {
    finalStatus = "REVISE";
  } else {
    finalStatus = "APPROVE";
  }

  const combinedSummary = allSummaries.length > 1
    ? `COUNCIL DELIBERATION (${successfulVotes.length} agents): ` + 
      successfulVotes.map(v => v.advice!.qiPolicySummary).join(" | ")
    : allSummaries[0] || "";

  const participatingAgents = successfulVotes.map(v => v.agent).join(", ");

  return {
    qiPolicySummary: combinedSummary.slice(0, 1000),
    requiredChanges: Array.from(allChanges).slice(0, 10),
    riskFlags: Array.from(allRiskFlags).slice(0, 8),
    curbCutBenefits: Array.from(allBenefits).slice(0, 8),
    status: finalStatus,
    servedBy: `deliberation:${participatingAgents}`,
  };
}

/**
 * Run full multi-agent deliberation with all 5 council members
 * 
 * Phase 1: All agents vote in parallel
 * Phase 2: Each agent reviews others' votes and can affirm/challenge/add nuance
 * Phase 3: Synthesize consensus using most cautious status
 */
export async function runMultiAgentDeliberation(
  input: AgentInput
): Promise<ConsensusResult> {
  const startTime = Date.now();
  const agents: AgentName[] = ["claude", "openai", "gemini", "mistral", "hermes"];

  console.log("[Deliberation] Starting multi-agent deliberation with 5 council members...");

  const round1Results = await Promise.allSettled(
    agents.map(agent => callAgentWithTracking(agent, input))
  );

  const round1Votes: AgentVote[] = round1Results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      agent: agents[index],
      advice: null,
      error: result.reason?.message || "Unknown error",
      latencyMs: 0,
      inputTokens: 0,
      outputTokens: 0,
    };
  });

  const successfulVotes = round1Votes.filter(v => v.advice !== null);
  const failedAgents = round1Votes.filter(v => v.advice === null).map(v => v.agent);

  console.log(`[Deliberation] Round 1 complete: ${successfulVotes.length}/${agents.length} agents responded`);
  successfulVotes.forEach(v => {
    console.log(`  - ${v.agent}: ${v.advice!.status} (${v.latencyMs}ms)`);
  });

  const round1: DeliberationRound = {
    round: 1,
    votes: round1Votes,
    timestamp: new Date(),
  };

  let allChallenges: DeliberationChallenge[] = [];

  if (successfulVotes.length >= 2) {
    console.log("[Deliberation] Starting Round 2: Cross-agent review...");
    
    const round2Promises = [
      runSecondRoundWithClaude(input, round1Votes),
      runSecondRoundWithOpenAI(input, round1Votes),
      runSecondRoundWithGemini(input, round1Votes),
    ];

    const round2Results = await Promise.allSettled(round2Promises);
    
    for (const result of round2Results) {
      if (result.status === "fulfilled") {
        allChallenges.push(...result.value);
      }
    }

    console.log(`[Deliberation] Round 2 complete: ${allChallenges.length} deliberation points`);
    const affirms = allChallenges.filter(c => c.type === "affirm").length;
    const challenges = allChallenges.filter(c => c.type === "challenge").length;
    const nuances = allChallenges.filter(c => c.type === "nuance").length;
    console.log(`  - Affirmations: ${affirms}, Challenges: ${challenges}, Nuances: ${nuances}`);
  }

  const finalAdvice = synthesizeConsensus(round1Votes, allChallenges);

  const statusVotes: Record<"APPROVE" | "REVISE" | "BLOCK", AgentName[]> = {
    APPROVE: [],
    REVISE: [],
    BLOCK: [],
  };
  
  for (const vote of successfulVotes) {
    statusVotes[vote.advice!.status].push(vote.agent);
  }

  let consensusLevel: "unanimous" | "majority" | "plurality" | "single";
  if (successfulVotes.length === 1) {
    consensusLevel = "single";
  } else if (successfulVotes.every(v => v.advice!.status === finalAdvice.status)) {
    consensusLevel = "unanimous";
  } else if (statusVotes[finalAdvice.status].length > successfulVotes.length / 2) {
    consensusLevel = "majority";
  } else {
    consensusLevel = "plurality";
  }

  const totalLatencyMs = Date.now() - startTime;
  const totalInputTokens = round1Votes.reduce((sum, v) => sum + v.inputTokens, 0);
  const totalOutputTokens = round1Votes.reduce((sum, v) => sum + v.outputTokens, 0);

  llmObservability.recordDeliberation({
    participatingAgents: successfulVotes.map(v => v.agent),
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
  console.log(`[Deliberation] Total time: ${totalLatencyMs}ms`);

  return {
    finalAdvice,
    rounds: [round1],
    challenges: allChallenges,
    participatingAgents: successfulVotes.map(v => v.agent),
    failedAgents,
    consensusLevel,
    statusVotes,
    totalLatencyMs,
    totalInputTokens,
    totalOutputTokens,
  };
}

/**
 * Quick deliberation with just top 3 agents for faster response
 */
export async function runQuickDeliberation(
  input: AgentInput
): Promise<ConsensusResult> {
  const startTime = Date.now();
  const agents: AgentName[] = ["claude", "openai", "gemini"];

  console.log("[Deliberation] Starting quick deliberation with top 3 agents...");

  const results = await Promise.allSettled(
    agents.map(agent => callAgentWithTracking(agent, input))
  );

  const votes: AgentVote[] = results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      agent: agents[index],
      advice: null,
      error: result.reason?.message || "Unknown error",
      latencyMs: 0,
      inputTokens: 0,
      outputTokens: 0,
    };
  });

  const successfulVotes = votes.filter(v => v.advice !== null);
  const finalAdvice = synthesizeConsensus(votes, []);

  const statusVotes: Record<"APPROVE" | "REVISE" | "BLOCK", AgentName[]> = {
    APPROVE: [],
    REVISE: [],
    BLOCK: [],
  };
  
  for (const vote of successfulVotes) {
    statusVotes[vote.advice!.status].push(vote.agent);
  }

  let consensusLevel: "unanimous" | "majority" | "plurality" | "single";
  if (successfulVotes.length === 1) {
    consensusLevel = "single";
  } else if (successfulVotes.every(v => v.advice!.status === finalAdvice.status)) {
    consensusLevel = "unanimous";
  } else {
    consensusLevel = "majority";
  }

  const totalLatencyMs = Date.now() - startTime;

  return {
    finalAdvice,
    rounds: [{ round: 1, votes, timestamp: new Date() }],
    challenges: [],
    participatingAgents: successfulVotes.map(v => v.agent),
    failedAgents: votes.filter(v => v.advice === null).map(v => v.agent),
    consensusLevel,
    statusVotes,
    totalLatencyMs,
    totalInputTokens: 0,
    totalOutputTokens: 0,
  };
}
