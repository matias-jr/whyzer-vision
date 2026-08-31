import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type SourceRow = {
  source: string;
  contacts: number;
  customers: number;
  conversionRate: number;
};

type CampaignRow = SourceRow & { campaign: string; medium: string | null };

type LostCustomer = {
  contactId: string;
  email: string | null;
  name: string | null;
  dateAdded: string | null;
  source: string | null;
  landingPage: string | null;
};

type RevenueSourceRow = {
  source: string;
  revenue: number;
  transactions: number;
  trials: number;
  customers: number;
  revenuePerCustomer: number;
};

type RevenueCampaignRow = RevenueSourceRow & { campaign: string; medium: string | null };

type UnattributedPayer = {
  contactId: string;
  name: string | null;
  email: string | null;
  amount: number;
  checkoutPage: string | null;
  createdAt: string | null;
};

type RevenueReport = {
  model: 'first' | 'last';
  currency: string;
  windowDays: number;
  payersResolved: number;
  totals: {
    revenue: number;
    refunded: number;
    transactions: number;
    failed: number;
    trials: number;
    unmatchedTransactions: number;
    unattributedRevenue: number;
    attributedRevenueShare: number;
  };
  bySource: RevenueSourceRow[];
  byCampaign: RevenueCampaignRow[];
  unattributedPayers: UnattributedPayer[];
};

type SubsSourceRow = {
  source: string;
  activeSubscriptions: number;
  churnedSubscriptions: number;
  pendingTrials: number;
  realizedRevenue: number;
  annualRunRate: number;
  projectedTrialRevenue: number;
};

type PendingTrial = {
  subscriptionId: string;
  contactName: string | null;
  contactEmail: string | null;
  source: string;
  campaign: string;
  projectedValue: number;
  startedAt: string | null;
};

type SubsReport = {
  model: 'first' | 'last';
  currency: string;
  trialConversionRate: number;
  historyDays: number;
  totals: {
    subscriptions: number;
    active: number;
    churned: number;
    pendingTrials: number;
    realizedRevenue: number;
    annualRunRate: number;
    projectedTrialRevenue: number;
    retentionRate: number;
  };
  bySource: SubsSourceRow[];
  pendingTrialList: PendingTrial[];
};

type ChannelRow = {
  channel: string;
  contacts: number;
  customers: number;
  revenue: number;
  conversionRate: number;
  exampleSignals: string[];
  isAcquisition: boolean;
};

type ChannelReport = {
  model: 'first' | 'last';
  currency: string;
  windowDays: number;
  paidUnderReporting: boolean;
  summary: {
    paidContacts: number;
    organicContacts: number;
    acquisitionContacts: number;
    paidShare: number;
    organicShare: number;
    paidRevenue: number;
    organicRevenue: number;
    paidRevenueShare: number;
    totalContacts: number;
  };
  byChannel: ChannelRow[];
};

type ContactRow = {
  name: string;
  email: string;
  channel: string;
  source: string;
  campaign: string;
  landingPage: string;
  customer: string;
  revenue: number;
  dateAdded: string;
  contactId: string;
};

type ContactList = {
  channel: string;
  total: number;
  customers: number;
  revenue: number;
  returned: number;
  contacts: ContactRow[];
};

type Report = {
  model: 'first' | 'last';
  windowDays: number;
  generatedAt: string;
  totals: {
    contacts: number;
    customers: number;
    unattributed: number;
    journeyLost: number;
    selfReferralCorrected: number;
    attributionCoverage: number;
  };
  bySource: SourceRow[];
  byCampaign: CampaignRow[];
  lostCustomers: LostCustomer[];
};

const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

const money = (n: number, currency = 'usd') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(n);

/** Synthetic buckets are wrapped in parens by the API. */
const isFallback = (source: string) => source.startsWith('(');

function Stat({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'warn';
}) {
  return (
    <div className="border border-foreground/10 rounded p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary mb-2">
        {label}
      </p>
      <p
        className={`font-display text-3xl tracking-tight ${
          tone === 'warn' ? 'text-amber-500' : ''
        }`}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-text-secondary mt-2 leading-relaxed">{hint}</p>}
    </div>
  );
}

export default function Attribution() {
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [revenueError, setRevenueError] = useState<string | null>(null);
  const [subs, setSubs] = useState<SubsReport | null>(null);
  const [subsError, setSubsError] = useState<string | null>(null);
  const [trialCvr, setTrialCvr] = useState(0.5);
  const [channels, setChannels] = useState<ChannelReport | null>(null);
  const [channelsError, setChannelsError] = useState<string | null>(null);
  const [drill, setDrill] = useState<string | null>(null);
  const [drillList, setDrillList] = useState<ContactList | null>(null);
  const [drillLoading, setDrillLoading] = useState(false);
  const [tab, setTab] = useState<'channels' | 'revenue' | 'subscriptions' | 'contacts'>('channels');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [model, setModel] = useState<'first' | 'last'>('first');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        navigate('/admin', { replace: true });
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const qs = `days=${days}&model=${model}`;

      // Revenue is the slower call (it resolves every payer), so both run in
      // parallel and each surfaces its own error.
      const [contactsRes, revenueRes, subsRes, channelsRes] = await Promise.allSettled([
        fetch(`/api/attribution?${qs}`, { headers }),
        fetch(`/api/attribution-revenue?${qs}`, { headers }),
        fetch(`/api/attribution-subscriptions?model=${model}&trialCvr=${trialCvr}`, { headers }),
        fetch(`/api/attribution-channels?${qs}`, { headers }),
      ]);

      if (contactsRes.status === 'fulfilled' && contactsRes.value.ok) {
        setReport(await contactsRes.value.json());
      } else {
        const body =
          contactsRes.status === 'fulfilled'
            ? await contactsRes.value.json().catch(() => ({}))
            : {};
        throw new Error(body.error ?? 'Failed to load contact report');
      }

      if (revenueRes.status === 'fulfilled' && revenueRes.value.ok) {
        setRevenue(await revenueRes.value.json());
        setRevenueError(null);
      } else {
        const body =
          revenueRes.status === 'fulfilled'
            ? await revenueRes.value.json().catch(() => ({}))
            : {};
        setRevenue(null);
        setRevenueError(body.error ?? 'Failed to load revenue report');
      }

      if (subsRes.status === 'fulfilled' && subsRes.value.ok) {
        setSubs(await subsRes.value.json());
        setSubsError(null);
      } else {
        const body =
          subsRes.status === 'fulfilled'
            ? await subsRes.value.json().catch(() => ({}))
            : {};
        setSubs(null);
        setSubsError(body.error ?? 'Failed to load subscription report');
      }

      if (channelsRes.status === 'fulfilled' && channelsRes.value.ok) {
        setChannels(await channelsRes.value.json());
        setChannelsError(null);
      } else {
        const body =
          channelsRes.status === 'fulfilled'
            ? await channelsRes.value.json().catch(() => ({}))
            : {};
        setChannels(null);
        setChannelsError(body.error ?? 'Failed to load channel report');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [days, model, trialCvr, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const openDrill = useCallback(
    async (channel: string) => {
      setDrill(channel);
      setDrillList(null);
      setDrillLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const res = await fetch(
          `/api/attribution-contacts?channel=${encodeURIComponent(channel)}&days=${days}&model=${model}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) setDrillList(await res.json());
      } finally {
        setDrillLoading(false);
      }
    },
    [days, model],
  );

  // The CSV endpoint needs the bearer token, so fetch it as a blob rather than
  // linking directly — a plain <a href> cannot carry the Authorization header.
  const downloadCsv = useCallback(
    async (channel: string) => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch(
        `/api/attribution-contacts?channel=${encodeURIComponent(channel)}&days=${days}&model=${model}&format=csv`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whyzer-${channel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-contacts.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    [days, model],
  );

  const t = report?.totals;

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 md:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10 max-w-[1100px] mx-auto">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl uppercase tracking-tight">Attribution</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="border border-foreground/15 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded hover:bg-foreground/5 transition-colors"
          >
            Articles
          </Link>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1 border border-foreground/15 rounded p-1">
            {([7, 30, 90, 365] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                  days === d ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-foreground/15 rounded p-1">
            {(['first', 'last'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                  model === m ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'
                }`}
              >
                {m} touch
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-foreground/15 rounded p-1">
            {(['channels', 'revenue', 'subscriptions', 'contacts'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                  tab === v ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="border border-foreground/15 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded hover:bg-foreground/5 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 rounded p-4 mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-red-500 mb-1">Error</p>
            <p className="text-sm text-text-secondary">{error}</p>
          </div>
        )}

        {loading && !report && (
          <p className="font-mono text-sm text-text-secondary">Loading attribution data…</p>
        )}

        {tab === 'channels' && channelsError && (
          <div className="border border-amber-500/30 bg-amber-500/5 rounded p-4 mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-amber-500 mb-1">
              Channels unavailable
            </p>
            <p className="text-sm text-text-secondary">{channelsError}</p>
          </div>
        )}

        {tab === 'channels' && channels && (
          <>
            {/* Paid vs organic split bar */}
            <section className="mb-8">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary">
                  Paid vs organic · {channels.model} touch
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                  {channels.summary.acquisitionContacts} acquisition contacts
                </span>
              </div>

              <div className="flex h-3 rounded overflow-hidden border border-foreground/10 mb-3">
                <div
                  className="bg-primary"
                  style={{ width: `${channels.summary.paidShare * 100}%` }}
                  title={`Paid ${pct(channels.summary.paidShare)}`}
                />
                <div
                  className="bg-foreground/25"
                  style={{ width: `${channels.summary.organicShare * 100}%` }}
                  title={`Organic ${pct(channels.summary.organicShare)}`}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat
                  label="Paid"
                  value={pct(channels.summary.paidShare)}
                  hint={`${channels.summary.paidContacts} contacts · ${money(channels.summary.paidRevenue, channels.currency)}`}
                />
                <Stat
                  label="Organic"
                  value={pct(channels.summary.organicShare)}
                  hint={`${channels.summary.organicContacts} contacts · ${money(channels.summary.organicRevenue, channels.currency)}`}
                />
                <Stat
                  label="Paid share of revenue"
                  value={pct(channels.summary.paidRevenueShare)}
                  hint="Of attributed acquisition revenue"
                />
                <Stat
                  label="Not acquisition"
                  value={String(channels.summary.totalContacts - channels.summary.acquisitionContacts)}
                  hint="Imports, CRM workflows, unattributed — excluded from the split"
                />
              </div>
            </section>

            {channels.paidUnderReporting && (
              <div className="border border-amber-500/30 bg-amber-500/5 rounded p-4 mb-10">
                <p className="font-mono text-xs uppercase tracking-wider text-amber-500 mb-2">
                  Read paid conversion with care
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Paid brings in the most contacts but shows a far lower conversion rate than
                  organic channels. That is the signature of attribution loss rather than ad
                  performance: paid visitors arrive with UTMs, then convert at checkout without
                  them, so the sale is credited to Referral or Internal instead. The capture fix
                  addresses this going forward — treat paid conversion counts as a floor until
                  the data has rebuilt.
                </p>
              </div>
            )}

            <section className="mb-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                By channel
              </h2>
              <div className="border border-foreground/10 rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left">
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Channel</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Contacts</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Customers</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Conv.</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.byChannel.map((row) => (
                      <tr key={row.channel} className="border-b border-foreground/5 last:border-0">
                        <td className="p-3">
                          <button
                            onClick={() => openDrill(row.channel)}
                            className={`text-left hover:text-primary transition-colors underline decoration-dotted underline-offset-4 ${
                              row.isAcquisition ? '' : 'text-text-secondary italic'
                            }`}
                          >
                            {row.channel}
                          </button>
                          <span className="block text-xs text-text-secondary font-mono mt-0.5">
                            {row.exampleSignals.join(' · ')}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">{row.contacts}</td>
                        <td className="p-3 text-right font-mono">{row.customers}</td>
                        <td className="p-3 text-right font-mono">{pct(row.conversionRate)}</td>
                        <td className="p-3 text-right font-mono">{money(row.revenue, channels.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                Channels in <span className="italic">italics</span> are not marketing acquisition —
                CRM imports, Zapier syncs and contacts with no signal. They are shown for
                reconciliation but excluded from the paid-vs-organic split. The small type under
                each channel is the signal that classified it.
              </p>
            </section>

            {drill && (
              <section className="mb-12">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary">
                    {drill} contacts
                    {drillList && ` · ${drillList.total}`}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCsv(drill)}
                      className="border border-foreground/15 font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded hover:bg-foreground/5 transition-colors"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => { setDrill(null); setDrillList(null); }}
                      className="border border-foreground/15 font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded hover:bg-foreground/5 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {drillLoading && (
                  <p className="font-mono text-sm text-text-secondary">Loading contacts…</p>
                )}

                {drillList && (
                  <>
                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                      {drillList.customers} customer{drillList.customers === 1 ? '' : 's'} ·{' '}
                      {money(drillList.revenue, channels.currency)} revenue
                      {drillList.total > drillList.returned &&
                        ` · showing first ${drillList.returned}, export for all ${drillList.total}`}
                    </p>
                    <div className="border border-foreground/10 rounded overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-foreground/10 text-left">
                            <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Contact</th>
                            <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Campaign</th>
                            <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Landing page</th>
                            <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {drillList.contacts.slice(0, 100).map((c) => (
                            <tr key={c.contactId} className="border-b border-foreground/5 last:border-0">
                              <td className="p-3">
                                <span className="block">{c.name || '—'}</span>
                                <span className="text-xs text-text-secondary">{c.email}</span>
                              </td>
                              <td className="p-3 text-text-secondary">{c.campaign}</td>
                              <td className="p-3 text-text-secondary font-mono text-xs break-all">
                                {c.landingPage || '—'}
                              </td>
                              <td className="p-3 text-right font-mono">
                                {c.revenue > 0 ? money(c.revenue, channels.currency) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            )}
          </>
        )}

        {tab === 'revenue' && revenueError && (
          <div className="border border-amber-500/30 bg-amber-500/5 rounded p-4 mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-amber-500 mb-1">
              Revenue unavailable
            </p>
            <p className="text-sm text-text-secondary">{revenueError}</p>
          </div>
        )}

        {tab === 'revenue' && revenue && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Stat
                label="Revenue"
                value={money(revenue.totals.revenue, revenue.currency)}
                hint={`Settled, net of refunds · last ${revenue.windowDays} days`}
              />
              <Stat
                label="Attributed revenue"
                value={pct(revenue.totals.attributedRevenueShare)}
                hint={`${money(revenue.totals.unattributedRevenue, revenue.currency)} cannot be tied to a source`}
                tone={revenue.totals.attributedRevenueShare < 0.5 ? 'warn' : 'default'}
              />
              <Stat
                label="Trials started"
                value={String(revenue.totals.trials)}
                hint="Zero-value conversions, counted separately"
              />
              <Stat
                label="Failed charges"
                value={String(revenue.totals.failed)}
                hint="Excluded from revenue"
              />
            </div>

            <p className="text-xs text-text-secondary mb-10 leading-relaxed">
              {revenue.payersResolved} payer{revenue.payersResolved === 1 ? '' : 's'} resolved
              from {revenue.totals.transactions} transaction
              {revenue.totals.transactions === 1 ? '' : 's'}.
              {revenue.totals.refunded > 0 &&
                ` ${money(revenue.totals.refunded, revenue.currency)} refunded and netted out.`}
              {revenue.totals.unmatchedTransactions > 0 &&
                ` ${revenue.totals.unmatchedTransactions} transaction(s) had no resolvable contact.`}
            </p>

            <section className="mb-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                Revenue by source · {revenue.model} touch
              </h2>
              <div className="border border-foreground/10 rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left">
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Source</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Revenue</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Payers</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Trials</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Per payer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue.bySource.map((row) => (
                      <tr key={row.source} className="border-b border-foreground/5 last:border-0">
                        <td className="p-3">
                          <span className={isFallback(row.source) ? 'text-text-secondary italic' : ''}>
                            {row.source}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">{money(row.revenue, revenue.currency)}</td>
                        <td className="p-3 text-right font-mono">{row.customers}</td>
                        <td className="p-3 text-right font-mono text-text-secondary">{row.trials}</td>
                        <td className="p-3 text-right font-mono">{money(row.revenuePerCustomer, revenue.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                Revenue by campaign
              </h2>
              <div className="border border-foreground/10 rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left">
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Source</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Campaign</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Revenue</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Payers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue.byCampaign.map((row) => (
                      <tr key={`${row.source}/${row.campaign}`} className="border-b border-foreground/5 last:border-0">
                        <td className="p-3">
                          <span className={isFallback(row.source) ? 'text-text-secondary italic' : ''}>
                            {row.source}
                          </span>
                        </td>
                        <td className="p-3 text-text-secondary">{row.campaign}</td>
                        <td className="p-3 text-right font-mono">{money(row.revenue, revenue.currency)}</td>
                        <td className="p-3 text-right font-mono">{row.customers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {revenue.unattributedPayers.length > 0 && (
              <section className="mb-12">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                  Paying customers with no source
                </h2>
                <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                  Real money that no campaign is being credited for.
                </p>
                <div className="border border-foreground/10 rounded overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/10 text-left">
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Customer</th>
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Checkout</th>
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenue.unattributedPayers.map((p) => (
                        <tr key={p.contactId} className="border-b border-foreground/5 last:border-0">
                          <td className="p-3">
                            <span className="block">{p.name ?? '—'}</span>
                            <span className="text-xs text-text-secondary">{p.email ?? ''}</span>
                          </td>
                          <td className="p-3 text-text-secondary font-mono text-xs">{p.checkoutPage ?? '—'}</td>
                          <td className="p-3 text-right font-mono">{money(p.amount, revenue.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        {tab === 'subscriptions' && subsError && (
          <div className="border border-amber-500/30 bg-amber-500/5 rounded p-4 mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-amber-500 mb-1">
              Subscriptions unavailable
            </p>
            <p className="text-sm text-text-secondary">{subsError}</p>
          </div>
        )}

        {tab === 'subscriptions' && subs && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Stat
                label="Active subscriptions"
                value={String(subs.totals.active)}
                hint={`${pct(subs.totals.retentionRate)} of all subscriptions still billing`}
              />
              <Stat
                label="Annual run rate"
                value={money(subs.totals.annualRunRate, subs.currency)}
                hint="Active subscriptions, annualized at measured cadence"
              />
              <Stat
                label="Pending trials"
                value={String(subs.totals.pendingTrials)}
                hint="Started, not yet billed"
              />
              <Stat
                label="Projected trial value"
                value={money(subs.totals.projectedTrialRevenue, subs.currency)}
                hint={`Plan price x ${pct(subs.trialConversionRate)} expected conversion`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                Trial conversion assumption
              </span>
              <div className="flex items-center gap-1 border border-foreground/15 rounded p-1">
                {([0.25, 0.5, 0.75, 1] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrialCvr(r)}
                    className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                      trialCvr === r ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'
                    }`}
                  >
                    {pct(r)}
                  </button>
                ))}
              </div>
              <span className="text-xs text-text-secondary">
                Projection only — never counted as settled revenue.
              </span>
            </div>

            <section className="mb-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                Subscriptions by source · {subs.model} touch
              </h2>
              <div className="border border-foreground/10 rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left">
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Source</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Active</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Churned</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Run rate</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Trials</th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Projected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs.bySource.map((row) => (
                      <tr key={row.source} className="border-b border-foreground/5 last:border-0">
                        <td className="p-3">
                          <span className={isFallback(row.source) ? 'text-text-secondary italic' : ''}>
                            {row.source}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">{row.activeSubscriptions}</td>
                        <td className="p-3 text-right font-mono text-text-secondary">{row.churnedSubscriptions}</td>
                        <td className="p-3 text-right font-mono">{money(row.annualRunRate, subs.currency)}</td>
                        <td className="p-3 text-right font-mono text-text-secondary">{row.pendingTrials}</td>
                        <td className="p-3 text-right font-mono text-text-secondary">
                          {money(row.projectedTrialRevenue, subs.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                Run rate annualizes each active subscription at the billing cadence measured from
                its own charge history, not an assumed calendar month.
              </p>
            </section>

            {subs.pendingTrialList.length > 0 && (
              <section className="mb-12">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                  Trials in flight
                </h2>
                <div className="border border-foreground/10 rounded overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/10 text-left">
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Customer</th>
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Source</th>
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">Started</th>
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">Projected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subs.pendingTrialList.map((tr) => (
                        <tr key={tr.subscriptionId} className="border-b border-foreground/5 last:border-0">
                          <td className="p-3">
                            <span className="block">{tr.contactName ?? '—'}</span>
                            <span className="text-xs text-text-secondary">{tr.contactEmail ?? ''}</span>
                          </td>
                          <td className="p-3">
                            <span className={isFallback(tr.source) ? 'text-text-secondary italic' : ''}>
                              {tr.source}
                            </span>
                          </td>
                          <td className="p-3 text-text-secondary font-mono text-xs">
                            {tr.startedAt ? new Date(tr.startedAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-3 text-right font-mono">{money(tr.projectedValue, subs.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        {report && t && tab === 'contacts' && (
          <>
            {/* Health */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Stat
                label="Attribution coverage"
                value={pct(t.attributionCoverage)}
                hint={`${t.contacts - t.unattributed} of ${t.contacts} contacts have a known source`}
                tone={t.attributionCoverage < 0.5 ? 'warn' : 'default'}
              />
              <Stat label="Contacts" value={String(t.contacts)} hint={`Last ${report.windowDays} days`} />
              <Stat label="Customers" value={String(t.customers)} />
              <Stat
                label="Journeys lost"
                value={String(t.journeyLost)}
                hint="First touch was already the checkout page"
                tone={t.journeyLost > 0 ? 'warn' : 'default'}
              />
            </div>

            {t.selfReferralCorrected > 0 && (
              <p className="text-xs text-text-secondary mb-10 leading-relaxed">
                <span className="font-mono uppercase tracking-wider text-amber-500">Note</span>{' '}
                — {t.selfReferralCorrected} contact
                {t.selfReferralCorrected === 1 ? ' was' : 's were'} logged by GHL as
                &ldquo;Referral&rdquo; because the referrer was our own domain
                (whyzer.ai → subscribe.whyzer.ai). They have been reclassified to their real
                campaign source here.
              </p>
            )}

            {/* By source */}
            <section className="mb-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                By source · {model} touch
              </h2>
              <div className="border border-foreground/10 rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left">
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">
                        Source
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">
                        Contacts
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">
                        Customers
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">
                        Conv.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.bySource.map((row) => (
                      <tr key={row.source} className="border-b border-foreground/5 last:border-0">
                        <td className="p-3">
                          <span className={isFallback(row.source) ? 'text-text-secondary italic' : ''}>
                            {row.source}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono">{row.contacts}</td>
                        <td className="p-3 text-right font-mono">{row.customers}</td>
                        <td className="p-3 text-right font-mono">{pct(row.conversionRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                Sources in <span className="italic">italics</span> are GHL&rsquo;s own
                classification, not real UTM values — those contacts arrived without campaign
                parameters.
              </p>
            </section>

            {/* By campaign */}
            <section className="mb-12">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                By campaign
              </h2>
              <div className="border border-foreground/10 rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left">
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">
                        Source
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">
                        Campaign
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">
                        Contacts
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">
                        Customers
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3 text-right">
                        Conv.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.byCampaign.map((row) => (
                      <tr
                        key={`${row.source}/${row.campaign}`}
                        className="border-b border-foreground/5 last:border-0"
                      >
                        <td className="p-3">
                          <span className={isFallback(row.source) ? 'text-text-secondary italic' : ''}>
                            {row.source}
                          </span>
                        </td>
                        <td className="p-3 text-text-secondary">{row.campaign}</td>
                        <td className="p-3 text-right font-mono">{row.contacts}</td>
                        <td className="p-3 text-right font-mono">{row.customers}</td>
                        <td className="p-3 text-right font-mono">{pct(row.conversionRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Lost customers */}
            {report.lostCustomers.length > 0 && (
              <section className="mb-12">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-4">
                  Customers with no attribution
                </h2>
                <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                  These paying customers cannot be tied to a source. Each one is revenue that
                  some campaign earned but is not being credited for.
                </p>
                <div className="border border-foreground/10 rounded overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/10 text-left">
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">
                          Contact
                        </th>
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">
                          GHL source
                        </th>
                        <th className="font-mono text-[10px] uppercase tracking-wider text-text-secondary p-3">
                          Added
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.lostCustomers.map((c) => (
                        <tr key={c.contactId} className="border-b border-foreground/5 last:border-0">
                          <td className="p-3">
                            <span className="block">{c.name ?? '—'}</span>
                            <span className="text-xs text-text-secondary">{c.email ?? ''}</span>
                          </td>
                          <td className="p-3 text-text-secondary">{c.source ?? '—'}</td>
                          <td className="p-3 text-text-secondary font-mono text-xs">
                            {c.dateAdded ? new Date(c.dateAdded).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              Generated {new Date(report.generatedAt).toLocaleString()} · source of truth: GHL
            </p>
          </>
        )}
      </div>
    </div>
  );
}
