export interface CouncilAdvice {
  qiPolicySummary: string;
  requiredChanges: string[];
  riskFlags: string[];
  curbCutBenefits: string[];
  status: "APPROVE" | "REVISE" | "BLOCK";
}

export async function generateQiPolicySummary(input: {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  communityVoices?: string;
}): Promise<string> {
  return (
    `For this pilot, Sovereign Qi recommends centering dignity and accessibility as first-class constraints. ` +
    `Shift from majority-rule decision making to policies that explicitly protect those most at risk, ` +
    `using synthetic personas and zero-knowledge access to avoid surveillance while still improving outcomes.`
  );
}

export async function generateCouncilAdvice(input: {
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  harms?: string;
  communityVoices?: string;
}): Promise<CouncilAdvice> {
  const baseSummary = await generateQiPolicySummary(input);

  return {
    qiPolicySummary: baseSummary,
    requiredChanges: [
      "Make accessibility and psychological safety explicit success metrics alongside efficiency.",
      "Remove any data collection that is not strictly necessary for the simulation objective.",
      "Document how queer, disabled, and neurodivergent stakeholders were included in defining Qi Logic."
    ],
    riskFlags: [
      "Potential over-reliance on monitoring language that could slip back into surveillance.",
      "Insufficient clarity on how dissenting voices will be protected in the governance process."
    ],
    curbCutBenefits: [
      "Design for queer and neurodivergent safety improves clarity and predictability for everyone.",
      "Anti-harassment detection tuned on anti-trans dog-whistles also catches subtle school and workplace bullying.",
      "Healthcare bias checks built for trans patients improve care pathways for all edge-case diagnostics."
    ],
    status: "REVISE"
  };
}
