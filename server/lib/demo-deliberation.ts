/**
 * Demo Deliberation: 4-Phase Structured Case Hearing
 * 
 * Implements the structured deliberation flow:
 * 1. Initial Briefs - Each agent analyzes independently
 * 2. Cross-Critique - Agents review each other's work
 * 3. Synthesis - Council Chair produces unified policy
 * 4. Reflection - Show why collective intelligence wins
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {
  TRAVEL_SAFETY_SCENARIO,
  AGENT_CAPABILITIES,
  PHASE_PROMPTS,
  type DemoScenario,
  type DeliberationPhase,
  type PhasedDeliberationState,
  type AgentStrengthWeakness
} from "./demo-scenario";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface InitialBrief {
  agent: string;
  pioneerName: string;
  observations: string[];
  recommendations: string[];
  urgencyLevel: string;
  confidenceLevel: number;
  latencyMs: number;
}

interface CrossCritique {
  agent: string;
  pioneerName: string;
  agreementWith: { agent: string; point: string };
  blindSpotFlag: { agent: string; concern: string };
  gapAddress: string;
  latencyMs: number;
}

interface Synthesis {
  identifiedConflicts: Array<{ between: string[]; nature: string }>;
  tradeOffs: Array<{ weAccept: string; weForgo: string; rationale: string }>;
  unifiedPolicy: {
    immediateActions: string[];
    shortTermChanges: string[];
    longTermReforms: string[];
    attributions: Array<{ decision: string; sourceAgent: string; contribution: string }>;
  };
  overruledObjections: Array<{ from: string; objection: string; reason: string }>;
  finalStatus: "APPROVE" | "REVISE" | "BLOCK";
  latencyMs: number;
}

interface Reflection {
  singleAgentCounterfactuals: Array<{ agent: string; hypotheticalOutcome: string; problem: string }>;
  collectiveAdvantage: string;
  keyInsight: string;
  latencyMs: number;
}

export interface DemoDeliberationResult {
  scenario: DemoScenario;
  phases: {
    initialBriefs: InitialBrief[];
    crossCritiques: CrossCritique[];
    synthesis: Synthesis;
    reflection: Reflection;
  };
  totalLatencyMs: number;
  agentCapabilities: AgentStrengthWeakness[];
}

async function generateAgentBrief(agent: AgentStrengthWeakness, scenario: DemoScenario): Promise<InitialBrief> {
  const startTime = Date.now();
  const prompt = PHASE_PROMPTS.initialBrief(agent, scenario);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `You are ${agent.agent.toUpperCase()}, a council member specializing in ${agent.focusAreas[0]}.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        agent: agent.agent,
        pioneerName: agent.pioneerName,
        observations: parsed.observations || [],
        recommendations: parsed.recommendations || [],
        urgencyLevel: parsed.urgencyLevel || "high",
        confidenceLevel: parsed.confidenceLevel || 75,
        latencyMs: Date.now() - startTime,
      };
    }
  } catch (error) {
    console.error(`[Demo] Brief generation failed for ${agent.agent}:`, error);
  }

  // Fallback with heuristic response
  return generateHeuristicBrief(agent, scenario, Date.now() - startTime);
}

function generateHeuristicBrief(agent: AgentStrengthWeakness, scenario: DemoScenario, latencyMs: number): InitialBrief {
  const heuristics: Record<string, InitialBrief> = {
    alan: {
      agent: "alan",
      pioneerName: "Alan Turing",
      observations: [
        "The police demand for a bribe combined with 'lifestyle' threats represents coded hostility toward queer identity",
        "Company's reliance on State Department warnings ignores on-the-ground enforcement patterns against LGBTQ+ travelers",
        "Absence of specific LGBTQ+ travel policy creates systemic vulnerability disguised as 'neutral' policy"
      ],
      recommendations: [
        "Immediate BLOCK on LGBTQ+ employee travel to this destination until policy established",
        "Create internal threat assessment that tracks anti-LGBTQ+ enforcement, not just laws"
      ],
      urgencyLevel: "critical",
      confidenceLevel: 92,
      latencyMs
    },
    lynn: {
      agent: "lynn",
      pioneerName: "Lynn Conway",
      observations: [
        "Current travel approval system lacks identity-aware risk flags - technical gap exposed",
        "Emergency contact protocols failed - employee arranged own evacuation",
        "No secure communication channel existed for reporting identity-based harassment"
      ],
      recommendations: [
        "Implement tiered travel approval system with automatic escalation for high-risk destinations",
        "Deploy encrypted emergency communication channel with 24/7 response team"
      ],
      urgencyLevel: "high",
      confidenceLevel: 85,
      latencyMs
    },
    bayard: {
      agent: "bayard",
      pioneerName: "Bayard Rustin",
      observations: [
        "Multiple stakeholders have legitimate but competing interests that require coalition building",
        "LGBTQ+ ERG has organizing power (500+ members) that can be leveraged or become opposition",
        "Competitor withdrawal from market creates strategic opportunity if handled correctly"
      ],
      recommendations: [
        "Convene immediate stakeholder working group with ERG, Legal, Sales, and affected employee",
        "Position company as industry leader on LGBTQ+ travel safety - turn crisis into differentiation"
      ],
      urgencyLevel: "high",
      confidenceLevel: 80,
      latencyMs
    },
    sylvia: {
      agent: "sylvia",
      pioneerName: "Sylvia Rivera",
      observations: [
        "Employee was abandoned by both local authorities AND company systems - institutional failure",
        "Focus on 'senior engineer' status obscures that junior queer employees face same risks with less leverage",
        "Other 12 employees scheduled to travel may include closeted individuals who can't self-advocate"
      ],
      recommendations: [
        "Immediate outreach to all employees with upcoming travel to affected regions",
        "Create opt-out mechanism that doesn't require disclosure of identity or reason"
      ],
      urgencyLevel: "critical",
      confidenceLevel: 88,
      latencyMs
    },
    elizebeth: {
      agent: "elizebeth",
      pioneerName: "Elizebeth Friedman",
      observations: [
        "Pattern: Company's Pride celebrations + lack of protective policy = performative allyship signal",
        "Hotel staff overhearing call suggests surveillance vulnerability in accommodation choices",
        "Police bribe demand indicates systematic corruption that may involve tracking of foreign LGBTQ+ travelers"
      ],
      recommendations: [
        "Audit hotel partners for privacy practices and staff training on LGBTQ+ guest safety",
        "Investigate whether local fixers or security contractors can provide protection"
      ],
      urgencyLevel: "high",
      confidenceLevel: 78,
      latencyMs
    },
    claudette: {
      agent: "claudette",
      pioneerName: "Claudette Colvin",
      observations: [
        "Employee's threat of 'media exposure' suggests they don't trust internal channels - voice being suppressed",
        "Company's likely PR response will center 'employee safety' while protecting revenue - erasure in progress",
        "Junior/closeted queer employees' concerns will be invisible in any stakeholder process"
      ],
      recommendations: [
        "Employee must be centered in solution design, not just consulted",
        "Anonymous input mechanism for other affected employees who cannot speak publicly"
      ],
      urgencyLevel: "critical",
      confidenceLevel: 90,
      latencyMs
    },
    audre: {
      agent: "audre",
      pioneerName: "Audre Lorde",
      observations: [
        "Intersectional risk: Queer employees of color, trans employees, and disabled queer employees face compounded threats",
        "Company's 'neutral' travel policy is the master's tool - it cannot protect those it was not designed for",
        "Insurance coverage ambiguity for 'criminalized identity' reveals systemic devaluation of queer lives"
      ],
      recommendations: [
        "Complete policy reconstruction, not modification - current framework is fundamentally inadequate",
        "Require explicit coverage for identity-based incidents in all travel insurance contracts"
      ],
      urgencyLevel: "critical",
      confidenceLevel: 85,
      latencyMs
    },
    temple: {
      agent: "temple",
      pioneerName: "Temple Grandin",
      observations: [
        "Edge case: What if employee had been arrested? Current protocols have no path for legal defense abroad",
        "System assumes employees can self-advocate - fails for non-English speakers, those with anxiety, neurodivergent travelers",
        "What if the 'critical client implementation' could have been done remotely? Was travel truly necessary?"
      ],
      recommendations: [
        "Establish relationships with LGBTQ+-friendly legal resources in high-risk countries",
        "Require documented justification that travel cannot be replaced by remote work"
      ],
      urgencyLevel: "high",
      confidenceLevel: 82,
      latencyMs
    }
  };

  return heuristics[agent.agent] || {
    agent: agent.agent,
    pioneerName: agent.pioneerName,
    observations: ["Analysis pending"],
    recommendations: ["Recommendations pending"],
    urgencyLevel: "medium",
    confidenceLevel: 50,
    latencyMs
  };
}

async function generateCrossCritique(
  agent: AgentStrengthWeakness,
  allBriefs: InitialBrief[]
): Promise<CrossCritique> {
  const startTime = Date.now();
  
  const otherBriefs = allBriefs
    .filter(b => b.agent !== agent.agent)
    .map(b => `${b.agent.toUpperCase()} (${b.pioneerName}):\n- Observations: ${b.observations.join("; ")}\n- Recommendations: ${b.recommendations.join("; ")}`)
    .join("\n\n");

  const prompt = PHASE_PROMPTS.crossCritique(agent, otherBriefs);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        agent: agent.agent,
        pioneerName: agent.pioneerName,
        agreementWith: parsed.agreementWith || { agent: "unknown", point: "" },
        blindSpotFlag: parsed.blindSpotFlag || { agent: "unknown", concern: "" },
        gapAddress: parsed.gapAddress || "",
        latencyMs: Date.now() - startTime,
      };
    }
  } catch (error) {
    console.error(`[Demo] Cross-critique failed for ${agent.agent}:`, error);
  }

  // Heuristic fallback
  return generateHeuristicCritique(agent, allBriefs, Date.now() - startTime);
}

function generateHeuristicCritique(agent: AgentStrengthWeakness, allBriefs: InitialBrief[], latencyMs: number): CrossCritique {
  const critiques: Record<string, CrossCritique> = {
    alan: {
      agent: "alan",
      pioneerName: "Alan Turing",
      agreementWith: { agent: "sylvia", point: "Institutional failure abandoned the employee - this is the core issue" },
      blindSpotFlag: { agent: "bayard", concern: "Coalition building risks diluting protection for speed - we cannot compromise on safety" },
      gapAddress: "My threat detection reveals the bribe demand wasn't random - it's part of a pattern we need to map",
      latencyMs
    },
    lynn: {
      agent: "lynn",
      pioneerName: "Lynn Conway",
      agreementWith: { agent: "elizebeth", point: "Hotel surveillance vulnerability is real and fixable" },
      blindSpotFlag: { agent: "audre", concern: "Complete policy reconstruction is ideal but may take months - employees travel next week" },
      gapAddress: "Technical solutions can provide immediate protection while policy reforms proceed",
      latencyMs
    },
    bayard: {
      agent: "bayard",
      pioneerName: "Bayard Rustin",
      agreementWith: { agent: "claudette", point: "Affected employee must be centered, not sidelined" },
      blindSpotFlag: { agent: "alan", concern: "Immediate BLOCK may be necessary but creates its own backlash if not managed" },
      gapAddress: "Strategic timing and stakeholder management can make bold changes stick",
      latencyMs
    },
    sylvia: {
      agent: "sylvia",
      pioneerName: "Sylvia Rivera",
      agreementWith: { agent: "claudette", point: "Anonymous input for closeted employees is essential" },
      blindSpotFlag: { agent: "lynn", concern: "Technical systems mean nothing if the people operating them don't care" },
      gapAddress: "Ground-level impact assessment reveals who actually gets hurt by each option",
      latencyMs
    },
    elizebeth: {
      agent: "elizebeth",
      pioneerName: "Elizebeth Friedman",
      agreementWith: { agent: "alan", point: "The coded threat patterns need systematic tracking" },
      blindSpotFlag: { agent: "temple", concern: "Edge cases are important but we must solve the common case first" },
      gapAddress: "Pattern analysis can prioritize which destinations need immediate attention",
      latencyMs
    },
    claudette: {
      agent: "claudette",
      pioneerName: "Claudette Colvin",
      agreementWith: { agent: "audre", point: "Current framework is fundamentally inadequate, not just incomplete" },
      blindSpotFlag: { agent: "bayard", concern: "Stakeholder working groups often silence the most affected voices" },
      gapAddress: "Ensuring the affected employee has real power, not just a seat at the table",
      latencyMs
    },
    audre: {
      agent: "audre",
      pioneerName: "Audre Lorde",
      agreementWith: { agent: "sylvia", point: "Junior and closeted employees face compounded invisibility" },
      blindSpotFlag: { agent: "lynn", concern: "Technical solutions can become new forms of surveillance" },
      gapAddress: "Intersectional lens reveals who bears the most risk and must be centered",
      latencyMs
    },
    temple: {
      agent: "temple",
      pioneerName: "Temple Grandin",
      agreementWith: { agent: "lynn", point: "Emergency protocols need systematic redesign" },
      blindSpotFlag: { agent: "bayard", concern: "Coalition focus may miss individual edge cases that need exception handling" },
      gapAddress: "Stress-testing proposed solutions reveals hidden failure modes",
      latencyMs
    }
  };

  return critiques[agent.agent] || {
    agent: agent.agent,
    pioneerName: agent.pioneerName,
    agreementWith: { agent: "council", point: "General agreement on urgency" },
    blindSpotFlag: { agent: "council", concern: "Need more specific analysis" },
    gapAddress: "My expertise can help refine the approach",
    latencyMs
  };
}

async function generateSynthesis(briefs: InitialBrief[], critiques: CrossCritique[]): Promise<Synthesis> {
  const startTime = Date.now();

  const briefsSummary = briefs.map(b => 
    `${b.agent.toUpperCase()} (${b.pioneerName}):\n` +
    `Observations: ${b.observations.join("; ")}\n` +
    `Recommendations: ${b.recommendations.join("; ")}\n` +
    `Urgency: ${b.urgencyLevel}, Confidence: ${b.confidenceLevel}%`
  ).join("\n\n");

  const critiquesSummary = critiques.map(c =>
    `${c.agent.toUpperCase()} (${c.pioneerName}):\n` +
    `Agrees with ${c.agreementWith.agent}: ${c.agreementWith.point}\n` +
    `Flags blind spot in ${c.blindSpotFlag.agent}: ${c.blindSpotFlag.concern}\n` +
    `Gap addressed: ${c.gapAddress}`
  ).join("\n\n");

  const prompt = PHASE_PROMPTS.synthesis(briefsSummary, critiquesSummary);

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          latencyMs: Date.now() - startTime,
        };
      }
    }
  } catch (error) {
    console.error("[Demo] Synthesis failed:", error);
  }

  // Heuristic fallback
  return generateHeuristicSynthesis(briefs, critiques, Date.now() - startTime);
}

function generateHeuristicSynthesis(briefs: InitialBrief[], critiques: CrossCritique[], latencyMs: number): Synthesis {
  return {
    identifiedConflicts: [
      { between: ["alan", "bayard"], nature: "Immediate BLOCK vs. managed transition - speed of protection vs. coalition durability" },
      { between: ["audre", "lynn"], nature: "Complete reconstruction vs. incremental technical fixes - transformation vs. pragmatism" },
      { between: ["claudette", "bayard"], nature: "Employee empowerment vs. stakeholder process - individual voice vs. institutional change" }
    ],
    tradeOffs: [
      { 
        weAccept: "Immediate suspension of non-essential LGBTQ+ travel to high-risk destinations", 
        weForgo: "$50M market access in the short term", 
        rationale: "Employee safety and legal liability outweigh quarterly revenue (per Alan, Sylvia, Claudette)" 
      },
      {
        weAccept: "Accelerated technical safeguards (Lynn's encrypted channels, tiered approval)",
        weForgo: "Perfect intersectional policy framework before action (Audre's preference)",
        rationale: "Employees travel next week - we need working protection now, and can iterate"
      },
      {
        weAccept: "Affected employee leads policy working group with veto power",
        weForgo: "Faster executive-led decision making",
        rationale: "Those most affected must shape solutions (per Claudette, Sylvia)"
      }
    ],
    unifiedPolicy: {
      immediateActions: [
        "Suspend non-essential travel to destinations with criminalized LGBTQ+ status (effective immediately)",
        "Deploy 24/7 emergency response line with identity-aware protocols",
        "Reach out personally to all 12 employees with upcoming travel to affected regions"
      ],
      shortTermChanges: [
        "Create LGBTQ+ Travel Safety Policy with input from affected employee and ERG (30-day deadline)",
        "Audit and certify hotel partners for LGBTQ+ guest safety practices",
        "Establish anonymous reporting mechanism for identity-based travel concerns"
      ],
      longTermReforms: [
        "Require travel necessity justification - default to remote when possible",
        "Build internal threat intelligence on anti-LGBTQ+ enforcement patterns (not just laws)",
        "Include identity-based incident coverage in all travel insurance contracts"
      ],
      attributions: [
        { decision: "Immediate travel suspension", sourceAgent: "alan", contribution: "Identified coded threat patterns requiring BLOCK" },
        { decision: "Employee-led policy working group", sourceAgent: "claudette", contribution: "Ensured affected voices are centered, not sidelined" },
        { decision: "24/7 encrypted emergency channel", sourceAgent: "lynn", contribution: "Technical architecture for secure communication" },
        { decision: "Outreach to upcoming travelers", sourceAgent: "sylvia", contribution: "Street-level awareness of who's at risk now" },
        { decision: "Hotel partner audit", sourceAgent: "elizebeth", contribution: "Pattern recognition of surveillance vulnerability" },
        { decision: "Anonymous reporting mechanism", sourceAgent: "temple", contribution: "Edge case: closeted employees can't self-advocate openly" },
        { decision: "Travel necessity justification", sourceAgent: "audre", contribution: "Intersectional lens on who bears the burden of 'business necessity'" }
      ]
    },
    overruledObjections: [
      { 
        from: "bayard", 
        objection: "Wanted managed transition rather than immediate suspension to preserve coalition with Sales", 
        reason: "Employee safety cannot wait for coalition building - liability is immediate" 
      },
      {
        from: "audre",
        objection: "Advocated for complete policy reconstruction before any action",
        reason: "Employees travel next week - incremental protection now, transformation ongoing"
      }
    ],
    finalStatus: "REVISE",
    latencyMs
  };
}

async function generateReflection(synthesis: Synthesis): Promise<Reflection> {
  const startTime = Date.now();
  const prompt = PHASE_PROMPTS.reflection(JSON.stringify(synthesis, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        latencyMs: Date.now() - startTime,
      };
    }
  } catch (error) {
    console.error("[Demo] Reflection failed:", error);
  }

  // Heuristic fallback
  return {
    singleAgentCounterfactuals: [
      { agent: "alan", hypotheticalOutcome: "Would issue immediate BLOCK on all travel to the country", problem: "No path forward for essential business; employees feel over-protected rather than empowered" },
      { agent: "lynn", hypotheticalOutcome: "Would deploy technical solutions without policy changes", problem: "Systems without culture change; employees still unsupported by leadership" },
      { agent: "bayard", hypotheticalOutcome: "Would convene stakeholder process before action", problem: "Employees travel next week while committees deliberate; another incident likely" },
      { agent: "sylvia", hypotheticalOutcome: "Would demand maximum protection for most vulnerable", problem: "Solutions may not scale globally; business continuity concerns unaddressed" },
      { agent: "claudette", hypotheticalOutcome: "Would center only the affected employee's demands", problem: "May miss systemic issues affecting others who can't speak up" },
      { agent: "audre", hypotheticalOutcome: "Would require complete transformation before action", problem: "Perfect becomes enemy of good; employees unprotected during reconstruction" },
      { agent: "elizebeth", hypotheticalOutcome: "Would focus on intelligence and pattern analysis", problem: "Analysis paralysis; action delayed while patterns are mapped" }
    ],
    collectiveAdvantage: "The council's collective intelligence produced a balanced response: immediate protection (Alan), practical implementation (Lynn), stakeholder buy-in (Bayard), vulnerable-first design (Sylvia), voice amplification (Claudette), intersectional awareness (Audre), and edge case handling (Temple). No single agent could hold all these considerations simultaneously.",
    keyInsight: "The tension between 'protect now' and 'transform systems' was resolved by doing both in sequence: immediate safeguards while building toward structural change. This required the council to acknowledge both urgencies as valid.",
    latencyMs: Date.now() - startTime
  };
}

/**
 * Run the full 4-phase demo deliberation
 */
export async function runDemoDeliberation(): Promise<DemoDeliberationResult> {
  const startTime = Date.now();
  const scenario = TRAVEL_SAFETY_SCENARIO;
  
  // Get the voting agents (exclude temple for initial briefs, include in reflection)
  const votingAgents = AGENT_CAPABILITIES.filter(a => 
    ["alan", "lynn", "bayard", "sylvia", "elizebeth", "claudette", "audre"].includes(a.agent)
  );

  console.log("[Demo] Phase 1: Generating initial briefs...");
  
  // Phase 1: Initial Briefs (parallel)
  const briefPromises = votingAgents.map(agent => generateAgentBrief(agent, scenario));
  const initialBriefs = await Promise.all(briefPromises);
  
  console.log("[Demo] Phase 2: Generating cross-critiques...");
  
  // Phase 2: Cross-Critique (parallel)
  const critiquePromises = votingAgents.map(agent => generateCrossCritique(agent, initialBriefs));
  const crossCritiques = await Promise.all(critiquePromises);
  
  console.log("[Demo] Phase 3: Generating synthesis...");
  
  // Phase 3: Synthesis
  const synthesis = await generateSynthesis(initialBriefs, crossCritiques);
  
  console.log("[Demo] Phase 4: Generating reflection...");
  
  // Phase 4: Reflection
  const reflection = await generateReflection(synthesis);

  const totalLatencyMs = Date.now() - startTime;
  console.log(`[Demo] Deliberation complete in ${totalLatencyMs}ms`);

  return {
    scenario,
    phases: {
      initialBriefs,
      crossCritiques,
      synthesis,
      reflection
    },
    totalLatencyMs,
    agentCapabilities: AGENT_CAPABILITIES
  };
}

/**
 * Get a cached/quick demo result using heuristics only
 */
export function getQuickDemoResult(): DemoDeliberationResult {
  const scenario = TRAVEL_SAFETY_SCENARIO;
  const votingAgents = AGENT_CAPABILITIES.filter(a => 
    ["alan", "lynn", "bayard", "sylvia", "elizebeth", "claudette", "audre"].includes(a.agent)
  );

  const initialBriefs = votingAgents.map(agent => generateHeuristicBrief(agent, scenario, 0));
  const crossCritiques = votingAgents.map(agent => generateHeuristicCritique(agent, initialBriefs, 0));
  const synthesis = generateHeuristicSynthesis(initialBriefs, crossCritiques, 0);
  const reflection: Reflection = {
    singleAgentCounterfactuals: [
      { agent: "alan", hypotheticalOutcome: "Would issue immediate BLOCK on all travel", problem: "No path forward; employees over-protected not empowered" },
      { agent: "lynn", hypotheticalOutcome: "Would deploy technical solutions only", problem: "Systems without culture change don't protect" },
      { agent: "bayard", hypotheticalOutcome: "Would convene stakeholder process first", problem: "Committees deliberate while employees travel into danger" },
      { agent: "sylvia", hypotheticalOutcome: "Would demand maximum protection", problem: "May not scale globally; business concerns unaddressed" },
      { agent: "claudette", hypotheticalOutcome: "Would center only affected employee", problem: "May miss systemic issues affecting silent others" },
      { agent: "audre", hypotheticalOutcome: "Would require complete transformation", problem: "Perfect becomes enemy of good; no immediate protection" },
      { agent: "elizebeth", hypotheticalOutcome: "Would focus on pattern analysis", problem: "Analysis paralysis delays needed action" }
    ],
    collectiveAdvantage: "The council balanced immediate protection with systemic change, ensuring no single perspective dominated at the expense of others.",
    keyInsight: "The tension between 'protect now' and 'transform systems' was resolved by doing both: immediate safeguards while building toward structural change.",
    latencyMs: 0
  };

  return {
    scenario,
    phases: { initialBriefs, crossCritiques, synthesis, reflection },
    totalLatencyMs: 0,
    agentCapabilities: AGENT_CAPABILITIES
  };
}
