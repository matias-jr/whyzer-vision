import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import bf26 from '../../api/bf26.js';
import { ASSESSMENT_COMP_TAG, ASSESSMENT_INIT_TAG, locationFromHeaders } from '../../api/_assessment2027.js';

const mockRes = () => {
  const res: { statusCode?: number; body?: unknown; status: (c: number) => typeof res; json: (b: unknown) => typeof res; setHeader: () => void } = {
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; },
    setHeader() {},
  };
  return res;
};

describe('assessment 2027 GHL sync (via /api/bf26)', () => {
  const calls: { url: string; init: RequestInit }[] = [];
  beforeEach(() => {
    calls.length = 0;
    process.env.GHL_BF26_TOKEN = 'tok';
    process.env.GHL_LOCATION_ID = 'loc';
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ contact: { id: 'c1' } }), { status: 200 });
    }));
  });
  afterEach(() => vi.unstubAllGlobals());

  const run = async (body: Record<string, unknown>, headers: Record<string, string> = {}) => {
    const res = mockRes();
    await bf26({ method: 'POST', body, headers }, res);
    return res;
  };

  it('init: upserts the contact with location and adds only the init tag', async () => {
    const res = await run(
      { form: 'assessment-2027', stage: 'init', firstName: ' Sarah ', email: 'Sarah@Co.com' },
      { 'x-vercel-ip-country': 'gb', 'x-vercel-ip-city': 'Bristol' },
    );
    expect(res.statusCode).toBe(200);
    expect(calls).toHaveLength(2);
    const upsert = JSON.parse(calls[0].init.body as string);
    expect(calls[0].url).toMatch(/contacts\/upsert$/);
    expect(upsert).toMatchObject({ locationId: 'loc', firstName: 'Sarah', email: 'sarah@co.com', country: 'GB', city: 'Bristol', source: 'Academy Skills Assessment 2027' });
    expect(calls[1].url).toMatch(/contacts\/c1\/tags$/);
    expect(JSON.parse(calls[1].init.body as string)).toEqual({ tags: [ASSESSMENT_INIT_TAG] });
    expect(ASSESSMENT_INIT_TAG).toBe('2027 assessment init');
  });

  it('comp: adds only the comp tag', async () => {
    const res = await run({ form: 'assessment-2027', stage: 'comp', firstName: 'Sarah', email: 'sarah@co.com' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(calls[1].init.body as string)).toEqual({ tags: [ASSESSMENT_COMP_TAG] });
    expect(ASSESSMENT_COMP_TAG).toBe('2027 assessment comp');
  });

  it('comp: writes each skill label to its GHL custom field, init sends none', async () => {
    const results = { biz: 'Strong foundation', disc: 'Solid foundation', value: 'Developing', cons: 'Priority to develop', risk: 'Developing' };
    await run({ form: 'assessment-2027', stage: 'comp', firstName: 'Sarah', email: 'sarah@co.com', results });
    expect(JSON.parse(calls[0].init.body as string).customFields).toEqual([
      { id: 'Rl0muXrHNHzEYeyIP07P', field_value: 'Strong foundation' },
      { id: 'K3tLtmtaCD6MH2B8hF6U', field_value: 'Solid foundation' },
      { id: '1yUZ0wdQclz3lx10cENa', field_value: 'Developing' },
      { id: 'mznF3kSUwUspGkf2CIW4', field_value: 'Priority to develop' },
      { id: 'OwtqysVFGOY2axwk20Ay', field_value: 'Developing' },
    ]);
    calls.length = 0;
    await run({ form: 'assessment-2027', stage: 'init', firstName: 'Sarah', email: 'sarah@co.com', results });
    expect(JSON.parse(calls[0].init.body as string)).not.toHaveProperty('customFields');
  });

  it('drops labels the GHL dropdowns would not accept', async () => {
    await run({ form: 'assessment-2027', stage: 'comp', firstName: 'S', email: 'sarah@co.com', results: { biz: '87%', disc: 'Developing' } });
    expect(JSON.parse(calls[0].init.body as string).customFields).toEqual([{ id: 'K3tLtmtaCD6MH2B8hF6U', field_value: 'Developing' }]);
  });

  it('does not send location it does not have', async () => {
    await run({ form: 'assessment-2027', stage: 'init', firstName: 'Sarah', email: 'sarah@co.com' });
    const upsert = JSON.parse(calls[0].init.body as string);
    expect(upsert).not.toHaveProperty('country');
    expect(upsert).not.toHaveProperty('city');
  });

  it('honeypot gets a fake success and never reaches GHL', async () => {
    const res = await run({ form: 'assessment-2027', stage: 'init', firstName: 'Bot', email: 'b@x.com', website: 'spam.com' });
    expect(res.statusCode).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it('rejects bad input without calling GHL', async () => {
    expect((await run({ form: 'assessment-2027', stage: 'init', firstName: '', email: 'a@b.co' })).statusCode).toBe(400);
    expect((await run({ form: 'assessment-2027', stage: 'init', firstName: 'A', email: 'nope' })).statusCode).toBe(400);
    expect((await run({ form: 'assessment-2027', stage: 'other', firstName: 'A', email: 'a@b.co' })).statusCode).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('returns 502 and no tag when the upsert fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 500 })));
    const res = await run({ form: 'assessment-2027', stage: 'init', firstName: 'Sarah', email: 'sarah@co.com' });
    expect(res.statusCode).toBe(502);
  });

  it('leaves the Black Friday sign-up untouched', async () => {
    const res = await run({ firstName: 'Sam', email: 'sam@co.com', consent: true });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(calls[1].init.body as string)).toEqual({ tags: ['bf26-waitlist'] });
  });
});

describe('locationFromHeaders', () => {
  it('decodes the city and ignores a malformed country', () => {
    expect(locationFromHeaders({ 'x-vercel-ip-country': 'US', 'x-vercel-ip-city': 'S%C3%A3o%20Paulo' })).toEqual({ country: 'US', city: 'São Paulo' });
    expect(locationFromHeaders({ 'x-vercel-ip-country': 'USA' })).toEqual({});
  });
});
