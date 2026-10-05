import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Navigation, Loader2 } from 'lucide-react';
import { api } from '../api';

export default function OrderCheckoutModal({ supplier, onClose, onSuccess }) {
  const [volume, setVolume] = useState(supplier.minOrderVolume || 33000);
  const [lat, setLat] = useState('6.5244'); // Default approx Lagos
  const [lng, setLng] = useState('3.3792');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalCost = volume * supplier.pricePerLitre;

  const handleSubmit = async (e) => {
    e.submitter?.setAttribute('disabled', 'true');
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const order = await api.orders.create({
        supplierId: supplier.id,
        volumeLiters: Number(volume),
        pricePerLiter: Number(supplier.pricePerLitre),
        targetLatitude: Number(lat),
        targetLongitude: Number(lng)
      });
      onSuccess(order.id);
    } catch (err) {
      setError(err.message || 'Failed to create order. Make sure you are logged in as a Buyer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-cas-border flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-extrabold text-cas-slate">Secure Escrow Checkout</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-800 rounded-xl flex gap-3 text-sm border border-rose-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h4 className="text-sm font-bold text-cas-slate mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cas-green" />
              Supplier Selected
            </h4>
            <p className="text-sm text-cas-muted font-medium">{supplier.companyName}</p>
            <p className="text-xs text-cas-muted mt-1">Spot Price: ₦{supplier.pricePerLitre}/L • Depot: {supplier.primaryDepot}</p>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fld-volume-litres-1" className="block text-sm font-bold text-cas-slate mb-1">Volume (Litres)</label>
              <input id="fld-volume-litres-1"
                type="number"
                required
                min={supplier.minOrderVolume}
                max={supplier.availableLitres || 999999}
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cas-border focus:border-cas-amber focus:ring-1 focus:ring-cas-amber outline-none transition-all text-sm font-mono"
              />
              <p className="text-xs text-cas-muted mt-1">Minimum Order: {supplier.minOrderVolume.toLocaleString()}L</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fld-gate-latitude-2" className="block text-sm font-bold text-cas-slate mb-1">Gate Latitude</label>
                <input id="fld-gate-latitude-2"
                  type="number"
                  step="any"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cas-border focus:border-cas-amber outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label htmlFor="fld-gate-longitude-3" className="block text-sm font-bold text-cas-slate mb-1">Gate Longitude</label>
                <input id="fld-gate-longitude-3"
                  type="number"
                  step="any"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cas-border focus:border-cas-amber outline-none text-sm font-mono"
                />
              </div>
            </div>
            <p className="text-xs text-cas-muted flex items-start gap-1">
              <Navigation className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              These coordinates lock the geofence. The supplier's truck must be within 100 meters of this point before discharge is permitted.
            </p>
          </form>
        </div>

        <div className="px-6 py-5 bg-slate-50 border-t border-cas-border flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-cas-muted">Total Escrow Required</span>
            <span className="text-2xl font-extrabold text-cas-slate font-mono">₦{totalCost.toLocaleString()}</span>
          </div>
          <button
            form="checkout-form"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-cas-slate hover:bg-black text-white text-sm font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Lock Price & Initialize Escrow</span>
            )}
          </button>
          <p className="text-xs text-center text-cas-muted">
            You will be redirected to the secure payment gateway on the next screen.
          </p>
        </div>
      </div>
    </div>
  );
}
