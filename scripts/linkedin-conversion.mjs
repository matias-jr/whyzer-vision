#!/usr/bin/env node
/**
 * Creates (or lists) LinkedIn Conversions API conversion rules and prints the
 * numeric id you need for LINKEDIN_WEBINAR_CONVERSION_ID.
 *
 * Campaign Manager does not reliably expose that id in its UI, so this asks
 * the API directly. Run it with the access token in the environment:
 *
 *   LINKEDIN_ACCESS_TOKEN=... node scripts/linkedin-conversion.mjs accounts
 *   LINKEDIN_ACCESS_TOKEN=... node scripts/linkedin-conversion.mjs list <accountId>
 *   LINKEDIN_ACCESS_TOKEN=... node scripts/linkedin-conversion.mjs create <accountId> "Webinar Replay Reached"
 *
 * The token is read from the environment and never written to disk.
 */

const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const VERSION = '202603';

if (!TOKEN) {
  console.error('Set LINKEDIN_ACCESS_TOKEN in the environment first.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Linkedin-Version': VERSION,
  'X-Restli-Protocol-Version': '2.0.0',
  'Content-Type': 'application/json',
};

async function call(url, init = {}) {
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status}\n${text}`);
    process.exit(1);
  }
  return text ? JSON.parse(text) : {};
}

const [cmd, arg1, arg2] = process.argv.slice(2);

async function main() {
  if (cmd === 'accounts') {
    const data = await call('https://api.linkedin.com/rest/adAccounts?q=search');
    const rows = data.elements ?? [];
    if (!rows.length) return console.log('No ad accounts visible to this token.');
    console.log('Ad accounts:');
    for (const a of rows) {
      console.log(`  ${String(a.id).padEnd(12)} ${a.name ?? '(unnamed)'}  [${a.status ?? '?'}]`);
    }
    console.log('\nNext: node scripts/linkedin-conversion.mjs list <accountId>');
  } else if (cmd === 'list') {
    if (!arg1) return console.error('Usage: list <accountId>');
    const url = `https://api.linkedin.com/rest/conversions?q=account&account=${encodeURIComponent(
      `urn:li:sponsoredAccount:${arg1}`,
    )}`;
    const data = await call(url);
    const rows = data.elements ?? [];
    if (!rows.length) return console.log('No conversions on this account yet.');
    console.log('Conversions:');
    for (const c of rows) {
      const id = String(c.id ?? '').split(':').pop();
      console.log(`  ${String(id).padEnd(12)} ${c.name ?? '(unnamed)'}  type=${c.type ?? '?'}  enabled=${c.enabled}`);
    }
    console.log('\nUse the id of the Conversions API rule (type CONVERSIONS_API).');
  } else if (cmd === 'create') {
    if (!arg1) return console.error('Usage: create <accountId> "Conversion name"');
    const name = arg2 || 'Webinar Replay Reached';
    const body = {
      name,
      account: `urn:li:sponsoredAccount:${arg1}`,
      conversionMethod: 'CONVERSIONS_API',
      postClickAttributionWindowSize: 30,
      viewThroughAttributionWindowSize: 7,
      attributionType: 'LAST_TOUCH_BY_CAMPAIGN',
      type: 'LEAD',
      enabled: true,
    };
    const data = await call('https://api.linkedin.com/rest/conversions', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const id = String(data.id ?? '').split(':').pop();
    console.log(`Created "${name}"`);
    console.log(`\nLINKEDIN_WEBINAR_CONVERSION_ID = ${id}\n`);
    console.log('Then assign it to your ad sets in Campaign Manager.');
  } else {
    console.log('Usage:\n  accounts\n  list <accountId>\n  create <accountId> "Name"');
  }
}

await main();
