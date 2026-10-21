import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { DEPOTS } from '../data/depots';
import { usePageTitle } from '../lib/usePageTitle';

const AREAS = ['All', ...Array.from(new Set(DEPOTS.map((d) => d.area)))];
const naira = (n) => `₦${Number(n).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
const ago = (iso) => new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function Depots({ user }) {
  usePageTitle('Depot prices', 'Current loading prices at depots across Nigeria, updated by CAS from depot sales teams.');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [area, setArea] = useState('All');

  useEffect(() => {
    api.depots.prices().then(setPrices).catch(() => setError('Could not load depot prices. Please try again.')).finally(() => setLoading(false));
  }, []);

  const byDepot = useMemo(() => {
    const m = {};
    prices.forEach((p) => { (m[p.depotId] ||= {})[p.product] = p; });
    return m;
  }, [prices]);

  const rows = DEPOTS.filter((d) => area === 'All' || d.area === area)
    .map((d) => ({ ...d, price: byDepot[d.id]?.AGO }))
    .sort((a, b) => (a.price ? a.price.price : Infinity) - (b.price ? b.price.price : Infinity));

  return (
    <section className="bg-cas-canvas py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="text-xs font-bold uppercase tracking-wider text-cas-amberDark mb-2">Depot prices</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">Compare depot prices before you request</h1>
        <p className="mt-3 text-cas-muted max-w-2xl">Pick the depot you want your product loaded from, then post a request. Vendors quote the supply and delivery on top of the depot price.</p>

        <p className="mt-6 inline-flex items-center px-3 py-1.5 rounded-full bg-cas-slate text-white text-xs font-bold">Diesel (AGO), price per litre</p>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Area">
          {AREAS.map((s) => (
            <button key={s} onClick={() => setArea(s)} aria-pressed={area === s}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${area === s ? 'bg-cas-amber/20 text-cas-slate border-cas-amber' : 'bg-white text-cas-muted border-cas-border hover:border-slate-400'}`}>
              {s}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="mt-6 text-sm font-bold text-red-600">{error}</p>}
        {loading ? (
          <p className="mt-8 text-sm text-cas-muted font-bold">Loading prices...</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {rows.map((d) => (
              <li key={d.id} className="bg-white rounded-2xl border border-cas-border shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-extrabold text-cas-slate">{d.name}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-cas-muted"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{d.hub}, {d.state}</div>
                </div>
                <div className="sm:text-right">
                  {d.price ? (
                    <>
                      <div className="text-2xl font-extrabold text-cas-slate">{naira(d.price.price)}<span className="text-xs font-bold text-cas-muted ml-1">per litre</span></div>
                      <div className="mt-0.5 flex sm:justify-end items-center gap-1 text-xs text-cas-muted"><Clock className="w-3 h-3" aria-hidden="true" />Updated {ago(d.price.updatedAt)}</div>
                    </>
                  ) : (
                    <div className="text-sm font-bold text-cas-muted">No price listed yet</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <Link to={user ? '/rfqs' : '/register'} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cas-amber text-cas-slate font-extrabold text-sm hover:brightness-95 transition">
            {user ? 'Post a request' : 'Create an account to request'} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
