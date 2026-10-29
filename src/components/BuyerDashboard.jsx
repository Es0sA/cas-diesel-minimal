import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Truck, FileText, Plus } from 'lucide-react';
import { api } from '../api';
import { usePageTitle } from '../lib/usePageTitle';
import MyOrders from './MyOrders';

const naira = (n) => `₦${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

// Money is held for these statuses; deliveries are moving only for the first four.
const ESCROW_LOCKED = ['FUNDED', 'IN_TRANSIT', 'ARRIVED', 'SETTLING', 'CANCEL_REQUESTED', 'DISPUTED'];
const ACTIVE_DELIVERY = ['FUNDED', 'IN_TRANSIT', 'ARRIVED', 'SETTLING'];

function Metric({ icon: Icon, label, value, hint }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-slate-600">
        <Icon className="w-4 h-4 text-slate-500" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="mt-3 text-3xl font-display tabular-nums font-bold tracking-tight text-cas-slate leading-relaxed">{value}</p>
      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{hint}</p>
    </div>
  );
}

export default function BuyerDashboard() {
  usePageTitle('Dashboard', 'Your escrow balance, active deliveries, open requests and orders on CAS Diesel.');
  const [company, setCompany] = useState(null);
  const [orders, setOrders] = useState(null);
  const [rfqs, setRfqs] = useState(null);

  useEffect(() => {
    api.companies.getProfile().then((res) => setCompany(res?.company || res)).catch(() => {});
    api.rfqs.list().then((r) => setRfqs(r.rfqs || [])).catch(() => setRfqs([]));
  }, []);

  const onOrders = useCallback((list) => setOrders(list), []);

  const locked = orders ? orders.filter((o) => ESCROW_LOCKED.includes(o.status)).reduce((sum, o) => sum + Number(o.totalEscrowAmount || 0), 0) : null;
  const active = orders ? orders.filter((o) => ACTIVE_DELIVERY.includes(o.status)).length : null;
  const pending = rfqs ? rfqs.filter((r) => r.status === 'OPEN').length : null;
  const dash = '-';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 leading-relaxed">Buyer dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight mt-1 leading-tight">
            Welcome{company?.companyName ? `, ${company.companyName}` : ''}
          </h1>
          <p className="text-sm text-cas-muted mt-1 leading-relaxed">Your escrow, deliveries and requests in one place.</p>
        </div>
        <Link to="/rfqs" className="btn-primary">
          <Plus className="w-4 h-4" aria-hidden="true" /> New request
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Metric icon={Lock} label="Escrow locked" value={locked === null ? dash : naira(locked)} hint="Held until delivery is verified at your gate" />
        <Metric icon={Truck} label="Active deliveries" value={active === null ? dash : active} hint="Funded orders that are not yet settled" />
        <Metric icon={FileText} label="Pending RFQs" value={pending === null ? dash : pending} hint="Open requests waiting for vendor quotes" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-cas-slate leading-tight">My orders</h2>
        <Link to="/rfqs" className="inline-flex items-center min-h-[44px] text-sm font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900">View requests</Link>
      </div>
      <MyOrders onLoaded={onOrders} />
    </div>
  );
}
