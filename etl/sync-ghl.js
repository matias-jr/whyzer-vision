/**
 * GHL -> warehouse sync (contacts + attribution touches).
 *
 * GHL is the source of truth for contact identity and lifecycle tags, and it
 * is where the first-party attribution capture ends up: the checkout links
 * built in src/lib/attribution.ts carry utm_*, wz_ft_* and wz_vid, and GHL
 * records the landing URL verbatim in attributions[].
 *
 * The touch-resolution logic is NOT reimplemented here. api/_attribution-lib.js
 * already handles three defects observed in production (self-referral from our
 * own domain, campaign casing drift, empty UTM custom fields) and is covered by
 * tests, so it is imported directly.
 *
 * GHL's own `source` string is stored but never trusted for attribution: it
 * reports every checkout as "Referral" because the referrer is whyzer.ai.
 *
 * Usage:
 *   node etl/sync-ghl.js            # incremental (last 30 days)
 *   node etl/sync-ghl.js --full     # full history backfill
 */

import {
  fetchAllContacts,
  resolveContactAttribution,
  utmsFromUrl,
  classifyChannel,
} from '../api/_attribution-lib.js';
import { upsert, startRun, finishRun, normalizeEmail } from './lib/warehouse.js';

const GHL_TOKEN = process.env.GHL_TOKEN;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

function assertConfigured() {
  if (!GHL_TOKEN || !GHL_LOCATION_ID) {
    throw new Error('GHL_TOKEN / GHL_LOCATION_ID are not set');
  }
}

function leadRow(contact) {
  return {
    ghl_contact_id: contact.id,
    email: normalizeEmail(contact.email),
    name: contact.contactName || null,
    contact_type: contact.type || null,
    tags: Array.isArray(contact.tags) ? contact.tags.map((t) => String(t).toLowerCase()) : [],
    ghl_source: contact.source || null,
    created_at: contact.dateAdded || new Date().toISOString(),
    raw: contact,
    synced_at: new Date().toISOString(),
  };
}

/**
 * One row per resolved touch. The unique key is (contact, touch_type), so a
 * re-sync updates a contact's touches rather than duplicating them.
 */
function attributionRows(resolved, contact) {
  const rows = [];
  const email = normalizeEmail(contact.email);

  for (const touchType of ['first', 'last']) {
    const touch = resolved[touchType];
    if (!touch) continue;

    // Click ids and wz_vid live in the landing page query string.
    const fromUrl = utmsFromUrl(touch.landingPage || '');

    // Channel is classified by the existing production logic rather than a
    // raw utm_source lookup: it resolves by medium, guards organic LinkedIn
    // against the paid rule, and separates internal CRM imports from real
    // acquisition. `signal` records which rule fired, so a surprising channel
    // can be explained instead of being a black box.
    const { channel, signal } = classifyChannel(resolved, touchType);

    rows.push({
      email,
      visitor_id: touch.visitorId ?? fromUrl.visitor_id ?? null,
      ghl_contact_id: contact.id,
      touch_type: touchType,
      channel,
      channel_signal: signal,
      utm_source: touch.source,
      utm_medium: touch.medium,
      utm_campaign: touch.campaign,
      utm_content: fromUrl.utm_content ?? null,
      landing_page: touch.landingPage,
      referrer: touch.referrer,
      li_fat_id: touch.clickIds?.li_fat_id ?? null,
      gclid: touch.clickIds?.gclid ?? null,
      fbclid: fromUrl.fbclid ?? null,
      self_referral_corrected: Boolean(touch.selfReferralCorrected),
      journey_lost: Boolean(touch.journeyLost),
      occurred_at: contact.dateAdded || null,
      source_system: 'ghl',
      raw: touch,
      synced_at: new Date().toISOString(),
    });
  }
  return rows;
}

export async function syncGhl({ full = false } = {}) {
  assertConfigured();
  const runId = await startRun('ghl');
  try {
    const since = full ? null : Date.now() - 30 * 86400 * 1000;
    const contacts = await fetchAllContacts({
      token: GHL_TOKEN,
      locationId: GHL_LOCATION_ID,
      since,
      maxPages: full ? 400 : 50,
    });

    const leads = contacts.map(leadRow);
    const touches = contacts.flatMap((c) => attributionRows(resolveContactAttribution(c), c));

    const leadRes = await upsert('leads', leads, 'ghl_contact_id');
    const touchRes = await upsert('attribution_events', touches, 'ghl_contact_id,touch_type');

    const journeyLost = touches.filter((t) => t.journey_lost).length;
    const corrected = touches.filter((t) => t.self_referral_corrected).length;
    const noSource = touches.filter((t) => !t.utm_source).length;

    await finishRun(runId, {
      status: 'success',
      records_read: contacts.length,
      records_written: leadRes.written + touchRes.written,
      notes: {
        full,
        leads: leadRes.written,
        touches: touchRes.written,
        journey_lost: journeyLost,
        self_referral_corrected: corrected,
        touches_without_source: noSource,
      },
    });

    return {
      contacts: contacts.length,
      leads: leadRes.written,
      touches: touchRes.written,
      journeyLost,
      corrected,
    };
  } catch (err) {
    await finishRun(runId, { status: 'error', error_message: String(err.message ?? err) });
    throw err;
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMain) {
  syncGhl({ full: process.argv.includes('--full') })
    .then((r) => {
      console.log(
        `ghl sync ok: ${r.contacts} contacts, ${r.leads} leads, ${r.touches} touches ` +
          `(journey lost ${r.journeyLost}, self-referral corrected ${r.corrected})`
      );
    })
    .catch((e) => {
      console.error('ghl sync failed:', e.message);
      process.exit(1);
    });
}
