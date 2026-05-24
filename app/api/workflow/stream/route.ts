import { withTraceSpan } from "@/lib/trace-span";

const GATEWAY_BASE_URL = process.env.API_GATEWAY_BASE_URL || "http://127.0.0.1:3001";

export const runtime = "nodejs";

export async function GET() {
  const correlationId = `web-dashboard-stream-${crypto.randomUUID()}`;

  const upstream = await withTraceSpan(
    {
      workflow_step: "dashboard_stream_connect",
      correlation_id: correlationId,
      reference_type: "route",
      reference_id: "/api/workflow/stream"
    },
    async () =>
      fetch(`${GATEWAY_BASE_URL}/api/v1/workflow/stream`, {
        headers: {
          Accept: "text/event-stream",
          "X-Correlation-ID": correlationId
        },
        cache: "no-store"
      }).catch(() => null)
  );

  if (!upstream || !upstream.ok || !upstream.body) {
    return new Response("event: status\ndata: {\"mode\":\"fallback\"}\n\n", {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive"
      }
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
