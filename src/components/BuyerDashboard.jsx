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
    <div className="bg-white border border-cas-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cas-muted">
        <Icon className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-cas-slate tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-cas-muted">{hint}</p>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-cas-amberDark">Buyer dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight mt-1">
            Welcome{company?.companyName ? `, ${company.companyName}` : ''}
          </h1>
          <p className="text-sm text-cas-muted mt-1">Your escrow, deliveries and requests in one place.</p>
        </div>
        <Link to="/rfqs" className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] bg-cas-amber hover:bg-cas-amberDark text-cas-slate hover:text-white text-sm font-bold rounded-lg">
          <Plus className="w-4 h-4" aria-hidden="true" /> New request
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Metric icon={Lock} label="Escrow locked" value={locked === null ? dash : naira(locked)} hint="Held until delivery is verified at your gate" />
        <Metric icon={Truck} label="Active deliveries" value={active === null ? dash : active} hint="Funded orders that are not yet settled" />
        <Metric icon={FileText} label="Pending RFQs" value={pending === null ? dash : pending} hint="Open requests waiting for vendor quotes" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-cas-slate">My orders</h2>
        <Link to="/rfqs" className="inline-flex items-center min-h-[44px] text-sm font-bold text-cas-amberDark hover:underline">View requests</Link>
      </div>
      <MyOrders onLoaded={onOrders} />
    </div>
  );
}
