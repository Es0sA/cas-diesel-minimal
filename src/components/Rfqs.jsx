import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowLeft, FileText, CheckCircle2, AlertTriangle, Clock, Plus, Info, Upload, FileCheck2, ExternalLink } from 'lucide-react';
import { api } from '../api';
import PendingAcceptance from './PendingAcceptance';
import { NIGERIAN_STATES } from '../lib/nigeria';
import { DEPOTS, depotName } from '../data/depots';
import { closesIn, URGENCY_STYLE } from '../lib/rfqUrgency';

const naira = (n) => `₦${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const when = (d) => new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
const inputCls = 'input';

const isSafeUrl = (u) => {
  try {
    const p = new URL(u).protocol;
    return p === 'https:' || p === 'http:';
  } catch {
    return typeof u === 'string' && u.startsWith('/api/');
  }
};

const STATUS_STYLE = {
  OPEN: 'bg-cas-blueLight text-cas-blue',
  AWARDED: 'bg-cas-greenLight text-cas-green',
  EXPIRED: 'bg-slate-100 text-cas-muted',
  CANCELLED: 'bg-slate-100 text-cas-muted',
  SUBMITTED: 'bg-cas-blueLight text-cas-blue',
  ACCEPTED: 'bg-cas-greenLight text-cas-green',
  REJECTED: 'bg-slate-100 text-cas-muted',
  WITHDRAWN: 'bg-slate-100 text-cas-muted',
  DRAFT: 'bg-cas-amberLight text-cas-amberDark',
  HELD: 'bg-cas-amberLight text-cas-amberDark',
};
const Pill = ({ status }) => <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[status] || 'bg-slate-100 text-cas-muted'}`}>{status}</span>;

// Error banner; a connection failure also offers a retry that reloads the data behind it
function ErrorNotice({ message, onRetry, className = 'mb-4' }) {
  const canRetry = onRetry && /^Network error/.test(message || '');
  return (
    <div role="alert" className={`${className} flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm leading-relaxed`}>
      <span>{message}</span>
      {canRetry && <button type="button" onClick={onRetry} className="btn-secondary h-9 px-4 text-xs">Try again</button>}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-cas-slate mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-cas-muted mt-1">{hint}</span>}
    </label>
  );
}

function Shell({ title, subtitle, back, children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {back && (
        <Link to={back} className="inline-flex items-center gap-2 text-cas-muted hover:text-cas-slate mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
        </Link>
      )}
      <h1 className="text-2xl font-extrabold text-cas-slate leading-tight break-words">{title}</h1>
      {subtitle && <p className="text-cas-muted mt-1 mb-6 max-w-2xl leading-relaxed break-words">{subtitle}</p>}
      {children}
    </div>
  );
}

function SpecTable({ requirements }) {
  const r = requirements || {};
  const rows = [
    ['Density at 15 C', `${r.densityMin} to ${r.densityMax} kg/L`],
    ['Flash point', `${r.flashPointMin} C minimum`],
    ['Sulphur', `${r.sulphurMax}% wt maximum`],
    ['Water', `${r.waterMax}% vol maximum`],
    ['Viscosity', `${r.viscosityMin} to ${r.viscosityMax} mm2/s`],
    ['Final boiling point', `${r.fbpMax} C maximum`],
    ['Certificate age', `${r.certMaxAgeWorkingDays} working days maximum`],
  ];
  return (
    <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-slate-100 py-1.5"><dt className="text-cas-muted">{k}</dt><dd className="font-semibold text-cas-slate text-right">{v}</dd></div>
      ))}
    </dl>
  );
}

/* ---------------- Buyer ---------------- */

function SamplePhotos({ id, title = 'Buyer sample photos' }) {
  const [samples, setSamples] = useState(null);
  useEffect(() => { api.rfqs.samples(id).then((r) => setSamples(r.samples)).catch(() => setSamples([])); }, [id]);
  if (!samples || samples.length === 0) return null;
  return (
    <section className="bg-white border border-cas-border rounded-2xl p-6 mb-8 shadow-sm">
      <h2 className="text-xl font-bold text-cas-slate mb-1 leading-tight">{title}</h2>
      <p className="text-xs text-cas-muted mb-3 leading-relaxed">The product loaded must match these samples.</p>
      <div className="flex flex-wrap gap-3">
        {samples.map((x) => <a key={x.id} href={x.url} target="_blank" rel="noopener noreferrer"><img src={x.url} alt="Buyer reference sample" className="h-28 w-28 object-cover rounded-lg border border-slate-200" /></a>)}
      </div>
    </section>
  );
}

function BuyerRfqs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDepotId = searchParams.get('depotId') || '';
  const [rfqs, setRfqs] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(Boolean(initialDepotId));
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [f, setF] = useState({ volumeLiters: 33000, depotId: initialDepotId, deliveryAddress: '', targetLatitude: '', targetLongitude: '', receiverName: '', receiverPhone: '', city: '', state: '', validHours: 24, flashPointMin: '', densityMin: '', densityMax: '', sulphurMax: '', waterMax: '' });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const [profile, setProfile] = useState(null);
  const [sameContact, setSameContact] = useState(true);

  // The registered company details pre-fill the receiving contact
  useEffect(() => {
    api.companies.getProfile().then((res) => {
      const company = res?.company || res;
      setProfile(company);
      // City and state default to the registered ones but stay editable
      setF((x) => ({ ...x, city: x.city || company?.city || '', state: x.state || company?.state || '' }));
    }).catch(() => setSameContact(false));
  }, []);

  useEffect(() => {
    const depotId = searchParams.get('depotId');
    if (depotId) {
      setF((prev) => ({ ...prev, depotId }));
      setOpen(true);
    }
  }, [searchParams]);

  const load = useCallback(() => api.rfqs.list().then((r) => setRfqs(r.rfqs)).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const requirements = {};
      for (const k of ['flashPointMin', 'densityMin', 'densityMax', 'sulphurMax', 'waterMax']) if (f[k] !== '') requirements[k] = f[k];
      const body = { volumeLiters: Number(f.volumeLiters), validHours: Number(f.validHours), requirements };
      if (f.depotId) body.depotId = f.depotId;
      // Who receives the diesel and where. Defaults to the registered company contact.
      body.city = f.city.trim();
      body.state = f.state;
      body.receiverSameAsRegistered = sameContact;
      if (sameContact) {
        body.receiverName = profile?.companyName || '';
        body.receiverPhone = profile?.contactPhone || '';
        if (profile?.streetAddress) body.deliveryAddress = profile.streetAddress.trim().slice(0, 300);
      } else {
        body.receiverName = f.receiverName.trim();
        body.receiverPhone = f.receiverPhone.trim();
        body.deliveryAddress = f.deliveryAddress.trim();
        if (f.targetLatitude !== '' && f.targetLongitude !== '') { body.targetLatitude = Number(f.targetLatitude); body.targetLongitude = Number(f.targetLongitude); }
      }
      const res = await api.rfqs.create(body);
      for (const file of photos) {
        try { await api.rfqs.uploadSample(res.rfq.id, file); } catch (err) { console.error('Sample photo upload failed:', err); }
      }
      navigate(`/rfqs/${res.rfq.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Requests for quotes" subtitle="Say what you need once. Verified vendors answer with a price and a batch certificate, and you pick the offer that fits.">
      {error && <ErrorNotice message={error} onRetry={() => { setError(null); load(); }} />}

      {!open ? (
        <button onClick={() => setOpen(true)} className="btn-primary mb-8">
          <Plus className="w-4 h-4" aria-hidden="true" /> New request
        </button>
      ) : (
        <form onSubmit={create} className="max-w-4xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm">
          <fieldset disabled={busy} className="space-y-5 min-w-0 border-0 p-0 m-0">
          <h2 className="text-xl font-bold text-cas-slate leading-tight">New request for quotes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Volume (litres)"><input required type="number" min="1" step="1" value={f.volumeLiters} onChange={set('volumeLiters')} className={inputCls} /></Field>
            <Field label="Loading depot" hint="Optional. Leave blank to accept any."><select value={f.depotId} onChange={set('depotId')} className={inputCls}><option value="">Any depot</option>{DEPOTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Quotes stay open for"><select value={f.validHours} onChange={set('validHours')} className={inputCls}>{[[6, '6 hours'], [24, '24 hours'], [48, '2 days'], [72, '3 days'], [168, '7 days']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Delivery state" hint="Vendors see the city and state to price transport."><select required value={f.state} onChange={set('state')} className={inputCls}><option value="">Select state</option>{NIGERIAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}</select></Field>
            <Field label="Delivery city"><input required type="text" maxLength={100} value={f.city} onChange={set('city')} className={inputCls} autoComplete="off" /></Field>
          </div>
          <fieldset className="rounded-xl border border-slate-200 p-4 space-y-4">
            <legend className="px-2 text-sm font-bold text-cas-slate">Receiving Contact &amp; Location</legend>
            <label className="flex items-start gap-2.5 min-h-[44px] py-1 text-sm text-cas-slate cursor-pointer">
              <input type="checkbox" checked={sameContact} onChange={(e) => setSameContact(e.target.checked)} disabled={!profile} className="mt-1 h-4 w-4 rounded border-slate-300" />
              <span>
                <span className="font-semibold">Same as registered contact</span>
                <span className="block text-xs text-cas-muted">Uncheck if someone else will receive the diesel, or it goes to a different site.</span>
              </span>
            </label>
            {sameContact ? (
              <dl className="grid sm:grid-cols-3 gap-4 text-sm">
                <div><dt className="text-xs font-bold text-cas-muted">Name</dt><dd className="mt-0.5 text-cas-slate break-words">{profile?.companyName || 'Not on file'}</dd></div>
                <div><dt className="text-xs font-bold text-cas-muted">Phone</dt><dd className="mt-0.5 text-cas-slate">{profile?.contactPhone || 'Not on file'}</dd></div>
                <div><dt className="text-xs font-bold text-cas-muted">Registered street address</dt><dd className="mt-0.5 text-cas-slate break-words">{profile?.streetAddress || 'Not on file. Untick the box to enter one.'}</dd></div>
              </dl>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Receiver full name"><input required type="text" maxLength={120} value={f.receiverName} onChange={set('receiverName')} className={inputCls} autoComplete="off" /></Field>
                  <Field label="Receiver phone number"><input required type="tel" maxLength={30} value={f.receiverPhone} onChange={set('receiverPhone')} className={inputCls} autoComplete="off" /></Field>
                </div>
                <Field label="Exact delivery address"><input required type="text" maxLength={300} value={f.deliveryAddress} onChange={set('deliveryAddress')} className={inputCls} placeholder="Plant, street, town" /></Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Gate latitude (optional)" hint="GPS coordinates are used to detect arrival and stay hidden from vendors until you award."><input type="number" step="any" value={f.targetLatitude} onChange={set('targetLatitude')} className={inputCls} /></Field>
                  <Field label="Gate longitude (optional)"><input type="number" step="any" value={f.targetLongitude} onChange={set('targetLongitude')} className={inputCls} /></Field>
                </div>
              </div>
            )}
          </fieldset>
          <Field label="Sample photos" hint="Up to 3 JPG or PNG photos of the product you want. The vendor compares these with the sample at the depot.">
            <input type="file" accept="image/jpeg,image/png" multiple onChange={(e) => setPhotos(Array.from(e.target.files || []).slice(0, 3))} className={`${inputCls} file:mr-3 file:px-4 file:py-1.5 file:rounded-md file:border-0 file:bg-cas-slate file:text-white file:text-xs file:font-bold file:cursor-pointer hover:file:bg-black`} />
            {photos.length > 0 && <p className="text-xs text-cas-muted mt-1 leading-relaxed">{photos.length} photo{photos.length === 1 ? '' : 's'} selected</p>}
          </Field>
          <details className="rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer text-sm font-bold text-cas-slate">Product specification (prefilled with the AGO standard)</summary>
            <p className="text-xs text-cas-muted mt-2 mb-3 leading-relaxed">Leave a field blank to keep the standard value. Tighten it if you need to.</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Density min (kg/L)" hint="Standard 0.830"><input type="number" step="any" value={f.densityMin} onChange={set('densityMin')} className={inputCls} /></Field>
              <Field label="Density max (kg/L)" hint="Standard 0.840"><input type="number" step="any" value={f.densityMax} onChange={set('densityMax')} className={inputCls} /></Field>
              <Field label="Flash point min (C)" hint="Standard 66"><input type="number" step="any" value={f.flashPointMin} onChange={set('flashPointMin')} className={inputCls} /></Field>
              <Field label="Sulphur max (% wt)" hint="Standard 0.05"><input type="number" step="any" value={f.sulphurMax} onChange={set('sulphurMax')} className={inputCls} /></Field>
              <Field label="Water max (% vol)" hint="Standard 0.05"><input type="number" step="any" value={f.waterMax} onChange={set('waterMax')} className={inputCls} /></Field>
            </div>
          </details>
          <div className="flex gap-3">
            <button disabled={busy} className="btn-primary">{busy ? (<><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /><span>Sending...</span></>) : 'Send to vendors'}</button>
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm font-semibold text-cas-muted">Cancel</button>
          </div>
        </fieldset>
        </form>
      )}

      {rfqs === null ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cas-blue" /></div>
      ) : rfqs.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-2xl text-cas-muted">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
          <p>No requests yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rfqs.map((r) => (
            <li key={r.id}>
              <Link to={`/rfqs/${r.id}`} className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 transition-colors shadow-sm break-words">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-cas-slate leading-relaxed">{Number(r.volumeLiters).toLocaleString()} L of AGO</p>
                    <p className="text-xs text-cas-muted mt-0.5 leading-relaxed">{r.deliveryAddress || 'No address given'} · {r.status === 'OPEN' ? `closes ${when(r.expiresAt)}` : `raised ${when(r.createdAt)}`}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-cas-muted">{r._count?.quotes || 0} quote{r._count?.quotes === 1 ? '' : 's'}</span>
                    <Pill status={r.status} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}

function BuyerRfqDetail({ id }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [okDev, setOkDev] = useState({});

  const load = useCallback(() => api.rfqs.get(id).then(setData).catch((e) => setError(e.message)), [id]);
  useEffect(() => { load(); }, [load]);

  const accept = async (q) => {
    const deviates = !!q.deviations || q.specCheck?.pass === false;
    if (deviates && !okDev[q.id]) { setError('Tick the box to accept the stated deviations first.'); return; }
    if (!window.confirm(`Award this request to ${q.supplier?.companyName} at ${naira(q.pricePerLitre)} per litre? The other quotes will be declined.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.rfqs.accept(id, q.id, deviates);
      navigate(`/orders/${res.order.id}`);
    } catch (err) {
      setError(err.message);
      load();
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (!window.confirm('Cancel this request? All quotes will be declined.')) return;
    try { await api.rfqs.cancel(id); load(); } catch (err) { setError(err.message); }
  };

  if (!data) return <Shell title="Request" back="/rfqs">{error ? <ErrorNotice message={error} onRetry={() => { setError(null); load(); }} className="" /> : <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cas-blue" /></div>}</Shell>;
  const { rfq, quotes } = data;
  const live = quotes.filter((q) => q.status === 'SUBMITTED');
  const cheapest = live.length ? Math.min(...live.map((q) => q.pricePerLitre)) : null;

  return (
    <Shell title={`${Number(rfq.volumeLiters).toLocaleString()} L of AGO`} back="/rfqs" subtitle={rfq.deliveryAddress || undefined}>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Pill status={rfq.status} />
        <span className="text-sm text-cas-muted flex items-center gap-1.5"><Clock className="w-4 h-4" aria-hidden="true" /> {rfq.status === 'OPEN' ? `Closes ${when(rfq.expiresAt)}` : `Closed`}</span>
        {rfq.status === 'OPEN' && <button onClick={cancel} className="ml-auto text-sm font-semibold text-rose-700 hover:underline">Cancel request</button>}
      </div>
      {error && <ErrorNotice message={error} onRetry={() => { setError(null); load(); }} />}
      <PendingAcceptance order={data.order ? { ...data.order, rfqId: id } : null} role="BUYER" onChanged={load} />

      <section className="bg-white border border-cas-border rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-cas-slate mb-3 leading-tight">Your specification</h2>
        <SpecTable requirements={rfq.requirements} />
        <p className="text-xs text-cas-muted mt-3 leading-relaxed">Dispatch within {rfq.terms?.dispatchHours} hours of funding. Delivery within {rfq.terms?.deliveryWorkingDays} working days. The specification above governs the order, whatever the quote says.</p>
      </section>
      <SamplePhotos id={id} title="Your sample photos" />

      <h2 className="text-xl font-bold text-cas-slate mb-3 leading-tight">Quotes ({live.length})</h2>
      {live.length === 0 && quotes.length === 0 && <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-2xl text-cas-muted">No quotes yet. Verified vendors can see your request and quote until it closes.</div>}
      <ul className="space-y-4">
        {quotes.map((q) => {
          const deviates = !!q.deviations || q.specCheck?.pass === false;
          const canAccept = rfq.status === 'OPEN' && q.status === 'SUBMITTED';
          return (
            <li key={q.id} className={`bg-white border rounded-2xl p-5 shadow-sm ${q.status === 'ACCEPTED' ? 'border-green-300' : 'border-cas-border'}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-cas-slate flex items-center gap-2 leading-relaxed">{q.supplier?.companyName}{q.pricePerLitre === cheapest && q.status === 'SUBMITTED' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cas-greenLight text-cas-green">Lowest price</span>}</p>
                  <p className="text-xs text-cas-muted mt-0.5 leading-relaxed">Loading at {q.sourceDepot}{q.batchNumber ? ` · batch ${q.batchNumber}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-cas-slate leading-relaxed">{naira(q.pricePerLitre)}<span className="text-sm font-semibold text-cas-muted"> / L</span></p>
                  <p className="text-xs text-cas-muted leading-relaxed">Total {naira(q.totalValue)}</p>
                </div>
              </div>
              <dl className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
                <div>
                  <dt className="text-xs text-cas-muted">Certificate</dt>
                  <dd className="font-semibold">
                    {q.certificateUrl ? (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const certId = q.certificateUrl.match(/certificates\/([a-f0-9-]+)/i)?.[1];
                            if (certId) {
                              await api.rfqs.downloadCertificate(rfq.id, certId, `certificate-${q.batchNumber || q.id.slice(0, 8)}.pdf`);
                            } else if (isSafeUrl(q.certificateUrl)) {
                              window.open(q.certificateUrl, '_blank', 'noopener,noreferrer');
                            } else {
                              alert('Invalid certificate URL');
                            }
                          } catch (err) {
                            alert(err.message || 'Could not download certificate');
                          }
                        }}
                        className="text-cas-blue underline hover:text-blue-700 cursor-pointer text-left"
                      >
                        View, dated {new Date(q.certificateDate).toLocaleDateString()}
                      </button>
                    ) : 'None'}
                  </dd>
                </div>
                <div><dt className="text-xs text-cas-muted">Payment terms</dt><dd className="font-semibold">{q.paymentTerms || 'Escrow'}</dd></div>
                <div><dt className="text-xs text-cas-muted">Earliest delivery</dt><dd className="font-semibold">{q.earliestDelivery ? when(q.earliestDelivery) : 'Per RFQ terms'}</dd></div>
              </dl>
              <p className={`mt-4 text-sm flex items-start gap-2 ${deviates ? 'text-amber-800' : 'text-cas-green'}`}>
                {deviates ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />}
                <span>{deviates ? `Deviates from your specification${q.deviations ? `: ${q.deviations}` : '.'}` : 'Declared specification meets every line of your request.'}</span>
              </p>
              {q.status !== 'SUBMITTED' && <div className="mt-3"><Pill status={q.status} /></div>}
              {canAccept && (
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {deviates && (
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!okDev[q.id]} onChange={(e) => setOkDev((o) => ({ ...o, [q.id]: e.target.checked }))} /> I accept these deviations</label>
                  )}
                  <button disabled={busy} onClick={() => accept(q)} className="btn-secondary">Award to this vendor</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

/* ---------------- Vendor ---------------- */

const SPEC_FIELDS = [
  ['density', 'Density at 15 C (kg/L)', '0.835'],
  ['flashPoint', 'Flash point (C)', '68'],
  ['sulphur', 'Sulphur (% wt)', '0.03'],
  ['water', 'Water (% vol)', '0.02'],
  ['viscosity', 'Viscosity (mm2/s)', '3.2'],
  ['finalBoilingPoint', 'Final boiling point (C)', '370'],
];

function CertificateUploadField({
  certificateUrl,
  certificateName,
  onUploaded,
  onUploadingChange,
  hint,
  label = 'Quality Certificate (COA)',
  required = false
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [fileName, setFileName] = useState(certificateName || '');

  const onPick = async (file) => {
    if (!file) return;
    setUploadError('');
    setUploading(true);
    if (onUploadingChange) onUploadingChange(true);
    try {
      const data = await api.rfqs.uploadCertificate(file);
      setFileName(data.fileName || file.name);
      onUploaded(data.certificateUrl, data.fileName || file.name);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload certificate.');
    } finally {
      setUploading(false);
      if (onUploadingChange) onUploadingChange(false);
    }
  };

  return (
    <div className="block">
      <div className="flex items-center justify-between gap-2 mb-1">
        <label className="text-xs font-bold text-cas-slate">{label}{required && <span className="text-rose-700 ml-0.5">*</span>}</label>
        <button
          type="button"
          onClick={() => setManualMode((m) => !m)}
          className="text-xs text-cas-blue hover:underline"
        >
          {manualMode ? 'Upload file instead' : 'Or paste URL'}
        </button>
      </div>

      {manualMode ? (
        <input
          type="url"
          placeholder="https://"
          value={certificateUrl || ''}
          onChange={(e) => onUploaded(e.target.value, '')}
          required={required}
          className={inputCls}
        />
      ) : (
        <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              {certificateUrl ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <FileCheck2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{fileName || 'Certificate attached'}</span>
                  <a
                    href={isSafeUrl(certificateUrl) ? certificateUrl : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-cas-blue hover:underline text-xs ml-1 shrink-0"
                  >
                    View
                    <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                  </a>
                </div>
              ) : (
                <div className="text-xs text-cas-muted">
                  No certificate uploaded yet
                </div>
              )}
            </div>

            <label className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 bg-white text-cas-slate cursor-pointer hover:border-cas-amber hover:text-cas-amberDark shadow-sm transition-colors w-full sm:w-auto">
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              {uploading ? 'Uploading...' : certificateUrl ? 'Replace' : 'Upload Certificate'}
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  if (e.target.files?.[0]) onPick(e.target.files[0]);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          {required && (
            <input
              tabIndex={-1}
              required={required}
              value={certificateUrl || ''}
              onChange={() => {}}
              className="sr-only"
              onInvalid={(e) => e.target.setCustomValidity('Please upload your laboratory batch certificate.')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          )}
        </div>
      )}

      {hint && <span className="block text-xs text-cas-muted mt-1">{hint}</span>}
      {uploadError && <p className="text-xs font-bold text-rose-600 mt-1 leading-relaxed">{uploadError}</p>}
    </div>
  );
}

function QuoteForm({ rfq, onDone }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ pricePerLitre: '', sourceDepot: '', paymentTerms: 'Escrow', batchNumber: '', certificateUrl: '', certificateName: '', certificateDate: today, deviations: '', taxes: '', earliestDelivery: '' });
  const [specs, setSpecs] = useState({});
  const [busy, setBusy] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [error, setError] = useState(null);
  const [specCheck, setSpecCheck] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const total = Number(f.pricePerLitre) > 0 ? Number(f.pricePerLitre) * rfq.volumeLiters : null;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSpecCheck(null);
    try {
      const body = { ...f, declaredSpecs: Object.fromEntries(Object.entries(specs).filter(([, v]) => v !== '')) };
      for (const k of ['deviations', 'taxes', 'earliestDelivery', 'batchNumber', 'certificateName']) if (!body[k]) delete body[k];
      delete body.certificateName;
      await api.rfqs.quote(rfq.id, body);
      onDone();
    } catch (err) {
      setError(err.message);
      if (err.data?.specCheck) setSpecCheck(err.data.specCheck);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-cas-border rounded-2xl p-6 shadow-sm space-y-5">
      <h2 className="text-xl font-bold text-cas-slate leading-tight">Your quote</h2>
      {error && <p role="alert" className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm leading-relaxed">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Price per litre (₦)"><input required type="number" step="any" min="1" value={f.pricePerLitre} onChange={set('pricePerLitre')} className={inputCls} /></Field>
        <Field label="Loading depot"><select required value={f.sourceDepot} onChange={set('sourceDepot')} className={inputCls}><option value="">Choose</option>{DEPOTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}</select></Field>
        <Field label="Payment terms"><input type="text" maxLength={200} value={f.paymentTerms} onChange={set('paymentTerms')} className={inputCls} /></Field>
      </div>
      {total && <p className="text-sm text-cas-muted leading-relaxed">Total for {Number(rfq.volumeLiters).toLocaleString()} L: <strong className="text-cas-slate">{naira(total)}</strong></p>}

      <fieldset>
        <legend className="text-sm font-bold text-cas-slate mb-2">Declared specification from your batch certificate</legend>
        <div className="grid sm:grid-cols-3 gap-3">
          {SPEC_FIELDS.map(([k, label, ph]) => (
            <Field key={k} label={label}><input required type="number" step="any" placeholder={ph} value={specs[k] ?? ''} onChange={(e) => setSpecs((s) => ({ ...s, [k]: e.target.value }))} className={inputCls} /></Field>
          ))}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <CertificateUploadField
            label="Laboratory Batch Certificate (COA)"
            hint={`PDF, JPG or PNG up to 5 MB. Newer than ${rfq.requirements?.certMaxAgeWorkingDays} working days.`}
            certificateUrl={f.certificateUrl}
            certificateName={f.certificateName}
            onUploaded={(url, name) => setF((x) => ({ ...x, certificateUrl: url, certificateName: name }))}
            onUploadingChange={setUploadingCert}
            required
          />
        </div>
        <div className="space-y-4">
          <Field label="Certificate test date" hint="Date issued by laboratory"><input required type="date" max={today} value={f.certificateDate} onChange={set('certificateDate')} className={inputCls} /></Field>
          <Field label="Batch number" hint="Optional"><input type="text" maxLength={80} placeholder="e.g. BATCH-2026-04" value={f.batchNumber} onChange={set('batchNumber')} className={inputCls} /></Field>
        </div>
      </div>
      <Field label="Deviation from the request" hint="Only if your product misses a line. State it plainly. The buyer must accept it."><textarea rows={2} maxLength={1000} value={f.deviations} onChange={set('deviations')} className={inputCls} /></Field>
      {specCheck && (
        <ul className="text-sm space-y-1">
          {specCheck.checks?.filter((c) => c.result !== 'pass').map((c) => (
            <li key={c.key} className="text-rose-700">
              {c.label}: {c.result === 'missing' ? 'no value declared' : `declared ${c.declared}`}, required {c.min !== undefined ? `${c.min} minimum` : ''}{c.min !== undefined && c.max !== undefined ? ' and ' : ''}{c.max !== undefined ? `${c.max} maximum` : ''}
            </li>
          ))}
        </ul>
      )}
      <button disabled={busy || uploadingCert} className="btn-primary">{uploadingCert ? 'Uploading certificate...' : busy ? (<><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /><span>Sending...</span></>) : 'Submit Binding Offer'}</button>
    </form>
  );
}

function SupplierRfqDetail({ id }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const load = useCallback(() => api.rfqs.get(id).then(setData).catch((e) => setError(e.message)), [id]);
  useEffect(() => { load(); }, [load]);

  if (!data) return <Shell title="Request" back="/rfqs">{error ? <ErrorNotice message={error} onRetry={() => { setError(null); load(); }} className="" /> : <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cas-blue" /></div>}</Shell>;
  const { rfq, quotes } = data;
  const mine = quotes.find((q) => q.status === 'SUBMITTED' || q.status === 'DRAFT');

  return (
    <Shell title={`${Number(rfq.volumeLiters).toLocaleString()} L of AGO`} back="/rfqs" subtitle={[rfq.buyerName || 'Buyer', [rfq.city, rfq.state].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}>
      <div className="flex items-center gap-3 mb-6"><Pill status={rfq.status} /><span className="text-sm text-cas-muted">Closes {when(rfq.expiresAt)}</span></div>
      <section className="bg-white border border-cas-border rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-cas-slate mb-3 leading-tight">What the buyer needs</h2>
        <SpecTable requirements={rfq.requirements} />
        <p className="text-xs text-cas-muted mt-3 leading-relaxed">If awarded you must dispatch within {rfq.terms?.dispatchHours} hours of funding and deliver within {rfq.terms?.deliveryWorkingDays} working days, or the escrow is refunded. Gate coordinates are shared after the award.</p>
      </section>
      {(rfq.receiverName || rfq.receiverPhone || rfq.deliveryAddress) && (
        <section className="bg-white border border-cas-border rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-cas-slate mb-3 leading-tight">Deliver to</h2>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <div><dt className="text-xs font-bold text-cas-muted">Receiver</dt><dd className="mt-0.5 text-cas-slate">{rfq.receiverName || 'Not given'}</dd></div>
            <div><dt className="text-xs font-bold text-cas-muted">Phone</dt><dd className="mt-0.5 text-cas-slate">{rfq.receiverPhone ? <a href={`tel:${rfq.receiverPhone.replace(/\s/g, '')}`} className="underline underline-offset-2">{rfq.receiverPhone}</a> : 'Not given'}</dd></div>
            <div><dt className="text-xs font-bold text-cas-muted">Address</dt><dd className="mt-0.5 text-cas-slate break-words">{rfq.deliveryAddress || 'Not given'}</dd></div>
          </dl>
        </section>
      )}
      <SamplePhotos id={id} />
      {mine && (
        <div className="bg-cas-greenLight/50 border border-green-200 rounded-2xl p-5 mb-8">
          <p className="font-bold text-cas-slate leading-relaxed">You quoted {naira(mine.pricePerLitre)} per litre</p>
          <p className="text-sm text-cas-muted mt-1 leading-relaxed">Submitting again replaces this quote.</p>
          {mine.status === 'DRAFT' && <p className="text-sm text-amber-800 mt-1 leading-relaxed">This is an automatic draft from your standing rates. Confirm it from your quotes list.</p>}
        </div>
      )}
      {rfq.status === 'OPEN' ? <QuoteForm rfq={rfq} onDone={load} /> : <p className="text-cas-muted leading-relaxed">This request is closed. Late quotes have no effect.</p>}
    </Shell>
  );
}

function SupplierRfqs() {
  const [rfqs, setRfqs] = useState(null);
  const [myQuotes, setMyQuotes] = useState([]);
  const [rates, setRates] = useState([]);
  const [error, setError] = useState(null);
  const [rate, setRate] = useState({ depotId: DEPOTS[0].id, pricePerLitre: '', minVolume: '', maxVolume: '', certificateUrl: '', certificateName: '', certificateDate: new Date().toISOString().slice(0, 10), autoSubmit: false });
  const [specs, setSpecs] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [showAutoInfo, setShowAutoInfo] = useState(false);
  const [spotPrice, setSpotPrice] = useState(0);

  useEffect(() => {
    api.companies.getProfile().then((res) => setSpotPrice(Number((res?.company || res)?.pricePerLitre) || 0)).catch(() => {});
  }, []);

  const load = useCallback(() => {
    api.rfqs.list().then((r) => setRfqs(r.rfqs)).catch((e) => setError(e.message));
    api.rfqs.myQuotes().then((r) => setMyQuotes(r.quotes || [])).catch(() => {});
    api.standingRates.list().then((r) => setRates(r.rates || [])).catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  const drafts = myQuotes.filter((q) => q.status === 'DRAFT' && q.rfq?.status === 'OPEN');
  const setR = (k) => (e) => setRate((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const saveRate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = { ...rate, declaredSpecs: Object.fromEntries(Object.entries(specs).filter(([, v]) => v !== '')) };
      body.minVolume = body.minVolume === '' ? 0 : Number(body.minVolume);
      if (body.maxVolume === '') delete body.maxVolume; else body.maxVolume = Number(body.maxVolume);
      if (!body.certificateUrl) delete body.certificateUrl;
      delete body.certificateName;
      await api.standingRates.create(body);
      setRate((r) => ({ ...r, pricePerLitre: '', minVolume: '', maxVolume: '', certificateUrl: '', certificateName: '' }));
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const act = (fn) => async () => { try { await fn(); load(); } catch (err) { setError(err.message); } };

  return (
    <Shell title="Open requests" subtitle="Buyers post what they need. Quote with your price and a current batch certificate. Only verified vendors can quote.">
      {error && <ErrorNotice message={error} onRetry={() => { setError(null); load(); }} />}

      {drafts.length > 0 && (
        <section className="mb-8 bg-cas-amberLight/60 border border-amber-200 rounded-2xl p-5">
          <h2 className="font-bold text-cas-slate mb-1 leading-tight">Drafts from your standing rates</h2>
          <p className="text-sm text-cas-muted mb-3 leading-relaxed">These were prepared automatically. Confirm each with one tap.</p>
          <ul className="space-y-2">
            {drafts.map((q) => (
              <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-lg border border-amber-200 px-4 py-2.5 text-sm">
                <span><strong>{Number(q.rfq.volumeLiters).toLocaleString()} L</strong> at {naira(q.pricePerLitre)} per litre</span>
                <button onClick={act(() => api.rfqs.confirmQuote(q.id))} className="px-4 py-1.5 bg-cas-slate text-white font-bold rounded-lg">Confirm and send</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rfqs === null ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cas-blue" /></div>
      ) : rfqs.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-2xl text-cas-muted">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
          <h2 className="font-display text-base font-bold text-cas-slate leading-tight">No Open Procurement Requests</h2>
          <p className="text-sm mt-1 leading-relaxed">There are no open requests requiring a quote at the moment. Check back regularly for new procurement opportunities.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {rfqs.map((r) => {
            const urgency = closesIn(r.expiresAt);
            const spotValue = spotPrice ? Number(r.volumeLiters) * spotPrice : 0;
            return (
              <li key={r.id}>
                <Link to={`/rfqs/${r.id}`} className="block bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-cas-amber shadow-sm transition-colors break-words">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-2xl font-extrabold text-cas-slate leading-relaxed">{Number(r.volumeLiters).toLocaleString()} <span className="text-base font-bold text-cas-muted">L of AGO</span></p>
                      <p className="text-sm text-cas-muted mt-1 leading-relaxed">{r.buyerName} · {[r.city, r.state].filter(Boolean).join(', ') || 'Location not given'}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${URGENCY_STYLE[urgency.tone]}`}>{urgency.label}</span>
                  </div>
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
                    <div><dt className="text-xs font-bold text-cas-muted">Loading depot</dt><dd className="font-semibold text-cas-slate mt-0.5">{r.depotId ? depotName(r.depotId) : 'Any depot'}</dd></div>
                    <div><dt className="text-xs font-bold text-cas-muted">Value at your spot price</dt><dd className="font-semibold text-cas-slate mt-0.5">{spotValue ? naira(spotValue) : 'Set a spot price'}</dd></div>
                    <div><dt className="text-xs font-bold text-cas-muted">Dispatch and delivery</dt><dd className="font-semibold text-cas-slate mt-0.5">{r.terms?.dispatchHours || 24}h and {r.terms?.deliveryWorkingDays || 3} working days</dd></div>
                    <div className="flex items-center sm:justify-end">
                      {r.myQuote ? <span className="text-sm font-bold text-cas-green">Quoted {naira(r.myQuote.pricePerLitre)}</span> : <span className="px-4 py-2 bg-cas-amber text-cas-slate text-sm font-bold rounded-lg">Quote now</span>}
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-extrabold text-cas-slate leading-tight">Standing rates</h2>
        <p className="text-cas-muted mt-1 mb-4 max-w-2xl leading-relaxed">Set a price once for a depot and volume range. When a matching request arrives, a quote is prepared for you. Turn on auto-send to skip the confirmation tap.</p>
        {rates.length > 0 && (
          <ul className="space-y-2 mb-6">
            {rates.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 bg-white border border-cas-border rounded-lg px-4 py-3 text-sm">
                <span><strong>{depotName(r.depotId)}</strong> · {naira(r.pricePerLitre)} per litre · {Number(r.minVolume).toLocaleString()}{r.maxVolume ? ` to ${Number(r.maxVolume).toLocaleString()}` : '+'} L · {r.autoSubmit ? 'auto-send' : 'confirm first'}</span>
                <button onClick={act(() => api.standingRates.remove(r.id))} className="font-semibold text-rose-700 hover:underline">Remove</button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={saveRate} className="bg-white border border-cas-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid sm:grid-cols-4 gap-4">
            <Field label="Depot"><select value={rate.depotId} onChange={setR('depotId')} className={inputCls}>{DEPOTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Price per litre (₦)"><input required type="number" step="any" min="1" value={rate.pricePerLitre} onChange={setR('pricePerLitre')} className={inputCls} /></Field>
            <Field label="Minimum litres"><input type="number" min="0" step="1" value={rate.minVolume} onChange={setR('minVolume')} className={inputCls} /></Field>
            <Field label="Maximum litres" hint="Optional"><input type="number" min="0" step="1" value={rate.maxVolume} onChange={setR('maxVolume')} className={inputCls} /></Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {SPEC_FIELDS.map(([k, label, ph]) => (
              <Field key={k} label={label}><input required type="number" step="any" placeholder={ph} value={specs[k] ?? ''} onChange={(e) => setSpecs((s) => ({ ...s, [k]: e.target.value }))} className={inputCls} /></Field>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <CertificateUploadField
              label="Quality Certificate (COA)"
              hint="Laboratory batch certificate PDF or photo (up to 5 MB)"
              certificateUrl={rate.certificateUrl}
              certificateName={rate.certificateName}
              onUploaded={(url, name) => setRate((r) => ({ ...r, certificateUrl: url, certificateName: name }))}
              onUploadingChange={setUploadingCert}
            />
            <Field label="Certificate test date" hint="Date tested at the depot laboratory"><input type="date" value={rate.certificateDate} onChange={setR('certificateDate')} className={inputCls} /></Field>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <label className="flex items-center gap-2.5 text-sm font-semibold text-cas-slate cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rate.autoSubmit}
                  onChange={setR('autoSubmit')}
                  className="w-4 h-4 rounded text-cas-amber focus:ring-cas-amber border-slate-300"
                />
                <span>Send matching quotes automatically</span>
              </label>

              <button
                type="button"
                onClick={() => setShowAutoInfo((s) => !s)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cas-amberDark hover:text-black py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-expanded={showAutoInfo}
                aria-label="Explain how automatic quoting works"
              >
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
                <span>What does this do?</span>
              </button>
            </div>

            {showAutoInfo && (
              <div className="mt-3 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-slate-700 space-y-2 animate-fadeIn">
                <div className="font-bold text-cas-slate flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cas-amberDark shrink-0" aria-hidden="true" />
                  <span>How automatic quoting works</span>
                </div>
                <div className="space-y-1.5 pl-5">
                  <p>
                    <strong className="text-slate-900">When unchecked (Recommended):</strong> When a buyer posts an RFQ matching this depot and volume range, CAS automatically prepares a private draft quote for you. You receive an alert, review current depot market prices and the buyer's delivery gate, then tap "Confirm and Send" before the buyer can see your bid.
                  </p>
                  <p>
                    <strong className="text-slate-900">When checked (Instant Quote):</strong> The platform submits your quote immediately to matching buyers as a live quote without waiting for your manual approval. Only select this if your diesel supply costs are locked in and you want to be first to quote.
                  </p>
                </div>
              </div>
            )}
          </div>
          <button disabled={saving || uploadingCert} className="btn-secondary">{uploadingCert ? 'Uploading certificate...' : saving ? 'Saving' : 'Save standing rate'}</button>
        </form>
      </section>
    </Shell>
  );
}

/* ---------------- Entry ---------------- */

export default function Rfqs({ user }) {
  const { id } = useParams();
  const role = (user?.role || '').toUpperCase();
  if (!role) {
    return (
      <Shell title="Requests for quotes" subtitle="Buyers post what they need once. Verified vendors answer with a price and a batch certificate.">
        <div className="bg-white border border-cas-border rounded-2xl p-6 sm:p-8 shadow-sm max-w-xl">
          <h2 className="text-xl font-extrabold text-cas-slate leading-tight">Sign in to continue</h2>
          <p className="text-sm text-cas-muted mt-1 leading-relaxed">Requests are shared with verified vendors, so you need an account as a buyer or a vendor.</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link to="/login" className="px-6 py-2.5 rounded-xl bg-cas-slate text-white text-sm font-bold text-center hover:bg-black">Sign in</Link>
            <Link to="/register" className="px-6 py-2.5 rounded-xl border border-slate-300 text-cas-slate text-sm font-bold text-center hover:border-slate-500">Create an account</Link>
          </div>
        </div>
      </Shell>
    );
  }
  if (role === 'BUYER') return id ? <BuyerRfqDetail id={id} /> : <BuyerRfqs />;
  if (role === 'VENDOR') return id ? <SupplierRfqDetail id={id} /> : <SupplierRfqs />;
  return <Shell title="Requests for quotes"><p className="text-cas-muted leading-relaxed">Requests are available to buyers and vendors.</p></Shell>;
}
