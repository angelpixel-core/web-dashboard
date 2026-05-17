import WorkflowMonitor from "./workflow-monitor";
import { loadWorkflowSnapshot } from "@/lib/workflow";

export default async function WorkflowMonitorPage() {
  const initialSnapshot = await loadWorkflowSnapshot();
  return <WorkflowMonitor initialSnapshot={initialSnapshot} />;
}
