import { NextResponse } from "next/server";
import { loadWorkflowSnapshot } from "@/lib/workflow";

export async function GET() {
  const snapshot = await loadWorkflowSnapshot();
  return NextResponse.json(snapshot);
}
