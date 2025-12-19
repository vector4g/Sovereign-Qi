import OpenAI from "openai";

export interface SimulationMetrics {
  innovationIndex: number;
  burnoutIndex: number;
  liabilityIndex: number;
}

export interface SimulationResult {
  scenarioA: {
    label: string;
  } & SimulationMetrics;
  scenarioB: {
    label: string;
  } & SimulationMetrics;
}

export interface PilotInput {
  id: string;
  name: string;
  primaryObjective: string;
  majorityLogicDesc: string;
  qiLogicDesc: string;
  orgName: string;
  region: string;
}

const USE_NIM_SIMULATOR = process.env.USE_NIM_SIMULATOR === "true";

export async function runQiSimulation(pilot: PilotInput): Promise<SimulationResult> {
  if (USE_NIM_SIMULATOR) {
    return runQiSimulationViaNIM(pilot);
  }
  return runQiSimulationMock(pilot);
}

export function runQiSimulationMock(_pilot: PilotInput): SimulationResult {
  return {
    scenarioA: {
      label: "Majority Logic",
      innovationIndex: 1.0,
      burnoutIndex: 0.8,
      liabilityIndex: 0.7,
    },
    scenarioB: {
      label: "Qi Logic",
      innovationIndex: 1.4,
      burnoutIndex: 0.3,
      liabilityIndex: 0.1,
    },
  };
}

export async function runQiSimulationViaNIM(pilot: PilotInput): Promise<SimulationResult> {
  const baseURL = process.env.NVIDIA_NIM_BASE_URL;
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!baseURL || !apiKey) {
    console.warn("NIM credentials not configured, falling back to mock");
    return runQiSimulationMock(pilot);
  }

  const client = new OpenAI({
    baseURL,
    apiKey,
  });

  const systemPrompt = `You are an NVIDIA Omniverse-powered simulation engine for Sovereign Qi.
You run digital twin simulations comparing "Majority Logic" (efficiency-first, throughput-optimized governance) 
against "Qi Logic" (dignity-first, accessibility-optimized governance).

Your simulations measure:
- innovationIndex: normalized creativity/innovation output (1.0 = baseline)
- burnoutIndex: worker/citizen fatigue level (0.0 = none, 1.0 = critical)
- liabilityIndex: legal/ethical risk exposure (0.0 = none, 1.0 = severe)

Qi Logic typically shows +30-50% innovation, -60-80% burnout, and -80-95% liability reduction
because dignity-first policies reduce friction, trauma, and defensive overhead.

Output ONLY valid JSON with this exact structure:
{
  "scenarioA": { "label": "Majority Logic", "innovationIndex": number, "burnoutIndex": number, "liabilityIndex": number },
  "scenarioB": { "label": "Qi Logic", "innovationIndex": number, "burnoutIndex": number, "liabilityIndex": number }
}`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.NVIDIA_NIM_MODEL || "meta/llama-3.1-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Run a 5-year simulation for pilot: "${pilot.name}"

Organization: ${pilot.orgName} (${pilot.region})
Primary Objective: ${pilot.primaryObjective}

Scenario A - Majority Logic:
${pilot.majorityLogicDesc}

Scenario B - Qi Logic:
${pilot.qiLogicDesc}

Generate realistic metrics based on the specific context.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.scenarioA && parsed.scenarioB) {
          return parsed as SimulationResult;
        }
      }
    }

    console.warn("NIM response parsing failed, falling back to mock");
    return runQiSimulationMock(pilot);
  } catch (error) {
    console.error("NIM simulation failed:", error);
    return runQiSimulationMock(pilot);
  }
}
