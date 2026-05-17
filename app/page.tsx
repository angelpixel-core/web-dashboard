const cards = [
  {
    title: "Accounts",
    detail: "Will render account id, type, and status from gateway-backed API."
  },
  {
    title: "Balances",
    detail: "Will render account_id, asset_code, and available amount with refresh timestamp."
  },
  {
    title: "Recent Ledger Activity",
    detail: "Will render reference, entry_count, workflow status, and correlation_id."
  }
];

export default function WorkflowMonitorPage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Vertical Slice 0-1 · T7 MVP</p>
        <h1>Workflow Monitor</h1>
        <p className="subcopy">
          Eventual consistency applies: balances can lag briefly after ledger posting while async projection converges.
        </p>
      </section>

      <section className="grid">
        {cards.map((card) => (
          <article key={card.title} className="card">
            <h2>{card.title}</h2>
            <p>{card.detail}</p>
            <span className="chip">Status wiring pending</span>
          </article>
        ))}
      </section>
    </main>
  );
}
