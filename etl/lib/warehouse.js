/**
 * Supabase warehouse client.
 *
 * Writes go through the service-role key: every analytics table is RLS-locked
 * to service-role writes, so the anon key cannot be used here.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function assertConfigured() {
  if (!SUPABASE_URL) throw new Error('SUPABASE_URL / VITE_SUPABASE_URL is not set');
  if (!SERVICE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. The analytics tables are RLS-locked ' +
        'to service-role writes; the anon key will be rejected.'
    );
  }
}

function headers(extra = {}) {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

/**
 * Upsert rows in batches.
 *
 * `onConflict` must name a unique constraint on the table, otherwise
 * PostgREST inserts duplicates instead of merging.
 */
export async function upsert(table, rows, onConflict, batchSize = 500) {
  assertConfigured();
  if (!rows.length) return { written: 0 };

  let written = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const url = `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(batch),
    });
    if (!res.ok) {
      throw new Error(`upsert ${table} ${res.status}: ${(await res.text()).slice(0, 400)}`);
    }
    written += batch.length;
  }
  return { written };
}

export async function select(table, query = '') {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`select ${table} ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
  return res.json();
}

/** Open a sync_runs row. Returns its id so it can be closed. */
export async function startRun(sourceSystem) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sync_runs`, {
    method: 'POST',
    headers: headers({ Prefer: 'return=representation' }),
    body: JSON.stringify([{ source_system: sourceSystem, status: 'running' }]),
  });
  if (!res.ok) throw new Error(`startRun ${res.status}: ${await res.text()}`);
  const [row] = await res.json();
  return row.id;
}

export async function finishRun(id, patch) {
  assertConfigured();
  await fetch(`${SUPABASE_URL}/rest/v1/sync_runs?id=eq.${id}`, {
    method: 'PATCH',
    headers: headers({ Prefer: 'return=minimal' }),
    body: JSON.stringify({ finished_at: new Date().toISOString(), ...patch }),
  });
}

/** The join key across every system: lowercased, trimmed email. */
export function normalizeEmail(email) {
  return typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null;
}

/** Stripe returns unix seconds; Postgres wants ISO. */
export function tsToIso(unixSeconds) {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;
}
