import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { DEPOTS } from '../data/depots';


export default function AdminDepotPrices() {
  const [prices, setPrices] = useState([]);
  const [draft, setDraft] = useState({});
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState('');

  const load = () => api.depots.prices().then(setPrices).catch(() => setMsg('Could not load prices.'));
  useEffect(() => { load(); }, []);

  const current = (depotId, product) => prices.find((p) => p.depotId === depotId && p.product === product);

  const save = async (depotId, product) => {
    const key = `${depotId}:${product}`;
    const price = Number(draft[key]);
    if (!Number.isFinite(price) || price <= 0) { setMsg('Enter a price above zero.'); return; }
    setSaving(key); setMsg('');
    try {
      await api.depots.setPrice({ depotId, product, price });
      setDraft((d) => { const n = { ...d }; delete n[key]; return n; });
      await load();
      setMsg('Price saved.');
    } catch (e) {
      setMsg(e.message || 'Could not save the price.');
    } finally { setSaving(''); }
  };

  return (
    <div>
      <p className="text-sm text-cas-muted mb-4">Enter prices exactly as the depot sales team gives them. These are diesel (AGO) prices per litre. Buyers see these publicly with the time of the last update.</p>
      {msg && <p role="status" className="mb-4 text-sm font-bold text-cas-slate">{msg}</p>}
      <div className="space-y-4">
        {DEPOTS.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
            <div className="font-extrabold text-cas-slate">{d.name} <span className="text-xs font-bold text-cas-muted">{d.state}</span></div>
            <div className="mt-3 max-w-md">
              {(() => {
                const p = 'AGO';
                const key = `${d.id}:${p}`;
                const cur = current(d.id, p);
                return (
                  <div>
                    <label htmlFor={`dp-${key}`} className="block text-xs font-bold text-cas-muted mb-1">Diesel per litre{cur ? `, now ${cur.price}` : ', not set'}</label>
                    <div className="flex gap-2">
                      <input id={`dp-${key}`} type="number" min="0" step="0.01" inputMode="decimal" value={draft[key] ?? ''} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                        className="w-full min-w-0 px-3 py-2 rounded-lg border border-slate-300 text-sm" placeholder={cur ? String(cur.price) : 'Price'} />
                      <button onClick={() => save(d.id, p)} disabled={!draft[key] || saving === key}
                        className="px-3 py-2 rounded-lg bg-cas-slate text-white text-xs font-bold disabled:opacity-40">{saving === key ? '...' : 'Save'}</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
