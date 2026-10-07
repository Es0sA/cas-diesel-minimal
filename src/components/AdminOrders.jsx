import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { Search, Download } from 'lucide-react';

const STATUSES = ['DRAFT', 'FUNDED', 'IN_TRANSIT', 'ARRIVED', 'CANCEL_REQUESTED', 'CANCELLED', 'DELIVERED', 'DISPUTED'];
const PAGE_SIZE = 20;

export default function AdminOrders() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ orders: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filters = useCallback(() => {
    const f = {};
    if (q.trim()) f.q = q.trim();
    if (status) f.status = status;
    if (from) f.from = from;
    if (to) f.to = to;
    return f;
  }, [q, status, from, to]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.admin.getOrders({ ...filters(), page, limit: PAGE_SIZE });
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load orders.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [filters, page]);

  const updateFilter = (setter) => (e) => { setter(e.target.value); setPage(1); };

  const exportCsv = async () => {
    try {
      await api.admin.exportOrdersCsv(filters());
    } catch (err) {
      setError(err.message || 'Could not export orders.');
    }
  };

  const pages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const inputClass = 'px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm';

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="ord-search" className="block text-xs font-bold text-slate-700 mb-1">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" aria-hidden="true" />
            <input id="ord-search" type="text" value={q} onChange={updateFilter(setQ)} placeholder="Order ID, buyer or marketer" className={`${inputClass} w-full pl-9`} />
          </div>
        </div>
        <div>
          <label htmlFor="ord-status" className="block text-xs font-bold text-slate-700 mb-1">Status</label>
          <select id="ord-status" value={status} onChange={updateFilter(setStatus)} className={inputClass}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ord-from" className="block text-xs font-bold text-slate-700 mb-1">From</label>
          <input id="ord-from" type="date" value={from} onChange={updateFilter(setFrom)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="ord-to" className="block text-xs font-bold text-slate-700 mb-1">To</label>
          <input id="ord-to" type="date" value={to} onChange={updateFilter(setTo)} className={inputClass} />
        </div>
        <button type="button" onClick={exportCsv} className="px-4 py-2 rounded-lg bg-cas-slate text-white text-sm font-bold flex items-center gap-2 hover:bg-black">
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Export CSV</span>
        </button>
      </div>

      {error && <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-cas-muted uppercase">Order</th>
              <th className="p-4 text-xs font-bold text-cas-muted uppercase">Date</th>
              <th className="p-4 text-xs font-bold text-cas-muted uppercase">Buyer</th>
              <th className="p-4 text-xs font-bold text-cas-muted uppercase">Marketer</th>
              <th className="p-4 text-xs font-bold text-cas-muted uppercase text-right">Litres</th>
              <th className="p-4 text-xs font-bold text-cas-muted uppercase text-right">Total</th>
              <th className="p-4 text-xs font-bold text-cas-muted uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="p-4 text-sm font-mono text-slate-800">{o.id.slice(0, 8)}</td>
                <td className="p-4 text-sm text-slate-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-sm text-slate-800">{o.buyer?.companyName || 'N/A'}</td>
                <td className="p-4 text-sm text-slate-800">{o.supplier?.companyName || 'N/A'}</td>
                <td className="p-4 text-sm text-slate-800 text-right">{o.volumeLiters?.toLocaleString()}</td>
                <td className="p-4 text-sm font-bold text-cas-slate text-right">{Number(o.totalEscrowAmount || 0).toLocaleString()}</td>
                <td className="p-4 text-xs font-bold text-slate-700">{o.status.replace(/_/g, ' ')}</td>
              </tr>
            ))}
            {!loading && data.orders.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-cas-muted text-sm font-bold">No orders match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{data.total} order{data.total === 1 ? '' : 's'}</span>
        <div className="flex items-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold disabled:opacity-40">Previous</button>
          <span>Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
