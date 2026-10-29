import React, { useState, useEffect } from 'react';
import { api } from '../api';

const naira = (n) => `₦${Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
const litres = (n) => Number(n).toLocaleString('en-NG');

// CAS commission by order volume. Each tier has one total fee, split 50/50 between buyer and vendor.
export default function AdminCommission() {
  const [tiers, setTiers] = useState(null);
  const [max, setMax] = useState(45000);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.commission.tiers().then((r) => {
      setMax(r.maxOrderLiters);
      const base = r.tiers.length ? r.tiers : r.defaults;
      setTiers(base.map((t) => ({ minLiters: t.minLiters, maxLiters: t.maxLiters, totalFee: r.tiers.length ? String(t.totalFee) : '' })));
    }).catch((e) => setMsg({ ok: false, text: e.message || 'Could not load the fee tiers.' }));
  }, []);

  const setFee = (i, v) => setTiers((all) => all.map((t, j) => (j === i ? { ...t, totalFee: v } : t)));

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const payload = tiers.map((t) => ({ ...t, totalFee: t.totalFee === '' ? 0 : Number(t.totalFee) }));
      if (payload.some((t) => !Number.isFinite(t.totalFee) || t.totalFee < 0)) throw new Error('Each fee must be zero or more.');
      await api.commission.saveTiers(payload);
      setMsg({ ok: true, text: 'Fees saved. They apply to orders created from now on.' });
    } catch (e) {
      setMsg({ ok: false, text: e.message || 'Could not save the fees.' });
    } finally { setSaving(false); }
  };

  if (!tiers) return <p className="text-sm text-cas-muted font-bold leading-relaxed">{msg ? msg.text : 'Loading fees...'}</p>;

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-cas-muted mb-2 leading-relaxed">Set one fee for each order size. The buyer pays half on top of the escrow, and the vendor's half is taken from what is released to them. A blank fee means no commission for that size.</p>
      <p className="text-sm text-cas-muted mb-5 leading-relaxed">Orders are capped at {litres(max)} litres, the legal limit for one load. Fees apply to orders created after you save. Existing orders keep the fee they were created with.</p>
      {msg && <p role={msg.ok ? 'status' : 'alert'} className={`mb-4 p-3 rounded-lg text-sm font-bold ${msg.ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}>{msg.text}</p>}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {tiers.map((t, i) => {
          const fee = Number(t.totalFee) || 0;
          return (
            <div key={`${t.minLiters}-${t.maxLiters}`} className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-[1fr_12rem_1fr] gap-3 sm:gap-5 sm:items-center">
              <div>
                <div className="font-extrabold text-cas-slate">{litres(t.minLiters)} to {litres(t.maxLiters)} L</div>
                <div className="text-xs text-cas-muted mt-0.5">Per order</div>
              </div>
              <div>
                <label htmlFor={`fee-${i}`} className="block text-xs font-bold text-cas-muted mb-1">Total fee (naira)</label>
                <input id={`fee-${i}`} type="number" min="0" step="0.01" inputMode="decimal" value={t.totalFee} onChange={(e) => setFee(i, e.target.value)} placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
              </div>
              <div className="text-xs text-cas-muted sm:text-right">
                {fee > 0 ? <>Buyer pays <strong className="text-cas-slate">{naira(fee / 2)}</strong><br />Vendor pays <strong className="text-cas-slate">{naira(fee / 2)}</strong></> : 'No commission'}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={save} disabled={saving} className="mt-5 px-6 py-2.5 rounded-xl bg-cas-slate text-white text-sm font-bold disabled:opacity-40">{saving ? 'Saving' : 'Save fees'}</button>
    </div>
  );
}
