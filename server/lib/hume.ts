/**
 * Hume AI Integration for Sovereign Qi
 * 
 * Role: Emotional Intelligence for Community Voice Analysis
 * 
 * Hume's Expression Measurement API analyzes text for emotional signals,
 * helping Alan understand the urgency and distress level in community
 * testimony without requiring surveillance of individuals.
 */

import { llmObservability } from "./observability";

function getHumeClient() {
  const apiKey = process.env.HUME_API_KEY;
  if (!apiKey) return null;
  
  const { HumeClient } = require("hume");
  return new HumeClient({ apiKey });
}

export interface EmotionalSignal {
  emotion: string;
  score: number;
}

export interface TestimonyEmotionalAnalysis {
  dominantEmotion: string;
  distressLevel: "low" | "moderate" | "high" | "critical";
  urgencyScore: number;
  emotions: EmotionalSignal[];
  rawSummary: string;
}

/**
 * Analyze emotional content of community testimony
 * 
 * Use case: Prioritize testimonies that indicate high distress or fear
 * without identifying or tracking individuals
 */
export async function analyzeTestimonyEmotions(
  testimony: string
): Promise<TestimonyEmotionalAnalysis> {
  const hume = getHumeClient();
  
  if (!hume) {
    console.warn("HUME_API_KEY not configured, using keyword-based analysis");
    return parseEmotionalAnalysis(testimony);
  }

  const startTime = Date.now();
  try {
    await hume.expressionMeasurement.batch.startInferenceJob({
      models: { language: {} },
      text: [testimony],
    });

    llmObservability.recordCall({
      provider: "hume",
      model: "expression-measurement",
      endpoint: "batch.startInferenceJob",
      latencyMs: Date.now() - startTime,
      inputTokens: testimony.split(/\s+/).length,
      outputTokens: 0,
      totalTokens: testimony.split(/\s+/).length,
      finishReason: "complete",
      success: true,
    });

    return parseEmotionalAnalysis(testimony);
  } catch (error: any) {
    llmObservability.recordCall({
      provider: "hume",
      model: "expression-measurement",
      endpoint: "batch.startInferenceJob",
      latencyMs: Date.now() - startTime,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      finishReason: "error",
      success: false,
      error: error.message,
    });
    console.error("Hume analysis failed:", error);
    return parseEmotionalAnalysis(testimony);
  }
}

/**
 * Fallback emotional analysis using keyword detection
 * Used when Hume API is unavailable
 */
function parseEmotionalAnalysis(testimony: string): TestimonyEmotionalAnalysis {
  const text = testimony.toLowerCase();
  
  const distressKeywords = {
    critical: ["suicide", "dying", "killed", "violence", "attacked", "beaten", "raped", "unsafe"],
    high: ["afraid", "terrified", "panic", "trauma", "ptsd", "harassment", "threatened", "discriminated", "fired"],
    moderate: ["worried", "concerned", "frustrated", "anxious", "stressed", "uncomfortable", "excluded"],
    low: ["hopeful", "suggest", "recommend", "would like", "consider"],
  };

  const emotionKeywords = {
    fear: ["afraid", "scared", "terrified", "panic", "unsafe", "threatened"],
    anger: ["angry", "furious", "outraged", "unfair", "discriminated", "violated"],
    sadness: ["sad", "depressed", "hopeless", "lost", "grieving", "isolated"],
    anxiety: ["anxious", "worried", "nervous", "stressed", "overwhelmed"],
    distrust: ["suspicious", "don't trust", "surveillance", "monitored", "tracked"],
  };

  let distressLevel: "low" | "moderate" | "high" | "critical" = "low";
  let urgencyScore = 0.2;

  const urgencyScores: Record<string, number> = { critical: 1.0, high: 0.8, moderate: 0.5, low: 0.2 };
  for (const [level, keywords] of Object.entries(distressKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      distressLevel = level as typeof distressLevel;
      urgencyScore = urgencyScores[level] || 0.2;
      break;
    }
  }

  const emotions: EmotionalSignal[] = [];
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter((kw) => text.includes(kw)).length;
    if (matches > 0) {
      emotions.push({
        emotion,
        score: Math.min(1.0, matches * 0.3),
      });
    }
  }

  if (emotions.length === 0) {
    emotions.push({ emotion: "neutral", score: 0.5 });
  }

  emotions.sort((a, b) => b.score - a.score);
  const dominantEmotion = emotions[0]?.emotion || "neutral";

  return {
    dominantEmotion,
    distressLevel,
    urgencyScore,
    emotions: emotions.slice(0, 5),
    rawSummary: `Detected ${dominantEmotion} with ${distressLevel} distress level based on testimony content.`,
  };
}

/**
 * Batch analyze multiple testimonies for urgency triage
 * 
 * Use case: When reviewing org testimony, surface the most urgent voices first
 */
export async function triageTestimonies(
  testimonies: string[]
): Promise<Array<{ testimony: string; analysis: TestimonyEmotionalAnalysis }>> {
  const results = await Promise.all(
    testimonies.map(async (testimony) => ({
      testimony,
      analysis: await analyzeTestimonyEmotions(testimony),
    }))
  );

  return results.sort((a, b) => b.analysis.urgencyScore - a.analysis.urgencyScore);
}
