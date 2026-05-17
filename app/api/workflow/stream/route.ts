const GATEWAY_BASE_URL = process.env.API_GATEWAY_BASE_URL || "http://127.0.0.1:3001";

export const runtime = "nodejs";

export async function GET() {
  const upstream = await fetch(`${GATEWAY_BASE_URL}/api/v1/workflow/stream`, {
    headers: {
      Accept: "text/event-stream",
      "X-Correlation-ID": `web-dashboard-stream-${crypto.randomUUID()}`
    },
    cache: "no-store"
  }).catch(() => null);

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
