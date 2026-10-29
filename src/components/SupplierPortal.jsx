import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import KycUpload from './KycUpload';
import { DEPOTS } from '../data/depots';
import { usePageTitle } from '../lib/usePageTitle';
import { closesIn, URGENCY_STYLE } from '../lib/rfqUrgency';
import PendingAcceptance from './PendingAcceptance';

const ACTIVE_STATUSES = ['FUNDED', 'IN_TRANSIT', 'ARRIVED', 'SETTLING'];
const HISTORY_STATUSES = ['DELIVERED', 'CANCELLED', 'COMPLETED'];
const naira = (n) => `₦${Number(n || 0).toLocaleString()}`;

// Where the load goes: receiver and city/state from the RFQ, else the gate coordinates, else nothing.
function destinationOf(ord) {
  const d = ord.delivery || {};
  const place = [d.city, d.state].filter(Boolean).join(', ');
  const parts = [d.receiverName, place].filter(Boolean);
  if (parts.length) return parts.join(' · ');
  if (ord.targetLatitude != null) return `${ord.targetLatitude}, ${ord.targetLongitude}`;
  return 'Not set';
}

function Kpi({ label, value, hint, tone = 'text-cas-slate' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-cas-muted leading-relaxed">{label}</p>
      <p className={`mt-2 text-3xl font-display tabular-nums font-bold tracking-tight ${tone}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-600 leading-relaxed">{hint}</p>}
    </div>
  );
}

export default function SupplierPortal() {
  usePageTitle('Vendor Desk', 'Publish your spot price, manage standing rates, and track escrow-protected orders on the CAS Diesel vendor desk.');
  const navigate = useNavigate();
  const viewOrder = (id) => navigate(`/orders/${id}`);

  const [profile, setProfile] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [dailySpotPrice, setDailySpotPrice] = useState(0);
  const [availableLitres, setAvailableLitres] = useState(0);
  const [minOrderVolume, setMinOrderVolume] = useState(0);
  const [saveAlert, setSaveAlert] = useState(false);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverChoice, setDriverChoice] = useState({});
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [dispatchMsg, setDispatchMsg] = useState({});
  const [activeOrders, setActiveOrders] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [openRfqs, setOpenRfqs] = useState(null);
  const [myQuotes, setMyQuotes] = useState([]);

  const loadOrders = useCallback(async () => {
    try {
      let data;
      if (filterStatus === 'Completed') data = await api.orders.list({ status: 'DELIVERED' });
      else if (filterStatus === 'Cancelled') data = await api.orders.list({ status: 'CANCELLED' });
      else data = await api.orders.list();

      // Live orders live in Active Orders above; history is only what has finished
      const rows = (data?.orders || []).filter((o) => HISTORY_STATUSES.includes(o.status));
      setOrders(rows);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const loadActive = useCallback(() => (
    api.orders.list()
      .then((data) => {
        const rows = data?.orders || [];
        setActiveOrders(rows.filter((o) => ACTIVE_STATUSES.includes(o.status)));
        setPendingOrders(rows.filter((o) => o.status === 'PENDING_VENDOR_ACCEPTANCE'));
      })
      .catch((err) => { console.error('Failed to fetch active orders', err); setActiveOrders([]); setPendingOrders([]); })
  ), []);

  useEffect(() => {
    setLoading(true);
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    loadActive();
    api.rfqs.list().then((r) => setOpenRfqs(r.rfqs || [])).catch(() => setOpenRfqs([]));
    api.rfqs.myQuotes().then((r) => setMyQuotes(r.quotes || [])).catch(() => {});
  }, [loadActive]);

  useEffect(() => {
    api.companies.getProfile()
      .then(({ company }) => {
        setProfile(company);
        setDailySpotPrice(company.pricePerLitre ?? 0);
        setAvailableLitres(company.availableLitres ?? 0);
        setMinOrderVolume(company.minOrderVolume ?? 0);
      })
      .catch(() => setProfileMissing(true));
    api.drivers.list()
      .then((res) => setDrivers(res.drivers || []))
      .catch((err) => console.error('Failed to fetch drivers', err));
  }, []);

  const handleUpdatePricing = async (e) => {
    e.preventDefault();
    try {
      await api.companies.editProfile({
        pricePerLitre: Number(dailySpotPrice),
        availableLitres: Number(availableLitres),
        minOrderVolume: Number(minOrderVolume)
      });
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update pricing. Please try again.');
    }
  };

  const handleDispatch = async (orderId) => {
    const driverId = driverChoice[orderId];
    if (!driverId) return;
    const say = (tone, text) => setDispatchMsg((prev) => ({ ...prev, [orderId]: text ? { tone, text } : undefined }));
    try {
      setDispatchingId(orderId);
      say();
      const res = await api.orders.dispatch(orderId, { driverId });
      await Promise.all([loadOrders(), loadActive()]);
      const gaps = res.standingDocs?.missing || [];
      if (gaps.length) say('warn', `Dispatched, but the driver has no approved, unexpired ${gaps.map((g) => g.type === 'DRIVER_ID' ? 'driver licence' : 'truck calibration chart').join(' or ')} on file. Ask the driver to upload it in their profile, or add the document on the order page, or the buyer cannot clear offloading.`);
    } catch (err) {
      say('error', err.message || 'Dispatch failed. Please try again.');
    } finally {
      setDispatchingId(null);
    }
  };

  const escrowInSettlement = (activeOrders || [])
    .reduce((sum, o) => sum + (o.totalEscrowAmount || 0), 0);
  const depotName = DEPOTS.find((d) => d.id === profile?.depotId)?.name || (profile?.depotId === 'other' && profile?.businessAddress ? profile.businessAddress : profile?.depotId) || 'Depot not set';

  const renderOrder = (ord, canDispatch) => (
    <div key={ord.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-mono font-bold text-xs text-slate-500">#{ord.id.slice(0, 8).toUpperCase()}</span>
          <h4 className="font-extrabold text-base text-cas-slate leading-tight">{ord.buyer?.companyName || 'Unknown Buyer'}</h4>
          <span className="text-xs text-slate-600">
            Destination: {destinationOf(ord)}
          </span>
        </div>
        <div className="sm:text-right">
          <span className="text-xs font-bold text-cas-muted block">Escrow Amount</span>
          <span className="text-xl font-display tabular-nums font-bold tracking-tight text-cas-green">
            ₦{(ord.totalEscrowAmount || 0).toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 block">({ord.volumeLiters.toLocaleString()} Litres)</span>
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-cas-muted block">Current Status:</span>
          <span className="font-bold text-cas-slate flex items-center gap-1.5 mt-0.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>{ord.status}</span>
          </span>
        </div>

        {canDispatch && ord.status === 'FUNDED' && !ord.driver ? (
          <div className="flex flex-wrap items-center gap-2 w-full">
            <p className="w-full text-sm text-slate-500 leading-relaxed mb-1">Select a verified driver to authorize this delivery for transit. Confirm the driver's details before proceeding, as this action initiates the dispatch process for the assigned order.</p>
            <select
              value={driverChoice[ord.id] || ''}
              onChange={(e) => { setDriverChoice((prev) => ({ ...prev, [ord.id]: e.target.value })); setDispatchMsg((prev) => ({ ...prev, [ord.id]: undefined })); }}
              disabled={drivers.length === 0}
              className="w-full sm:w-auto sm:flex-1 min-w-0 min-h-[44px] sm:min-h-0 sm:h-9 px-2 bg-white border border-slate-300 rounded font-semibold text-xs text-cas-slate"
              aria-label="Select verified driver"
            >
              <option value="">{drivers.length ? 'Select driver' : 'No verified drivers yet'}</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName} ({d.truckPlateNumber || 'no plate'}){d.truckCapacityLiters ? ` - ${d.truckCapacityLiters.toLocaleString()}L` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleDispatch(ord.id)}
              disabled={dispatchingId === ord.id || !driverChoice[ord.id]}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-0 sm:h-9 px-4 bg-cas-slate hover:bg-black text-white font-bold rounded text-xs transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cas-slate"
            >
              {dispatchingId === ord.id ? 'Dispatching...' : 'Authorize Dispatch'}
            </button>
            {drivers.length === 0 && (
              <p className="w-full text-cas-muted leading-relaxed">No verified drivers are available yet. A driver must register and be verified by CAS before you can dispatch.</p>
            )}
          </div>
        ) : ord.driver ? (
          <div className="text-left sm:text-right">
            <span className="text-cas-muted block">Dispatched Tanker Driver:</span>
            <span className="font-bold text-cas-slate">
              {ord.driver.firstName} {ord.driver.lastName} ({ord.driver.truckPlateNumber || 'no plate'})
            </span>
            {ord.lastLocationAt && (
              <span className="text-cas-muted block mt-0.5">
                Last location: {new Date(ord.lastLocationAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        ) : ord.status === 'DRAFT' || ord.status === 'FUNDED' ? (
          <div className="text-cas-muted">{ord.status === 'DRAFT' ? 'Awaiting funding' : 'Awaiting driver assignment'}</div>
        ) : null}
      </div>
      {dispatchMsg[ord.id] && (
        <p role={dispatchMsg[ord.id].tone === 'error' ? 'alert' : 'status'} className={`p-3 rounded-lg border text-xs font-semibold ${dispatchMsg[ord.id].tone === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          {dispatchMsg[ord.id].text}
        </p>
      )}
      <div className="flex justify-end border-t border-slate-200 pt-3">
        <button onClick={() => viewOrder(ord.id)} className="inline-flex items-center min-h-[44px] text-sm font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors">View Full Details &rarr;</button>
      </div>
    </div>
  );

  const liveQuoteRows = myQuotes.filter((q) => q.status !== 'DRAFT' && q.status !== 'WITHDRAWN');
  const liveQuotes = liveQuoteRows.length;
  const quotedTotal = liveQuoteRows
    .reduce((sum, q) => sum + (Number(q.pricePerLitre) || 0) * (Number(q.rfq?.volumeLiters) || 0), 0);
  const pendingRfqs = (openRfqs || []).filter((r) => !r.myQuote);

  return (
    <section id="supplier-desk" className="bg-cas-canvas py-12 md:py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cas-greenLight text-cas-green text-xs font-bold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Downstream Vendor Operations Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight leading-tight break-words line-clamp-2">
            {profile ? `${profile.companyName} Operations Desk` : 'Vendor Operations Desk'}
          </h1>
          <p className="text-base text-cas-muted mt-2 leading-relaxed">
            Manage your supply commitments, respond to procurement requests and coordinate high-value diesel deliveries from one operational dashboard.
          </p>
        </div>

        {profileMissing && (
          <div className="p-4 mb-6 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-sm font-bold">
            No company profile found for this account. Complete your company profile before publishing rates.
          </div>
        )}

        {profile && !profile.isVerified && <KycUpload types={['CAC_CERT', 'NMDPRA_LICENCE']} />}

        {profile && !profile.isVerified && (
          <div className="p-4 mb-6 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-sm font-bold">
            Your company is awaiting verification by CAS. You will appear in the marketplace once approved.
          </div>
        )}

        {saveAlert && (
          <div className="p-4 mb-6 bg-emerald-50 border border-emerald-400 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cas-green shrink-0" aria-hidden="true" />
            <span>Market rates successfully broadcast to CAS Diesel Marketplace.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Kpi label="Quoted Pipeline" value={naira(quotedTotal)} hint={`${liveQuotes} live quote${liveQuotes === 1 ? '' : 's'}`} />
          <Kpi label="Active Supply Orders" value={activeOrders === null ? '...' : activeOrders.length} hint="Funded, in transit or at the gate" tone="text-slate-900" />
          <Kpi label="Open Procurement Requests" value={openRfqs === null ? '...' : pendingRfqs.length} hint="Open and not yet quoted by you" tone="text-slate-900" />
        </div>

        {pendingOrders.length > 0 && (
          <section aria-label="Orders waiting for your confirmation" className="mb-8 space-y-3">
            {pendingOrders.map((ord) => (
              <div key={ord.id}>
                <p className="text-xs font-bold text-cas-muted mb-1.5">Order #{ord.id.slice(0, 8).toUpperCase()}: {ord.volumeLiters.toLocaleString()} Litres, ₦{(ord.totalEscrowAmount || 0).toLocaleString()}</p>
                <PendingAcceptance order={ord} role="VENDOR" compact onChanged={() => Promise.all([loadOrders(), loadActive()])} />
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="pb-4 border-b border-slate-200 mb-6">
              <h2 className="font-extrabold text-xl text-cas-slate leading-tight">Active Supply Orders</h2>
              <span className="text-xs text-slate-600">Funded orders waiting for a driver, and loads on the road</span>
            </div>
            {activeOrders === null ? (
              <div className="py-8 text-center text-cas-muted text-sm font-bold">Loading orders...</div>
            ) : activeOrders.length === 0 ? (
              <div className="py-8 text-center text-cas-muted text-sm">
                <p className="font-bold leading-relaxed">No Active Supply Orders</p>
                <p className="mt-1 leading-relaxed">You have no orders awaiting fulfilment at this time. New funded orders will appear here when they are ready for dispatch.</p>
              </div>
            ) : (
              <div className="space-y-4">{activeOrders.map((ord) => renderOrder(ord, true))}</div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="font-extrabold text-xl text-cas-slate leading-tight">Open Procurement Requests</h2>
                <span className="text-xs text-slate-600">Buyers waiting for a price</span>
              </div>
              <Link to="/rfqs" className="inline-flex items-center gap-1 min-h-[44px] text-sm font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900">
                See all <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
            {openRfqs === null ? (
              <div className="py-8 text-center text-cas-muted text-sm font-bold">Loading requests...</div>
            ) : openRfqs.length === 0 ? (
              <div className="py-8 text-center text-cas-muted text-sm">
                <p className="font-bold leading-relaxed">No open requests right now.</p>
                <p className="mt-1 leading-relaxed">{profile && !profile.isVerified ? 'You will see requests once CAS verifies your company.' : 'New requests show up here as buyers post them.'}</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {openRfqs.slice(0, 5).map((r) => {
                  const urgency = closesIn(r.expiresAt);
                  return (
                    <li key={r.id}>
                      <Link to={`/rfqs/${r.id}`} className="flex items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-cas-amber transition-colors">
                        <div className="min-w-0">
                          <p className="font-extrabold text-cas-slate leading-relaxed">{Number(r.volumeLiters).toLocaleString()} L</p>
                          <p className="text-xs text-slate-600 truncate leading-relaxed">{r.buyerName} · {[r.city, r.state].filter(Boolean).join(', ') || 'Location not given'}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${URGENCY_STYLE[urgency.tone]}`}>{urgency.label}</span>
                          <span className="text-xs font-bold text-cas-slate">{r.myQuote ? `Quoted ${naira(r.myQuote.pricePerLitre)}` : 'Quote now'}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="font-extrabold text-base text-cas-slate leading-tight">Daily Spot Management</h2>
                <span className="text-xs text-slate-600">Depot: {depotName}</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${profile?.isVerified ? 'bg-emerald-50 text-cas-green border-emerald-200' : 'bg-slate-50 text-cas-muted border-slate-200'}`}>
                {profile?.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>

            <form onSubmit={handleUpdatePricing} className="space-y-5">
              <div>
                <label htmlFor="spot-price" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Your Spot Price Per Litre (Ex-Depot)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-cas-slate font-display font-bold">₦</span>
                  <input
                    id="spot-price"
                    type="number"
                    min="1"
                    value={dailySpotPrice}
                    onChange={(e) => setDailySpotPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-lg font-display tabular-nums font-bold tracking-tight text-cas-slate focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stock-vol" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Available Gantry Volume (Litres)
                </label>
                <input
                  id="stock-vol"
                  type="number"
                  min="0"
                  step="1000"
                  value={availableLitres}
                  onChange={(e) => setAvailableLitres(Number(e.target.value))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg font-mono font-bold text-sm text-cas-slate focus:border-cas-amber"
                />
              </div>

              <div>
                <label htmlFor="moq" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Minimum Order Quantity (Litres)
                </label>
                <input
                  id="moq"
                  type="number"
                  min="1"
                  step="1"
                  value={minOrderVolume}
                  onChange={(e) => setMinOrderVolume(Number(e.target.value))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg font-mono font-bold text-sm text-cas-slate focus:border-cas-amber"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!profile}
                  className="btn-primary w-full"
                >
                  Publish Updated Rates to Marketplace
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Total Escrow In Settlement:</span>
                <strong className="font-mono text-cas-slate">₦{escrowInSettlement.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-4">
                <div>
                  <h3 className="font-extrabold text-xl text-cas-slate leading-tight">Order History</h3>
                  <span className="text-xs text-slate-600">Completed and cancelled orders</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  {orders.length} Orders
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['All', 'Completed', 'Cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterStatus(tab)}
                    className={`px-5 min-h-[44px] rounded-full text-xs font-bold transition-colors ${
                      filterStatus === tab
                        ? 'bg-cas-amber text-slate-900 border border-cas-amber'
                        : 'bg-transparent text-cas-slate border border-slate-300 hover:border-cas-amber'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="py-8 text-center text-cas-muted text-sm font-bold">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-8 text-center text-cas-muted text-sm font-bold">No orders found.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => renderOrder(ord, false))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
