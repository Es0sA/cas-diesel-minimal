import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { api } from '../api';

const STATUS = {
  DRAFT: { label: 'Awaiting funding', cls: 'bg-slate-100 text-slate-700' },
  FUNDED: { label: 'Funded', cls: 'bg-cas-blueLight text-cas-blue' },
  IN_TRANSIT: { label: 'In transit', cls: 'bg-cas-amberLight text-cas-amberDark' },
  ARRIVED: { label: 'Arrived', cls: 'bg-cas-amberLight text-cas-amberDark' },
  SETTLING: { label: 'Settling', cls: 'bg-cas-blueLight text-cas-blue' },
  CANCEL_REQUESTED: { label: 'Cancel requested', cls: 'bg-rose-50 text-rose-700' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-slate-100 text-slate-700' },
  DELIVERED: { label: 'Delivered', cls: 'bg-cas-greenLight text-cas-green' },
  DISPUTED: { label: 'In dispute', cls: 'bg-rose-50 text-rose-700' }
};

const statusOf = (s) => STATUS[s] || { label: s, cls: 'bg-slate-100 text-slate-700' };
const day = (d) => new Date(d).toLocaleDateString([], { dateStyle: 'medium' });

function StatusChip({ status }) {
  const { label, cls } = statusOf(status);
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>{label}</span>;
}

// Buyer's orders, newest first. `onLoaded` lets a parent reuse the same fetch.
export default function MyOrders({ onLoaded }) {
  const [orders, setOrders] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api.orders.list({ limit: 100 })
      .then((res) => {
        if (cancelled) return;
        setOrders(res.orders || []);
        setTotal(res.total ?? (res.orders || []).length);
        if (onLoaded) onLoaded(res.orders || []);
      })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [onLoaded, attempt]);

  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm leading-relaxed">
        <span>{error}</span>
        <button type="button" onClick={() => { setError(null); setAttempt((n) => n + 1); }} className="btn-secondary h-9 px-4 text-xs">Try again</button>
      </div>
    );
  }

  if (orders === null) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cas-blue" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-2xl text-cas-muted bg-white">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
        <p>
          You have no active orders. Visit the{' '}
          <Link to="/" className="font-bold text-cas-slate underline underline-offset-2">Marketplace</Link> to start.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-[0.08em] text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="px-5 py-3">Vendor</th>
              <th scope="col" className="px-5 py-3 text-right">Volume</th>
              <th scope="col" className="px-5 py-3">Date</th>
              <th scope="col" className="px-5 py-3"><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cas-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-100/50 transition-colors">
                <td className="px-5 py-4"><StatusChip status={o.status} /></td>
                <td className="px-5 py-4 font-semibold text-cas-slate">{o.supplier?.companyName || 'Vendor'}</td>
                <td className="px-5 py-4 text-right font-medium text-slate-600 tabular-nums">{Number(o.volumeLiters).toLocaleString()} L</td>
                <td className="px-5 py-4 font-medium text-slate-600">{day(o.createdAt)}</td>
                <td className="px-5 py-4 text-right">
                  <Link to={`/orders/${o.id}`} className="font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to={`/orders/${o.id}`} className="block bg-white border border-cas-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-cas-slate leading-relaxed">{o.supplier?.companyName || 'Vendor'}</p>
                <StatusChip status={o.status} />
              </div>
              <p className="text-xs text-cas-muted mt-1.5 leading-relaxed">{Number(o.volumeLiters).toLocaleString()} L · {day(o.createdAt)}</p>
            </Link>
          </li>
        ))}
      </ul>

      {total > orders.length && (
        <p className="text-xs text-cas-muted mt-3 leading-relaxed">Showing the latest {orders.length} of {total} orders.</p>
      )}
    </div>
  );
}
