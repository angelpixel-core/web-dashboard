import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import WorkflowMonitor from "./workflow-monitor";

describe("workflow monitor smoke", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("loads core dashboard sections", () => {
    vi.stubGlobal("EventSource", class {
      close() {}
    });

    render(
      <WorkflowMonitor
        initialSnapshot={{
          accounts: [],
          balances: [],
          activity: [],
          fetched_at: new Date().toISOString(),
          degraded: false
        }}
      />
    );

    expect(screen.getByText("Workflow Monitor")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Accounts/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Balances/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Recent Activity/ })).toBeInTheDocument();
  });
});
