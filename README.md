# Web Dashboard (T7 MVP)

Next.js dashboard surface for Vertical Slice 0-1 workflow visibility.

## Scope

- Workflow Monitor page (accounts, balances, recent ledger activity).
- Correlation ID visibility for operations.
- Eventual-consistency messaging for async balance projection.
- Transport model: REST initial snapshot + SSE updates + fallback polling.

## Configuration

- `API_GATEWAY_BASE_URL` (default: `http://127.0.0.1:3001`)

## Security Audit Note

- Current runtime is pinned to `next@16.2.6` (patched from earlier vulnerable `16.2.0`).
- `npm audit` may still report a moderate `postcss` advisory through Next.js transitive mapping.
- The suggested `npm audit fix --force` path is unsafe for this project because it proposes a breaking downgrade to `next@9.3.3`.
- Policy for this repo: keep patched Next.js release line (`16.2.x` or newer) and upgrade when upstream publishes a non-breaking transitive fix.

## Run

```bash
npm install
npm run dev
```
