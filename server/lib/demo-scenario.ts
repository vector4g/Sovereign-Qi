/**
 * Demo Scenario: Structured Case Hearing for Liberation Pioneer Council
 * 
 * This module provides a pre-configured scenario that showcases
 * each agent's strengths and blind spots, requiring collective
 * intelligence to resolve.
 */

export interface DemoScenario {
  id: string;
  title: string;
  incidentType: string;
  description: string;
  embeddedTensions: string[];
  caseFile: {
    incident: string;
    context: string;
    stakeholders: string[];
    urgency: "low" | "medium" | "high" | "critical";
  };
}

export interface AgentStrengthWeakness {
  agent: string;
  pioneerName: string;
  strength: string;
  weakness: string;
  focusAreas: string[];
}

// The demo scenario: LGBTQ+ Travel Safety Case
export const TRAVEL_SAFETY_SCENARIO: DemoScenario = {
  id: "travel-safety-001",
  title: "Fortune 100 LGBTQ+ Travel Safety Incident",
  incidentType: "High-risk but legally gray travel safety case",
  description: `A Fortune 100 company's travel program sends employees to a country where queer 
relationships are criminalized but rarely enforced. One openly queer employee was harassed 
outside their hotel by locals who overheard a phone conversation with their partner. When 
they called local police for help, the officers demanded a bribe and made threatening 
comments about "foreign lifestyles." The employee is now safely back at headquarters, 
but demands answers about how this was allowed to happen.`,
  embeddedTensions: [
    "Legal vs. lived risk: Official law vs. on-the-ground enforcement patterns",
    "Corporate liability vs. employee autonomy: Duty of care vs. right to travel",
    "Short-term PR vs. long-term ESG: Immediate response vs. systemic policy change",
    "Individual incident vs. systemic issue: One case vs. all queer employees globally",
    "Business necessity vs. safety: Revenue from this market vs. employee protection"
  ],
  caseFile: {
    incident: `Employee: Senior Software Engineer (they/them), openly queer, 8-year tenure
Location: [Country with criminalized but rarely-enforced anti-LGBTQ+ laws]
Date: 3 days ago
Travel Purpose: Critical client implementation requiring on-site presence

Timeline:
- Day 1: Arrived safely, checked into company-approved hotel
- Day 2: Had video call with partner from hotel lobby; overheard by staff
- Day 2 Evening: Harassed by group outside hotel; called police
- Day 2 Night: Police demanded $500 bribe, made threats, departed without helping
- Day 3: Returned to US via emergency flight arranged by employee's own contacts
- Day 3+: Employee demands meeting with CEO; threatens resignation and media exposure

Current Status: Employee on paid leave, considering legal action against company`,
    context: `Company Context:
- Fortune 100 tech company with global operations
- $50M annual revenue from this country
- 12 other employees scheduled to travel there this quarter
- No formal LGBTQ+ travel policy exists
- General travel policy says "consult State Department warnings"
- Company publicly celebrates Pride month; CEO signed HRC pledge

Industry Context:
- Competitor withdrew from this market last year after similar incident
- Travel industry groups have conflicting guidance on "risk tier" assignments
- Insurance coverage unclear for incidents involving criminalized identity`,
    stakeholders: [
      "Affected employee and their legal counsel",
      "LGBTQ+ employee resource group (500+ members)",
      "Legal/Compliance team concerned about liability",
      "Sales team worried about losing $50M market",
      "HR/DEI team caught between competing demands",
      "Executive leadership facing potential PR crisis",
      "Other queer employees with upcoming travel to similar destinations"
    ],
    urgency: "critical"
  }
};

// Agent strengths and weaknesses for the demo
export const AGENT_CAPABILITIES: AgentStrengthWeakness[] = [
  {
    agent: "alan",
    pioneerName: "Alan Turing",
    strength: "Detects coded threats, dog whistles, and surveillance patterns in policy language. Sees when 'neutral' policies target vulnerable identities. Has VETO power to protect communities.",
    weakness: "May over-index on threat detection; could see danger where reasonable risk-taking is appropriate. Conservative bias toward maximum protection.",
    focusAreas: ["Coded language detection", "Identity-targeting patterns", "Surveillance mechanisms", "Cultural safety signals"]
  },
  {
    agent: "lynn",
    pioneerName: "Lynn Conway",
    strength: "Analyzes technical architecture and system design. Identifies data flows, privacy risks, and how systems can be weaponized. Advocates for second chances.",
    weakness: "May focus too heavily on technical solutions when human/policy interventions are needed. Can underweight emotional and cultural factors.",
    focusAreas: ["Technical architecture", "Data privacy", "System vulnerabilities", "Implementation feasibility"]
  },
  {
    agent: "bayard",
    pioneerName: "Bayard Rustin",
    strength: "Strategic coordination and coalition building. Sees the big picture, identifies stakeholder dynamics, finds common ground between competing interests.",
    weakness: "May prioritize coalition unity over individual protection. Risk of compromising on protections to maintain broader support.",
    focusAreas: ["Stakeholder dynamics", "Coalition building", "Strategic timing", "Political feasibility"]
  },
  {
    agent: "sylvia",
    pioneerName: "Sylvia Rivera",
    strength: "Street-level harm detection. Sees how policies actually affect the most vulnerable on the ground. Centers homeless, sex workers, undocumented, youth.",
    weakness: "May push for maximalist protections that are hard to scale globally. Can be skeptical of incremental progress.",
    focusAreas: ["Ground-level impact", "Youth protection", "Survival needs", "Implementation gaps"]
  },
  {
    agent: "elizebeth",
    pioneerName: "Elizebeth Friedman",
    strength: "Signal intelligence and pattern recognition. Detects hidden agendas, surveillance opportunities, and coded language in policy documents.",
    weakness: "May see patterns that aren't there. Can over-complicate simple issues by looking for hidden meanings.",
    focusAreas: ["Pattern recognition", "Hidden agendas", "Surveillance detection", "Information analysis"]
  },
  {
    agent: "claudette",
    pioneerName: "Claudette Colvin",
    strength: "Erasure detection and voice amplification. Identifies when marginalized voices are being silenced or deemed 'not the right messenger.'",
    weakness: "May resist pragmatic compromises that could help many, in favor of perfect solutions that help all. Distrust of institutional responses.",
    focusAreas: ["Voice amplification", "Erasure patterns", "Respectability politics", "Institutional accountability"]
  },
  {
    agent: "audre",
    pioneerName: "Audre Lorde",
    strength: "Intersectional critical analysis. Identifies how race, gender, sexuality, class, and disability compound in policy impacts.",
    weakness: "May reject incremental solutions as 'master's tools.' Can be skeptical of any institutional response as fundamentally inadequate.",
    focusAreas: ["Intersectionality", "Compound harm", "Systemic analysis", "Transformative vs. reformist approaches"]
  },
  {
    agent: "temple",
    pioneerName: "Temple Grandin",
    strength: "Alternative perspective and edge case analysis. Sees what neurotypical/majority designers miss. Stress-tests for unintended consequences.",
    weakness: "May focus on edge cases at expense of common cases. Can propose solutions that are brilliant but hard to implement.",
    focusAreas: ["Edge cases", "Alternative perspectives", "Unintended consequences", "System stress-testing"]
  }
];

// Phase prompts for the structured deliberation
export const PHASE_PROMPTS = {
  initialBrief: (agent: AgentStrengthWeakness, scenario: DemoScenario) => `
You are ${agent.pioneerName.split(' ')[0].toUpperCase()} (named after ${agent.pioneerName}), a specialist on the Sovereign Qi Council.

Your expertise: ${agent.strength}

Your focus areas: ${agent.focusAreas.join(", ")}

CASE FILE:
${scenario.caseFile.incident}

CONTEXT:
${scenario.caseFile.context}

STAKEHOLDERS:
${scenario.caseFile.stakeholders.join("\n")}

EMBEDDED TENSIONS:
${scenario.embeddedTensions.join("\n")}

Provide your initial analysis. You must:
1. State 2-3 key risk/impact observations from YOUR specific lens
2. Recommend 1-2 specific actions based on your expertise
3. Be concise (under 150 words)

Do NOT reference other agents yet. Focus only on YOUR unique perspective.

Respond in JSON:
{
  "observations": ["observation 1", "observation 2", "observation 3"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "urgencyLevel": "low" | "medium" | "high" | "critical",
  "confidenceLevel": 0-100
}
`,

  crossCritique: (agent: AgentStrengthWeakness, otherBriefs: string) => `
You are ${agent.pioneerName.split(' ')[0].toUpperCase()} (named after ${agent.pioneerName}).

You have received the initial briefs from other council members:

${otherBriefs}

Now you must:
1. Acknowledge ONE thing from another agent's analysis that you strongly agree with
2. Flag ONE critical risk or blind spot you see in the others' proposals
3. Suggest how your expertise addresses a gap in the collective analysis

Be direct but respectful. Under 100 words.

Respond in JSON:
{
  "agreementWith": { "agent": "agent_name", "point": "what you agree with" },
  "blindSpotFlag": { "agent": "agent_name", "concern": "what they missed" },
  "gapAddress": "how your expertise fills a gap"
}
`,

  synthesis: (allBriefs: string, allCritiques: string) => `
You are the COUNCIL CHAIR, an impartial facilitator for the Sovereign Qi Liberation Pioneer Council.

You have received all initial briefs:
${allBriefs}

And all cross-critiques:
${allCritiques}

Your task:
1. Identify 2-3 key CONFLICTS between agent recommendations
2. Force TRADE-OFFS: What can we achieve and what must we accept we cannot?
3. Synthesize a UNIFIED POLICY with explicit attribution (which agent's insight influenced each decision)
4. Note any objections that were overruled and why

Be decisive. This is a policy recommendation, not a discussion.

Respond in JSON:
{
  "identifiedConflicts": [
    { "between": ["agent1", "agent2"], "nature": "description" }
  ],
  "tradeOffs": [
    { "weAccept": "what we're choosing", "weForgo": "what we're giving up", "rationale": "why" }
  ],
  "unifiedPolicy": {
    "immediateActions": ["action 1", "action 2"],
    "shortTermChanges": ["change 1", "change 2"],
    "longTermReforms": ["reform 1", "reform 2"],
    "attributions": [
      { "decision": "decision text", "sourceAgent": "agent_name", "contribution": "what they provided" }
    ]
  },
  "overruledObjections": [
    { "from": "agent_name", "objection": "what they wanted", "reason": "why overruled" }
  ],
  "finalStatus": "APPROVE" | "REVISE" | "BLOCK"
}
`,

  reflection: (synthesisResult: string) => `
Based on this council synthesis:
${synthesisResult}

Generate a REFLECTION showing why collective intelligence outperformed any single agent.

For EACH agent, briefly state:
- "If only [AGENT] decided, the outcome would be [X]"
- "Problem: [Y - what would go wrong]"

Then conclude with: "The council's collective intelligence produced a better outcome because..."

Keep each agent reflection to 1-2 sentences. Total under 200 words.

Respond in JSON:
{
  "singleAgentCounterfactuals": [
    { "agent": "agent_name", "hypotheticalOutcome": "what would happen", "problem": "what goes wrong" }
  ],
  "collectiveAdvantage": "why the council together is better",
  "keyInsight": "the most important thing learned"
}
`
};

export type DeliberationPhase = "INITIAL_BRIEFS" | "CROSS_CRITIQUE" | "SYNTHESIS" | "REFLECTION";

export interface PhasedDeliberationState {
  phase: DeliberationPhase;
  scenario: DemoScenario;
  initialBriefs: Record<string, any>;
  crossCritiques: Record<string, any>;
  synthesis: any | null;
  reflection: any | null;
  startTime: number;
  phaseTimings: Record<DeliberationPhase, number>;
}
