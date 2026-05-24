import { NextResponse } from "next/server";
import { loadWorkflowSnapshot } from "@/lib/workflow";
import { withTraceSpan } from "@/lib/trace-span";

export async function GET() {
  const correlationId = `web-dashboard-snapshot-${crypto.randomUUID()}`;
  const snapshot = await withTraceSpan(
    {
      workflow_step: "dashboard_snapshot_route",
      correlation_id: correlationId,
      reference_type: "route",
      reference_id: "/api/workflow/snapshot"
    },
    async () => loadWorkflowSnapshot()
  );
  return NextResponse.json(snapshot);
}
