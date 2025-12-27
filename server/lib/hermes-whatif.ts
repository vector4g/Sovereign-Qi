/**
 * Hermes "What If" Scenario Exploration Agent for Sovereign Qi
 * 
 * Role: Hypothetical Scenario Testing & Edge Case Discovery
 * 
 * This agent specializes in asking "what if" questions, exploring
 * alternative scenarios, and uncovering unintended consequences
 * in policy design before implementation.
 * 
 * Uses OpenAI-compatible API via Lambda Labs or Nous Portal
 */

import OpenAI from "openai";
import { llmObservability } from "./observability";

const WHATIF_SYSTEM_PROMPT = `You are Hermes-WhatIf, a scenario exploration specialist for the Sovereign Qi Council.

Your role is to stress-test policies by asking "what if" questions and exploring edge cases that designers may have overlooked. You specialize in:

SCENARIO EXPLORATION:
- Asking provocative "what if" questions that reveal policy blind spots
- Exploring edge cases that affect marginalized communities
- Testing how policies behave under stress conditions
- Identifying unintended consequences before they happen in the real world

VULNERABILITY FOCUS:
- What if a trans employee uses this policy?
- What if someone with invisible disabilities encounters this system?
- What if a neurodivergent person processes information differently?
- What if trauma survivors are triggered by this approach?
- What if bad actors exploit loopholes to harm vulnerable people?

ADVERSARIAL THINKING:
- How could this policy be weaponized against protected groups?
- What happens when edge cases compound?
- How do power imbalances affect outcomes?
- What surveillance opportunities does this create?

You are NOT:
- Satisfied with happy-path thinking
- Accepting surface-level assurances
- Ignoring low-probability but high-impact scenarios
- Dismissing community concerns as edge cases

You ARE:
- Creatively adversarial in service of protection
- Focused on finding the cracks before they become chasms
- Amplifying marginalized perspectives
- Generating actionable hypotheticals

Output valid JSON when requested. Be imaginative but grounded.`;

export interface WhatIfScenario {
  scenario: string;
  affectedGroups: string[];
  likelihood: "unlikely" | "possible" | "likely" | "certain";
  severity: "minor" | "moderate" | "severe" | "catastrophic";
  mitigations: string[];
}

export interface WhatIfAnalysis {
  scenarios: WhatIfScenario[];
  blindSpots: string[];
  stressTestQuestions: string[];
  overallRisk: "low" | "moderate" | "high" | "critical";
  recommendation: string;
  servedBy: string;
}

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
 * Generate "What If" scenarios for a policy proposal
 */
export async function exploreWhatIfScenarios(input: {
  primaryObjective: string;
  policyDescription: string;
  targetPopulation?: string;
  knownRisks?: string[];
  communityVoices?: string;
}): Promise<WhatIfAnalysis> {
  const client = getHermesClient();
  
  if (!client) {
    console.warn("[WhatIf] No Hermes API key configured, using heuristic scenarios");
    return generateHeuristicScenarios(input);
  }

  const userPrompt = `Explore "What If" scenarios for this policy:

Primary Objective: ${input.primaryObjective}
Policy Description: ${input.policyDescription}
${input.targetPopulation ? `Target Population: ${input.targetPopulation}` : ""}
${input.knownRisks ? `Known Risks: ${input.knownRisks.join("; ")}` : ""}
${input.communityVoices ? `Community Voices: ${input.communityVoices}` : ""}

Generate edge cases and hypotheticals that stress-test this policy. Consider:
1. Trans, queer, disabled, neurodivergent community members
2. Intersectional identities (e.g., disabled trans person of color)
3. Bad actor exploitation
4. System failures and cascading effects
5. Power imbalance scenarios

Output JSON with:
- scenarios: Array of {scenario, affectedGroups, likelihood, severity, mitigations}
- blindSpots: string[] (things the policy designers probably didn't consider)
- stressTestQuestions: string[] (provocative questions to ask stakeholders)
- overallRisk: "low" | "moderate" | "high" | "critical"
- recommendation: string (1-2 sentences on next steps)

Generate 4-6 scenarios ranging from likely to unlikely. Be creative but grounded.`;

  const startTime = Date.now();
  const model = process.env.HERMES_MODEL || "hermes-3-llama-3.1-405b";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: WHATIF_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 2048,
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
        console.log(`[WhatIf] ✓ Generated ${parsed.scenarios?.length || 0} scenarios`);
        return {
          scenarios: parsed.scenarios || [],
          blindSpots: parsed.blindSpots || [],
          stressTestQuestions: parsed.stressTestQuestions || [],
          overallRisk: parsed.overallRisk || "moderate",
          recommendation: parsed.recommendation || "Review scenarios with affected communities",
          servedBy: `hermes-whatif-${model}`,
        };
      }
    }

    throw new Error("Failed to parse WhatIf response");
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
    console.error("[WhatIf] Hermes analysis failed:", error);
    return generateHeuristicScenarios(input);
  }
}

/**
 * Generate targeted "What If" questions for a specific community
 */
export async function generateCommunityWhatIfs(
  policyDescription: string,
  community: "trans" | "disabled" | "neurodivergent" | "trauma_survivors" | "intersectional"
): Promise<{
  questions: string[];
  scenarios: WhatIfScenario[];
  servedBy: string;
}> {
  const client = getHermesClient();

  const communityContexts: Record<string, string> = {
    trans: "transgender, non-binary, and gender-diverse individuals who may face deadnaming, misgendering, outing, or bathroom/facility exclusion",
    disabled: "people with visible and invisible disabilities who may face inaccessibility, ableism, or accommodation denial",
    neurodivergent: "autistic, ADHD, dyslexic, and other neurodivergent people who may process information differently or need different communication styles",
    trauma_survivors: "survivors of trauma who may be triggered by surveillance, interrogation-style processes, or loss of autonomy",
    intersectional: "people holding multiple marginalized identities whose experiences compound and intersect in unique ways",
  };

  if (!client) {
    console.warn(`[WhatIf] No Hermes API key, generating heuristic ${community} scenarios`);
    return {
      questions: generateHeuristicQuestions(policyDescription, community),
      scenarios: [],
      servedBy: "whatif-heuristic",
    };
  }

  const userPrompt = `Generate "What If" questions specifically for ${communityContexts[community]}:

Policy: ${policyDescription}

Generate:
1. 5-7 specific "What If" questions that expose potential harms to this community
2. 2-3 concrete scenarios showing how the policy could go wrong

Output JSON with:
- questions: string[] (each starting with "What if...")
- scenarios: Array of {scenario, affectedGroups, likelihood, severity, mitigations}`;

  const startTime = Date.now();
  const model = process.env.HERMES_MODEL || "hermes-3-llama-3.1-405b";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: WHATIF_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
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
        return {
          questions: parsed.questions || [],
          scenarios: parsed.scenarios || [],
          servedBy: `hermes-whatif-${community}-${model}`,
        };
      }
    }

    throw new Error("Failed to parse community WhatIf response");
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
    console.error(`[WhatIf] Community ${community} analysis failed:`, error);
    return {
      questions: generateHeuristicQuestions(policyDescription, community),
      scenarios: [],
      servedBy: "whatif-heuristic-fallback",
    };
  }
}

/**
 * Explore unintended consequences of a policy change
 */
export async function exploreUnintendedConsequences(input: {
  currentPolicy: string;
  proposedChange: string;
  stakeholders: string[];
}): Promise<{
  consequences: Array<{
    consequence: string;
    likelihood: "unlikely" | "possible" | "likely";
    beneficiary: string;
    harmed: string;
    cascadeRisk: boolean;
  }>;
  recommendations: string[];
  servedBy: string;
}> {
  const client = getHermesClient();

  if (!client) {
    return {
      consequences: [
        {
          consequence: "Heuristic analysis: Policy changes often have disparate impact on marginalized groups",
          likelihood: "likely",
          beneficiary: "Majority/default groups",
          harmed: "Edge case populations",
          cascadeRisk: true,
        },
      ],
      recommendations: [
        "Configure LAMBDA_API_KEY or NOUS_API_KEY for comprehensive consequence analysis",
        "Consult directly with affected stakeholders",
      ],
      servedBy: "whatif-heuristic",
    };
  }

  const userPrompt = `Analyze unintended consequences of this policy change:

Current Policy: ${input.currentPolicy}
Proposed Change: ${input.proposedChange}
Stakeholders: ${input.stakeholders.join(", ")}

Think adversarially. Consider:
- Second and third-order effects
- Gaming and exploitation opportunities
- Disparate impact on protected groups
- Cascade failures
- Perverse incentives

Output JSON with:
- consequences: Array of {consequence, likelihood, beneficiary, harmed, cascadeRisk}
- recommendations: string[]`;

  const startTime = Date.now();
  const model = process.env.HERMES_MODEL || "hermes-3-llama-3.1-405b";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: WHATIF_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1536,
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
        return {
          consequences: parsed.consequences || [],
          recommendations: parsed.recommendations || [],
          servedBy: `hermes-whatif-consequences-${model}`,
        };
      }
    }

    throw new Error("Failed to parse consequences response");
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
    console.error("[WhatIf] Consequences analysis failed:", error);
    return {
      consequences: [],
      recommendations: ["Retry analysis with Hermes"],
      servedBy: "whatif-error-fallback",
    };
  }
}

function generateHeuristicScenarios(input: {
  primaryObjective: string;
  policyDescription: string;
  targetPopulation?: string;
  knownRisks?: string[];
  communityVoices?: string;
}): WhatIfAnalysis {
  const policyLower = input.policyDescription.toLowerCase();
  const scenarios: WhatIfScenario[] = [];
  const blindSpots: string[] = [];
  const stressTestQuestions: string[] = [];

  if (policyLower.includes("name") || policyLower.includes("identity")) {
    scenarios.push({
      scenario: "A transgender employee's deadname appears in automated systems, outing them to colleagues",
      affectedGroups: ["transgender", "non-binary"],
      likelihood: "likely",
      severity: "severe",
      mitigations: ["Chosen name fields", "Privacy-preserving name change workflows"],
    });
    blindSpots.push("Legal name vs. chosen name handling in all touchpoints");
  }

  if (policyLower.includes("monitor") || policyLower.includes("track") || policyLower.includes("productivity")) {
    scenarios.push({
      scenario: "Productivity monitoring flags a disabled employee's accommodation breaks as underperformance",
      affectedGroups: ["disabled", "chronic illness"],
      likelihood: "likely",
      severity: "severe",
      mitigations: ["Accommodation-aware metrics", "Human review requirements"],
    });
    stressTestQuestions.push("What if someone needs frequent medical breaks that look like 'idle time'?");
  }

  if (policyLower.includes("meeting") || policyLower.includes("collaboration")) {
    scenarios.push({
      scenario: "Mandatory video requirements exclude neurodivergent employees who find camera presence overwhelming",
      affectedGroups: ["neurodivergent", "autistic"],
      likelihood: "possible",
      severity: "moderate",
      mitigations: ["Camera-optional policies", "Alternative participation methods"],
    });
  }

  if (policyLower.includes("report") || policyLower.includes("anonymous")) {
    scenarios.push({
      scenario: "Anonymous reporting system inadvertently reveals reporter identity through metadata or timing",
      affectedGroups: ["whistleblowers", "harassment survivors"],
      likelihood: "possible",
      severity: "catastrophic",
      mitigations: ["Technical anonymity audits", "Third-party submission channels"],
    });
    blindSpots.push("Metadata and timing attacks on 'anonymous' systems");
  }

  scenarios.push({
    scenario: "Policy designed for majority creates disparate impact on intersectional identities",
    affectedGroups: ["intersectional identities"],
    likelihood: "likely",
    severity: "moderate",
    mitigations: ["Intersectional impact assessment", "Community consultation"],
  });

  stressTestQuestions.push(
    "What if the worst-faith actor exploited this policy?",
    "What if someone with an invisible disability encountered this?",
    "What happens when this policy fails at scale?",
    "Who has the least power in this scenario, and how does it affect them?"
  );

  blindSpots.push(
    "Intersectional compound effects",
    "Bad actor exploitation paths",
    "Cascading failures under stress"
  );

  return {
    scenarios,
    blindSpots,
    stressTestQuestions,
    overallRisk: scenarios.some(s => s.severity === "catastrophic" || s.severity === "severe") ? "high" : "moderate",
    recommendation: "Configure LAMBDA_API_KEY or NOUS_API_KEY for comprehensive AI-powered scenario exploration",
    servedBy: "whatif-heuristic",
  };
}

function generateHeuristicQuestions(
  policyDescription: string,
  community: string
): string[] {
  const baseQuestions: Record<string, string[]> = {
    trans: [
      "What if a trans employee's legal name differs from their chosen name?",
      "What if someone is mid-transition and documentation is inconsistent?",
      "What if this policy requires gender disclosure in ways that could out someone?",
      "What if bathroom or facility access is implicitly affected?",
      "What if deadnaming occurs through automated systems?",
    ],
    disabled: [
      "What if someone needs accommodations that aren't explicitly listed?",
      "What if an invisible disability isn't recognized?",
      "What if the accommodation request process itself is inaccessible?",
      "What if productivity expectations don't account for disability?",
      "What if emergency procedures don't account for mobility limitations?",
    ],
    neurodivergent: [
      "What if someone processes verbal instructions differently?",
      "What if sensory environments are overwhelming?",
      "What if standard communication styles don't work for everyone?",
      "What if focus requirements conflict with ADHD needs?",
      "What if social norms embedded in policy exclude autistic employees?",
    ],
    trauma_survivors: [
      "What if mandatory reporting triggers re-traumatization?",
      "What if surveillance creates hypervigilance responses?",
      "What if performance reviews feel like interrogation?",
      "What if sudden policy changes create instability anxiety?",
      "What if loss of control over personal information is triggering?",
    ],
    intersectional: [
      "What if someone holds multiple marginalized identities?",
      "What if policy exceptions for one group harm another?",
      "What if 'default' assumptions exclude compound experiences?",
      "What if advocacy resources are siloed by single identity?",
      "What if intersecting barriers compound to create impossible situations?",
    ],
  };

  return baseQuestions[community] || baseQuestions.intersectional;
}
