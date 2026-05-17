export type Account = {
  id: string;
  account_type: string;
  status: string;
};

export type Balance = {
  account_id: string;
  asset_code: string;
  available_amount: string;
};

export type Activity = {
  reference_type: string;
  reference_id: string;
  entry_count: number;
  correlation_id: string;
  workflow_status?: string;
};

export type WorkflowSnapshot = {
  accounts: Account[];
  balances: Balance[];
  activity: Activity[];
  fetched_at: string;
  degraded: boolean;
  message?: string;
};

const GATEWAY_BASE_URL = process.env.API_GATEWAY_BASE_URL || "http://127.0.0.1:3001";

async function gatewayJson<T>(path: string): Promise<T> {
  const response = await fetch(`${GATEWAY_BASE_URL}${path}`, {
    headers: {
      "X-Correlation-ID": `web-dashboard-${crypto.randomUUID()}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`gateway request failed: ${path} status=${response.status}`);
  }

  return (await response.json()) as T;
}

export async function loadWorkflowSnapshot(): Promise<WorkflowSnapshot> {
  const errors: string[] = [];

  const accounts = await gatewayJson<{ accounts?: Account[] }>("/api/v1/accounts")
    .then((r) => r.accounts || [])
    .catch((e: Error) => {
      errors.push(`accounts: ${e.message}`);
      return [];
    });

  const balances = await gatewayJson<{ balances?: Balance[] }>("/api/v1/balances")
    .then((r) => r.balances || [])
    .catch((e: Error) => {
      errors.push(`balances: ${e.message}`);
      return [];
    });

  const activity = await gatewayJson<{ activity?: Activity[] }>("/api/v1/workflow/activity")
    .then((r) => r.activity || [])
    .catch(() => []);

  return {
    accounts,
    balances,
    activity,
    fetched_at: new Date().toISOString(),
    degraded: errors.length > 0,
    message: errors.length > 0 ? errors.join("; ") : undefined
  };
}
