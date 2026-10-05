import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { DEPOTS } from '../data/depots';

const ACTIVE_STATUSES = ['FUNDED', 'IN_TRANSIT', 'ARRIVED'];

export default function SupplierPortal() {
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

  const loadOrders = useCallback(async () => {
    try {
      let data;
      if (filterStatus === 'Completed') data = await api.orders.list({ status: 'DELIVERED' });
      else if (filterStatus === 'Cancelled') data = await api.orders.list({ status: 'CANCELLED' });
      else data = await api.orders.list();

      let rows = data?.orders || [];
      if (filterStatus === 'Active') rows = rows.filter((o) => ACTIVE_STATUSES.includes(o.status));
      setOrders(rows);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    setLoading(true);
    loadOrders();
  }, [loadOrders]);

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
    if (!driverId) {
      alert('Select a driver first.');
      return;
    }
    try {
      setDispatchingId(orderId);
      await api.orders.dispatch(orderId, { driverId });
      await loadOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setDispatchingId(null);
    }
  };

  const escrowInSettlement = orders
    .filter((o) => ACTIVE_STATUSES.includes(o.status))
    .reduce((sum, o) => sum + (o.totalEscrowAmount || 0), 0);
  const depotName = DEPOTS.find((d) => d.id === profile?.depotId)?.name || profile?.depotId || 'Depot not set';

  return (
    <section id="supplier-desk" className="bg-cas-canvas py-12 md:py-20 border-b border-cas-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cas-greenLight text-cas-green text-xs font-bold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Downstream Marketer Operations Desk</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
            {profile ? `${profile.companyName} Operations Desk` : 'Marketer Operations Desk'}
          </h1>
          <p className="text-base text-cas-muted mt-2">
            Set your daily spot price per litre and review confirmed escrow allocations.
          </p>
        </div>

        {profileMissing && (
          <div className="p-4 mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 text-sm font-bold">
            No company profile found for this account. Complete your company profile before publishing rates.
          </div>
        )}

        {profile && !profile.isVerified && (
          <div className="p-4 mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 text-sm font-bold">
            Your company is awaiting verification by CAS. You will appear in the marketplace once approved.
          </div>
        )}

        {saveAlert && (
          <div className="p-4 mb-6 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cas-green shrink-0" aria-hidden="true" />
            <span>Market rates successfully broadcast to CAS Energy Marketplace.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border-2 border-cas-border shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="font-extrabold text-base text-cas-slate">Daily Spot Management</h2>
                <span className="text-xs text-cas-muted">Depot: {depotName}</span>
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
                  <span className="absolute left-3 top-3 text-cas-slate font-bold font-mono">₦</span>
                  <input
                    id="spot-price"
                    type="number"
                    min="1"
                    value={dailySpotPrice}
                    onChange={(e) => setDailySpotPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-lg font-bold font-mono text-cas-slate focus:border-cas-amber"
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
                  step="1000"
                  value={minOrderVolume}
                  onChange={(e) => setMinOrderVolume(Number(e.target.value))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg font-mono font-bold text-sm text-cas-slate focus:border-cas-amber"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!profile}
                  className="w-full py-3.5 px-4 bg-cas-slate hover:bg-black text-white font-extrabold text-sm rounded-lg transition-all shadow border-2 border-transparent hover:border-cas-amber disabled:opacity-50"
                >
                  Publish Updated Rates to Marketplace
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 text-xs text-cas-muted space-y-2">
              <div className="flex justify-between">
                <span>Total Escrow In Settlement:</span>
                <strong className="font-mono text-cas-slate">₦{escrowInSettlement.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-cas-border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-cas-slate">Confirmed Inbound Escrow Orders</h3>
                  <span className="text-xs text-cas-muted">Funds guaranteed in CAS Escrow prior to dispatch</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-cas-amberLight text-cas-amberDark rounded-full border border-cas-amber/50">
                  {orders.length} Orders
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterStatus(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      filterStatus === tab
                        ? 'bg-cas-amber text-slate-900 border-2 border-cas-amber'
                        : 'bg-transparent text-cas-slate border-2 border-slate-300 hover:border-cas-amber'
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
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-mono font-bold text-xs text-cas-amberDark">#{ord.id.slice(0, 8).toUpperCase()}</span>
                          <h4 className="font-extrabold text-base text-cas-slate">{ord.buyer?.companyName || 'Unknown Buyer'}</h4>
                          <span className="text-xs text-cas-muted">
                            Destination: {ord.targetLatitude != null ? `${ord.targetLatitude}, ${ord.targetLongitude}` : 'Not set'}
                          </span>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-xs font-bold text-cas-muted block">Escrow Amount</span>
                          <span className="text-xl font-extrabold font-mono text-cas-green">
                            ₦{(ord.totalEscrowAmount || 0).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 block">({ord.volumeLiters.toLocaleString()} Litres)</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-cas-muted block">Current Status:</span>
                          <span className="font-bold text-cas-slate flex items-center gap-1.5 mt-0.5">
                            <Lock className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
                            <span>{ord.status}</span>
                          </span>
                        </div>

                        {ord.status === 'FUNDED' && !ord.driver ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                            <select
                              value={driverChoice[ord.id] || ''}
                              onChange={(e) => setDriverChoice((prev) => ({ ...prev, [ord.id]: e.target.value }))}
                              className="w-full sm:w-auto h-9 px-2 bg-white border border-slate-300 rounded font-semibold text-xs text-cas-slate"
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
                              disabled={dispatchingId === ord.id}
                              className="h-9 px-4 bg-cas-slate hover:bg-black text-white font-bold rounded text-xs transition-colors shrink-0 disabled:opacity-50"
                            >
                              {dispatchingId === ord.id ? 'Dispatching...' : 'Assign & Dispatch'}
                            </button>
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
                        ) : (
                          <div className="text-cas-muted">Awaiting funding</div>
                        )}
                      </div>
                      <div className="flex justify-end border-t border-slate-200 pt-3">
                        <button onClick={() => viewOrder(ord.id)} className="text-xs font-bold text-cas-slate hover:text-cas-blue transition-colors">View Full Details &rarr;</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
