import type { Activity } from "@/lib/workflow";

export type WorkflowBadgeStatus =
  | "posted"
  | "projected"
  | "event_pending"
  | "event_published"
  | "event_dead"
  | "pending_projection";

export function resolveWorkflowStatus(activity: Activity): WorkflowBadgeStatus {
  const status = activity.workflow_status;

  if (
    status === "posted" ||
    status === "projected" ||
    status === "event_pending" ||
    status === "event_published" ||
    status === "event_dead" ||
    status === "pending_projection"
  ) {
    return status;
  }

  return "pending_projection";
}

export function statusLabel(status: WorkflowBadgeStatus): string {
  switch (status) {
    case "pending_projection":
      return "pending projection";
    case "event_pending":
      return "event pending";
    case "event_published":
      return "event published";
    case "event_dead":
      return "event dead";
    default:
      return status;
  }
}
