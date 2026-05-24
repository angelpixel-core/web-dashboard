type SpanParams = {
  workflow_step: string;
  correlation_id: string;
  reference_type?: string;
  reference_id?: string;
};

export async function withTraceSpan<T>(params: SpanParams, fn: () => Promise<T>): Promise<T> {
  const startedAt = Date.now();

  try {
    const result = await fn();
    emit("completed", params, Date.now() - startedAt);
    return result;
  } catch (error) {
    emit("failed", params, Date.now() - startedAt, error instanceof Error ? error.name : "unknown_error");
    throw error;
  }
}

function emit(status: "completed" | "failed", params: SpanParams, durationMs: number, errorCode?: string): void {
  console.info(
    JSON.stringify({
      service: "web-dashboard",
      event: "trace.span",
      status,
      correlation_id: params.correlation_id,
      workflow_step: params.workflow_step,
      reference_type: params.reference_type,
      reference_id: params.reference_id,
      duration_ms: durationMs,
      error_code: errorCode,
      timestamp: new Date().toISOString()
    })
  );
}
