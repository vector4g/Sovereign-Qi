// LLM Observability Layer
// Tracks latency, token usage, finish reasons, and model performance

export interface LLMCall {
  id: string;
  timestamp: Date;
  provider: "openai" | "anthropic" | "cohere" | "hume" | "hermes" | "nvidia" | "mistral" | "gemini" | "alan" | "llama";
  model: string;
  endpoint: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  finishReason: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface LLMMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  callsByProvider: Record<string, number>;
  callsByModel: Record<string, number>;
  finishReasons: Record<string, number>;
  errorTypes: Record<string, number>;
}

export interface DeliberationRecord {
  id: string;
  timestamp: Date;
  participatingAgents: string[];
  failedAgents: string[];
  consensusLevel: "unanimous" | "majority" | "plurality" | "single" | "veto";
  finalStatus: "APPROVE" | "REVISE" | "BLOCK";
  statusVotes: Record<"APPROVE" | "REVISE" | "BLOCK", string[]>;
  totalLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  challengeCount: number;
  affirmCount: number;
  challengeTypeCount: number;
  nuanceCount: number;
}

export interface DeliberationMetrics {
  totalDeliberations: number;
  avgParticipants: number;
  consensusDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  avgLatencyMs: number;
  agentParticipationRate: Record<string, number>;
  agentFailureRate: Record<string, number>;
  avgChallenges: number;
  avgAffirmations: number;
  avgNuances: number;
}

class LLMObservability {
  private calls: LLMCall[] = [];
  private deliberations: DeliberationRecord[] = [];
  private maxHistorySize = 1000;

  recordCall(call: Omit<LLMCall, "id" | "timestamp">): LLMCall {
    const fullCall: LLMCall = {
      ...call,
      id: `llm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(),
    };

    this.calls.push(fullCall);

    // Trim history if needed
    if (this.calls.length > this.maxHistorySize) {
      this.calls = this.calls.slice(-this.maxHistorySize);
    }

    // Log to console for monitoring
    console.log(`[LLM] ${call.provider}/${call.model} | ${call.latencyMs}ms | ${call.totalTokens} tokens | ${call.finishReason} | ${call.success ? "OK" : "FAIL"}`);

    return fullCall;
  }

  getMetrics(sinceMs: number = 3600000): LLMMetrics {
    const cutoff = Date.now() - sinceMs;
    const recentCalls = this.calls.filter(c => c.timestamp.getTime() > cutoff);

    const metrics: LLMMetrics = {
      totalCalls: recentCalls.length,
      successfulCalls: recentCalls.filter(c => c.success).length,
      failedCalls: recentCalls.filter(c => !c.success).length,
      avgLatencyMs: 0,
      p95LatencyMs: 0,
      p99LatencyMs: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      callsByProvider: {},
      callsByModel: {},
      finishReasons: {},
      errorTypes: {},
    };

    if (recentCalls.length === 0) return metrics;

    // Calculate latency percentiles
    const latencies = recentCalls.map(c => c.latencyMs).sort((a, b) => a - b);
    metrics.avgLatencyMs = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    metrics.p95LatencyMs = latencies[Math.floor(latencies.length * 0.95)] || 0;
    metrics.p99LatencyMs = latencies[Math.floor(latencies.length * 0.99)] || 0;

    // Aggregate token usage
    for (const call of recentCalls) {
      metrics.totalInputTokens += call.inputTokens;
      metrics.totalOutputTokens += call.outputTokens;

      // Count by provider
      metrics.callsByProvider[call.provider] = (metrics.callsByProvider[call.provider] || 0) + 1;

      // Count by model
      metrics.callsByModel[call.model] = (metrics.callsByModel[call.model] || 0) + 1;

      // Count finish reasons
      metrics.finishReasons[call.finishReason] = (metrics.finishReasons[call.finishReason] || 0) + 1;

      // Count errors
      if (call.error) {
        const errorType = call.error.split(":")[0] || "unknown";
        metrics.errorTypes[errorType] = (metrics.errorTypes[errorType] || 0) + 1;
      }
    }

    return metrics;
  }

  getRecentCalls(limit: number = 50): LLMCall[] {
    return this.calls.slice(-limit);
  }

  clear() {
    this.calls = [];
    this.deliberations = [];
  }

  recordDeliberation(record: Omit<DeliberationRecord, "id" | "timestamp">): DeliberationRecord {
    const fullRecord: DeliberationRecord = {
      ...record,
      id: `delib-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(),
    };

    this.deliberations.push(fullRecord);

    if (this.deliberations.length > this.maxHistorySize) {
      this.deliberations = this.deliberations.slice(-this.maxHistorySize);
    }

    console.log(`[Deliberation] ${record.participatingAgents.length} agents | ${record.consensusLevel} consensus | ${record.finalStatus} | ${record.totalLatencyMs}ms`);
    console.log(`  Challenges: ${record.challengeCount} (affirm: ${record.affirmCount}, challenge: ${record.challengeTypeCount}, nuance: ${record.nuanceCount})`);

    return fullRecord;
  }

  getDeliberationMetrics(sinceMs: number = 3600000): DeliberationMetrics {
    const cutoff = Date.now() - sinceMs;
    const recentDeliberations = this.deliberations.filter(d => d.timestamp.getTime() > cutoff);

    const metrics: DeliberationMetrics = {
      totalDeliberations: recentDeliberations.length,
      avgParticipants: 0,
      consensusDistribution: {},
      statusDistribution: {},
      avgLatencyMs: 0,
      agentParticipationRate: {},
      agentFailureRate: {},
      avgChallenges: 0,
      avgAffirmations: 0,
      avgNuances: 0,
    };

    if (recentDeliberations.length === 0) return metrics;

    let totalParticipants = 0;
    let totalLatency = 0;
    let totalChallenges = 0;
    let totalAffirmations = 0;
    let totalNuances = 0;
    const agentParticipation: Record<string, number> = {};
    const agentFailures: Record<string, number> = {};

    for (const delib of recentDeliberations) {
      totalParticipants += delib.participatingAgents.length;
      totalLatency += delib.totalLatencyMs;
      totalChallenges += delib.challengeCount;
      totalAffirmations += delib.affirmCount;
      totalNuances += delib.nuanceCount;

      metrics.consensusDistribution[delib.consensusLevel] = 
        (metrics.consensusDistribution[delib.consensusLevel] || 0) + 1;
      metrics.statusDistribution[delib.finalStatus] = 
        (metrics.statusDistribution[delib.finalStatus] || 0) + 1;

      for (const agent of delib.participatingAgents) {
        agentParticipation[agent] = (agentParticipation[agent] || 0) + 1;
      }
      for (const agent of delib.failedAgents) {
        agentFailures[agent] = (agentFailures[agent] || 0) + 1;
      }
    }

    metrics.avgParticipants = Math.round((totalParticipants / recentDeliberations.length) * 10) / 10;
    metrics.avgLatencyMs = Math.round(totalLatency / recentDeliberations.length);
    metrics.avgChallenges = Math.round((totalChallenges / recentDeliberations.length) * 10) / 10;
    metrics.avgAffirmations = Math.round((totalAffirmations / recentDeliberations.length) * 10) / 10;
    metrics.avgNuances = Math.round((totalNuances / recentDeliberations.length) * 10) / 10;

    for (const [agent, count] of Object.entries(agentParticipation)) {
      metrics.agentParticipationRate[agent] = Math.round((count / recentDeliberations.length) * 100);
    }
    for (const [agent, count] of Object.entries(agentFailures)) {
      metrics.agentFailureRate[agent] = Math.round((count / recentDeliberations.length) * 100);
    }

    return metrics;
  }

  getRecentDeliberations(limit: number = 20): DeliberationRecord[] {
    return this.deliberations.slice(-limit);
  }
}

export const llmObservability = new LLMObservability();

// Wrapper for timing LLM calls
export async function withObservability<T>(
  provider: "openai" | "anthropic" | "cohere" | "hume" | "hermes" | "nvidia" | "mistral" | "gemini",
  model: string,
  endpoint: string,
  fn: () => Promise<{ result: T; usage?: { inputTokens: number; outputTokens: number }; finishReason?: string }>
): Promise<T> {
  const startTime = Date.now();
  let success = false;
  let error: string | undefined;
  let inputTokens = 0;
  let outputTokens = 0;
  let finishReason = "unknown";

  try {
    const response = await fn();
    success = true;
    inputTokens = response.usage?.inputTokens || 0;
    outputTokens = response.usage?.outputTokens || 0;
    finishReason = response.finishReason || "stop";
    return response.result;
  } catch (err: any) {
    error = err.message || String(err);
    finishReason = "error";
    throw err;
  } finally {
    llmObservability.recordCall({
      provider,
      model,
      endpoint,
      latencyMs: Date.now() - startTime,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      finishReason,
      success,
      error,
    });
  }
}
