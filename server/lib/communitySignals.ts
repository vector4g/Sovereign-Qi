import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

export interface CommunityVoiceSummary {
  riskGroups: string[];
  accessibilityConstraints: string[];
  surveillanceFears: string[];
  rawSummary: string;
}

export async function summariseCommunityVoices(
  communityVoices: string
): Promise<CommunityVoiceSummary> {
  if (!communityVoices || communityVoices.trim().length === 0) {
    return {
      riskGroups: [],
      accessibilityConstraints: [],
      surveillanceFears: [],
      rawSummary: "No community input provided.",
    };
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: `You are a community voice analyst for the Sovereign Qi Initiative. 
Your role is to distill community feedback into actionable insights for governance review.
You must identify and highlight:
1. WHO is most at risk (specific vulnerable populations)
2. WHAT accessibility constraints they describe (physical, cognitive, economic, social barriers)
3. ANY mentions of surveillance, fear, or privacy concerns

Be concise but preserve the urgency and specificity of community concerns.
Output valid JSON only.`,
      messages: [
        {
          role: "user",
          content: `Analyze this community feedback and extract key signals:

${communityVoices}

Return JSON with keys:
- riskGroups: string[] (who is most at risk)
- accessibilityConstraints: string[] (barriers described)
- surveillanceFears: string[] (privacy/surveillance concerns)
- rawSummary: string (2-3 sentence distillation)`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as CommunityVoiceSummary;
      }
    }

    return {
      riskGroups: ["Unable to parse community signals"],
      accessibilityConstraints: [],
      surveillanceFears: [],
      rawSummary: communityVoices.slice(0, 200),
    };
  } catch (error) {
    console.error("Community signals summarization failed:", error);
    return {
      riskGroups: ["Analysis unavailable"],
      accessibilityConstraints: [],
      surveillanceFears: [],
      rawSummary: communityVoices.slice(0, 200) + "...",
    };
  }
}
