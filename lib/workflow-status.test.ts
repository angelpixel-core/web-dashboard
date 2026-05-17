import { describe, expect, it } from "vitest";
import { resolveWorkflowStatus, statusLabel } from "@/lib/workflow-status";

describe("workflow status mapping", () => {
  it("maps unknown status to pending projection", () => {
    const status = resolveWorkflowStatus({
      reference_type: "transfer",
      reference_id: "r1",
      entry_count: 2,
      correlation_id: "c1"
    });

    expect(status).toBe("pending_projection");
  });

  it("keeps known event status", () => {
    const status = resolveWorkflowStatus({
      reference_type: "transfer",
      reference_id: "r2",
      entry_count: 2,
      correlation_id: "c2",
      workflow_status: "event_published"
    });

    expect(status).toBe("event_published");
    expect(statusLabel(status)).toBe("event published");
  });
});
