# Web Dashboard (T7 MVP)

Next.js dashboard surface for Vertical Slice 0-1 workflow visibility.

## Scope

- Workflow Monitor page (accounts, balances, recent ledger activity).
- Correlation ID visibility for operations.
- Eventual-consistency messaging for async balance projection.
- Transport model: REST initial snapshot + SSE updates + fallback polling.

## Configuration

- `API_GATEWAY_BASE_URL` (default: `http://127.0.0.1:3001`)

## Run

```bash
npm install
npm run dev
```
