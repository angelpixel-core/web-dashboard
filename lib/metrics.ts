type MetricKind = "counter" | "histogram" | "gauge";

export function incrementMetric(name: string, value = 1, labels: Record<string, string> = {}): void {
  emitMetric("counter", name, value, labels);
}

export function observeMetric(name: string, value: number, labels: Record<string, string> = {}): void {
  emitMetric("histogram", name, value, labels);
}

export function setMetric(name: string, value: number, labels: Record<string, string> = {}): void {
  emitMetric("gauge", name, value, labels);
}

function emitMetric(kind: MetricKind, name: string, value: number, labels: Record<string, string>): void {
  console.info(
    JSON.stringify({
      service: "web-dashboard",
      event: `metric.${kind}`,
      metric_name: name,
      value,
      labels,
      timestamp: new Date().toISOString()
    })
  );
}
