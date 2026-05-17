import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WorkflowMonitor from "./workflow-monitor";
import type { WorkflowSnapshot } from "@/lib/workflow";

class MockEventSource {
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;

  static instance: MockEventSource | null = null;

  constructor(_url: string) {
    MockEventSource.instance = this;
  }

  close() {}
}

const snapshot: WorkflowSnapshot = {
  accounts: [{ id: "acc-1", account_type: "user", status: "active" }],
  balances: [{ account_id: "acc-1", asset_code: "USD", available_amount: "100.00" }],
  activity: [{ reference_type: "transfer", reference_id: "ref-1", entry_count: 2, correlation_id: "corr-1" }],
  fetched_at: new Date().toISOString(),
  degraded: false
};

describe("WorkflowMonitor", () => {
  beforeEach(() => {
    vi.stubGlobal("EventSource", MockEventSource as unknown as typeof EventSource);
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders panel data and correlation id", () => {
    render(<WorkflowMonitor initialSnapshot={snapshot} />);

    expect(screen.getByText("Accounts (1)")).toBeInTheDocument();
    expect(screen.getByText("Balances (1)")).toBeInTheDocument();
    expect(screen.getByText(/corr=corr-1/)).toBeInTheDocument();
    expect(screen.getByText("pending projection")).toBeInTheDocument();
  });

  it("switches to fallback mode on SSE error and polls snapshot", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...snapshot, degraded: true, message: "accounts unavailable" })
    });

    vi.stubGlobal(
      "fetch",
      fetchSpy
    );

    render(<WorkflowMonitor initialSnapshot={snapshot} />);

    MockEventSource.instance?.onerror?.();

    await vi.advanceTimersByTimeAsync(12000);
    await Promise.resolve();
    await Promise.resolve();

    expect(fetchSpy).toHaveBeenCalled();
    expect(screen.getByText("Fallback polling")).toBeInTheDocument();
    expect(screen.getByText(/Data degraded:/)).toBeInTheDocument();
  });
});
