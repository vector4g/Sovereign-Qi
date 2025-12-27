// LLM Observability Layer
// Tracks latency, token usage, finish reasons, and model performance

export interface LLMCall {
  id: string;
  timestamp: Date;
  provider: "openai" | "anthropic";
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

class LLMObservability {
  private calls: LLMCall[] = [];
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
  }
}

export const llmObservability = new LLMObservability();

// Wrapper for timing LLM calls
export async function withObservability<T>(
  provider: "openai" | "anthropic",
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
