import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Truck, Navigation, MapPin, CheckCircle2, AlertCircle, UserPlus, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import KycUpload from './KycUpload';

const PING_INTERVAL_MS = 15000;
const STEPS = [
  { status: 'IN_TRANSIT', label: 'In transit' },
  { status: 'ARRIVED', label: 'Arrived at gate' },
  { status: 'DELIVERED', label: 'Delivered' }
];

// Shares the driver's GPS position with the server while the trip is in transit.
// The server marks the order ARRIVED automatically when the truck is within 100 m of the gate.
function LocationSharing({ order, onStatusChange }) {
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const positionRef = useRef(null);

  useEffect(() => {
    if (!sharing) return undefined;
    if (!navigator.geolocation) {
      setError('This device does not support location sharing.');
      setSharing(false);
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        positionRef.current = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setError('');
      },
      (err) => {
        setError(err.code === 1 ? 'Location permission denied. Allow location access in your browser settings.' : 'Waiting for a GPS signal...');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );

    const send = async () => {
      if (!positionRef.current) return;
      try {
        const res = await api.telemetry.ping(order.id, positionRef.current);
        const meters = typeof res.distanceMeters === 'number' ? Math.round(res.distanceMeters) : null;
        setMessage(meters != null ? `${meters.toLocaleString()} m from the gate` : res.message);
        if (res.order) {
          setSharing(false);
          onStatusChange();
        }
      } catch (err) {
        setError(err.message);
        if (/not in transit/i.test(err.message)) {
          setSharing(false);
          onStatusChange();
        }
      }
    };

    const first = setTimeout(send, 3000);
    const timer = setInterval(send, PING_INTERVAL_MS);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [sharing, order.id, onStatusChange]);

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cas-slate block">Live Location</span>
          <span className="text-xs text-cas-muted">
            {sharing ? 'Sharing every 15 seconds. Keep this page open.' : 'Share your location so the buyer can track the truck and arrival is detected automatically.'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => { setError(''); setMessage(''); setSharing((s) => !s); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 flex items-center gap-2 ${sharing ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-cas-slate text-white'}`}
        >
          <Radio className="w-4 h-4" aria-hidden="true" />
          {sharing ? 'Stop sharing' : 'Start sharing'}
        </button>
      </div>
      {message && <p className="text-xs font-bold text-cas-green mt-3">{message}</p>}
      {error && (
        <p className="text-xs text-rose-700 mt-3 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function DriverCockpit({ onNavigateToRegister }) {
  const navigate = useNavigate();
  const viewOrder = (id) => navigate(`/orders/${id}`);

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const data = await api.orders.list(filterStatus === 'Completed' ? { status: 'DELIVERED' } : {});
      let rows = data?.orders || [];
      if (filterStatus === 'Active') rows = rows.filter((o) => ['IN_TRANSIT', 'ARRIVED'].includes(o.status));
      setOrders(rows);
      setAuthError(false);
    } catch (err) {
      console.error('Failed to fetch driver orders', err);
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    setLoading(true);
    loadOrders();
  }, [loadOrders]);

  const driver = orders.find((o) => o.driver)?.driver;

  return (
    <section id="driver-cockpit" className="bg-cas-canvas py-6 sm:py-12 md:py-20 border-b border-cas-border">
      <div className="max-w-3xl mx-auto px-3 sm:px-8">
        {!authError && !loading && <KycUpload types={['DRIVER_LICENCE']} />}
        <div className="bg-white rounded-2xl border-2 border-cas-border shadow-md overflow-hidden">

          <div className="bg-cas-slate text-white p-4 sm:p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cas-amber text-slate-900 flex items-center justify-center font-bold shrink-0">
                  <Truck className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="font-extrabold text-base sm:text-lg text-white">
                    {driver ? `Driver ${driver.firstName} ${driver.lastName}` : 'Driver Cockpit'}
                  </h1>
                  <span className="text-xs text-slate-300">Your assigned deliveries</span>
                </div>
              </div>
              {driver?.truckPlateNumber && (
                <span className="font-mono font-bold text-xs bg-slate-800 text-cas-amber px-2.5 py-1.5 rounded-lg border border-slate-700 shrink-0">
                  {driver.truckPlateNumber}
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-wrap gap-2">
              {['Active', 'Completed'].map((tab) => (
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
          </div>

          {loading ? (
            <div className="p-8 text-center text-cas-muted text-sm font-bold">Loading deliveries...</div>
          ) : authError ? (
            <div className="p-8 text-center space-y-4">
              <p className="text-cas-muted text-sm font-bold">Sign in with a driver account to see your deliveries.</p>
              {onNavigateToRegister && (
                <button onClick={onNavigateToRegister} className="inline-flex items-center gap-2 px-4 py-2 bg-cas-slate text-white text-xs font-bold rounded-lg">
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  Register as a driver
                </button>
              )}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-cas-muted text-sm font-bold">
              {filterStatus === 'Active' ? 'No active deliveries. You will see a job here once a supplier dispatches you.' : 'No completed deliveries yet.'}
            </div>
          ) : (
            orders.map((order) => {
              const stepIndex = STEPS.findIndex((s) => s.status === order.status);
              const hasGate = order.targetLatitude != null && order.targetLongitude != null;
              return (
                <div key={order.id} className="p-4 sm:p-8 space-y-5 border-b border-slate-200 last:border-b-0">
                  <div className="p-4 sm:p-5 bg-amber-50 border-2 border-cas-amber rounded-xl">
                    <div className="text-xs sm:text-xs font-bold uppercase tracking-wider text-cas-amberDark mb-1">Dispatch Manifest</div>
                    <div className="text-lg sm:text-xl font-extrabold text-cas-slate">
                      Order #{order.id.slice(0, 8).toUpperCase()} ({order.volumeLiters.toLocaleString()} Litres AGO)
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      {order.supplier?.companyName} to {order.buyer?.companyName}
                    </div>
                    <div className="mt-3">
                      <button onClick={() => viewOrder(order.id)} className="text-xs font-bold text-cas-blue hover:underline">View Full Details &rarr;</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                    {STEPS.map((step, i) => (
                      <div
                        key={step.status}
                        className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 ${
                          i <= stepIndex ? 'bg-cas-green text-white border-cas-green' : 'bg-white text-cas-muted border-slate-300'
                        }`}
                      >
                        {i <= stepIndex && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>

                  {order.status === 'ARRIVED' && (
                    <p className="text-xs text-cas-muted">You are at the gate. The buyer confirms delivery after discharge, which releases payment to the supplier.</p>
                  )}

                  {order.status !== 'DELIVERED' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-cas-blue shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-cas-muted block">Delivery Destination</span>
                          <h2 className="font-extrabold text-base text-cas-slate mt-0.5">{order.buyer?.companyName}</h2>
                          {order.buyer?.businessAddress && <div className="text-xs text-cas-muted">{order.buyer.businessAddress}</div>}
                          <div className="text-xs font-mono text-cas-blue font-bold mt-1">
                            {hasGate ? `GPS: ${order.targetLatitude}, ${order.targetLongitude}` : 'Gate coordinates not set'}
                          </div>
                        </div>
                      </div>
                      {hasGate && (
                        <div className="mt-4 pt-3 border-t border-slate-200">
                          <a
                            href={`https://maps.google.com/?q=${order.targetLatitude},${order.targetLongitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 px-4 bg-cas-blue hover:bg-sky-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Navigation className="w-4 h-4" aria-hidden="true" />
                            <span>Open GPS Turn-by-Turn Route</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {order.status === 'IN_TRANSIT' && <LocationSharing order={order} onStatusChange={loadOrders} />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
