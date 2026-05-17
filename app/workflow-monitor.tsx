"use client";

import { useEffect, useMemo, useState } from "react";
import type { WorkflowSnapshot } from "@/lib/workflow";

type Props = {
  initialSnapshot: WorkflowSnapshot;
};

type StreamMode = "connecting" | "sse" | "fallback";

const FALLBACK_POLL_MS = 12000;

function fmt(ts: string) {
  return new Date(ts).toLocaleTimeString();
}

export default function WorkflowMonitor({ initialSnapshot }: Props) {
  const [snapshot, setSnapshot] = useState<WorkflowSnapshot>(initialSnapshot);
  const [streamMode, setStreamMode] = useState<StreamMode>("connecting");

  useEffect(() => {
    let pollTimer: ReturnType<typeof setInterval> | undefined;
    let closed = false;

    const startFallbackPolling = () => {
      setStreamMode("fallback");
      if (pollTimer) return;
      pollTimer = setInterval(async () => {
        const response = await fetch("/api/workflow/snapshot", { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as WorkflowSnapshot;
        if (!closed) setSnapshot(next);
      }, FALLBACK_POLL_MS);
    };

    const stream = new EventSource("/api/workflow/stream");

    stream.onopen = () => {
      setStreamMode("sse");
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = undefined;
      }
    };

    stream.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as Partial<WorkflowSnapshot>;
        if (payload.accounts || payload.balances || payload.activity) {
          setSnapshot((prev) => ({
            accounts: payload.accounts ?? prev.accounts,
            balances: payload.balances ?? prev.balances,
            activity: payload.activity ?? prev.activity,
            fetched_at: payload.fetched_at ?? new Date().toISOString(),
            degraded: payload.degraded ?? prev.degraded,
            message: payload.message ?? prev.message
          }));
        }
      } catch {
        startFallbackPolling();
      }
    };

    stream.onerror = () => {
      startFallbackPolling();
    };

    return () => {
      closed = true;
      stream.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  const streamLabel = useMemo(() => {
    if (streamMode === "sse") return "SSE connected";
    if (streamMode === "fallback") return "Fallback polling";
    return "Connecting stream";
  }, [streamMode]);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Vertical Slice 0-1 · T7 MVP</p>
        <h1>Workflow Monitor</h1>
        <p className="subcopy">
          Balances may lag briefly after posting due to asynchronous projection. Transport: initial REST snapshot, SSE updates,
          fallback polling.
        </p>
      </section>

      <section className="status-row">
        <span className="chip">{streamLabel}</span>
        <span className="meta">Last refresh: {fmt(snapshot.fetched_at)}</span>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Accounts ({snapshot.accounts.length})</h2>
          <ul>
            {snapshot.accounts.slice(0, 8).map((account) => (
              <li key={account.id}>
                <strong>{account.id}</strong>
                <span>{account.account_type}</span>
                <span>{account.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Balances ({snapshot.balances.length})</h2>
          <ul>
            {snapshot.balances.slice(0, 8).map((balance) => (
              <li key={`${balance.account_id}-${balance.asset_code}`}>
                <strong>{balance.account_id}</strong>
                <span>{balance.asset_code}</span>
                <span>{balance.available_amount}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Recent Activity ({snapshot.activity.length})</h2>
          <ul>
            {snapshot.activity.slice(0, 10).map((item) => (
              <li key={`${item.reference_type}-${item.reference_id}-${item.correlation_id}`}>
                <strong>
                  {item.reference_type}:{item.reference_id}
                </strong>
                <span>entries={item.entry_count}</span>
                <span>{item.workflow_status || "posted"}</span>
                <span>corr={item.correlation_id}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
