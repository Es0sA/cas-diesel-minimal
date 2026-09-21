import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Phone, MapPin, CheckCircle2, ShieldCheck, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function DriverCockpit({ onNavigateToRegister }) {
  // Active Trip Milestone State
  // 1 = loaded at depot, 2 = transit, 3 = arrived at gate, 4 = discharged
  const [tripStep, setTripStep] = useState(2);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (localStorage.getItem('cas_token')) {
          const data = await api.orders.list();
          if (data.orders && data.orders.length > 0) {
            setActiveOrder(data.orders[0]); // Just pick the first assigned order
          }
        }
      } catch (err) {
        console.error('Failed to fetch driver order', err);
      }
    };
    fetchOrder();
  }, []);

  return (
    <section id="driver-cockpit" className="bg-cas-canvas py-6 sm:py-12 md:py-20 border-b border-cas-border">
      <div className="max-w-3xl mx-auto px-3 sm:px-8">



        {/* Active Trip Manifest (Mobile First Cockpit) */}
        <div className="bg-white rounded-2xl border-2 border-cas-border shadow-md overflow-hidden">
          
          {/* Header / Driver Identity */}
          <div className="bg-cas-slate text-white p-4 sm:p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cas-amber text-slate-900 flex items-center justify-center font-bold shrink-0">
                  <Truck className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Driver Suleiman Tanko</h3>
                  <span className="text-xs text-slate-300">Fleet: Matrix Downstream Distribution Ltd</span>
                </div>
              </div>
              <span className="font-mono font-bold text-xs bg-slate-800 text-cas-amber px-2.5 py-1.5 rounded-lg border border-slate-700 shrink-0">
                LSR-492-XA
              </span>
            </div>
          </div>

          {/* Trip Manifest Body */}
          <div className="p-4 sm:p-8 space-y-5 sm:space-y-6">
            
            {/* Order Assignment Box */}
            <div className="p-4 sm:p-5 bg-amber-50 border-2 border-cas-amber rounded-xl">
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cas-amberDark mb-1">
                Active Dispatch Manifest
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-cas-slate">
                {activeOrder ? `Order #${activeOrder.id} (${activeOrder.volumeLiters.toLocaleString()} Litres AGO)` : 'Order #CAS-ORD-8812 (33,000 Litres AGO)'}
              </div>
              <div className="text-xs text-slate-700 mt-1">
                Escrow Verified by CAS Energy. Payment locked for delivery.
              </div>
            </div>

            {/* Waypoint Coordinates & Destination */}
            <div className="space-y-3 text-sm">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cas-blue shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cas-muted block">
                      Delivery Destination (Buyer Facility)
                    </span>
                    <h4 className="font-extrabold text-base text-cas-slate mt-0.5">
                      Standard Industrial Plant - Ikeja Terminal
                    </h4>
                    <div className="text-xs font-mono text-cas-blue font-bold mt-1">
                      GPS Coordinates: 6.595200 N, 3.342100 E
                    </div>
                    <span className="text-xs text-cas-amberDark font-bold block mt-1">
                      Gate Clearance: Standard 33,000L trailer. Camlock 3-inch connection.
                    </span>
                  </div>
                </div>

                {/* One-Tap Navigation Button & Gate Call */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <a
                    href="https://maps.google.com/?q=6.5952,3.3421"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-cas-blue hover:bg-sky-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" />
                    <span>Open GPS Turn-by-Turn Route</span>
                  </a>

                  <a
                    href="tel:+2348034912289"
                    className="py-3 px-4 bg-white border-2 border-slate-300 hover:bg-slate-100 text-cas-slate font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-cas-green" aria-hidden="true" />
                    <span>Call Gate Officer</span>
                  </a>
                </div>
              </div>

              {/* Loading Depot Verification */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <span className="text-cas-muted block">Depot of Origin</span>
                  <strong className="text-cas-slate">Ijegun Egba Cluster (Gantry 14)</strong>
                </div>
                <div className="text-right">
                  <span className="text-cas-muted block">Security Seals</span>
                  <span className="font-mono font-bold text-cas-slate">SEAL-8821 / 8822</span>
                </div>
              </div>
            </div>

            {/* Trip Milestone Progress Buttons */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cas-slate mb-3">
                Update Trip Milestone
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setTripStep(1)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tripStep === 1
                      ? 'bg-cas-slate text-white border-cas-slate'
                      : 'bg-white text-cas-slate border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>1. Loaded at Depot</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTripStep(2)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tripStep === 2
                      ? 'bg-cas-amberDark text-white border-cas-amberDark'
                      : 'bg-white text-cas-slate border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>2. In Transit (Route Locked)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTripStep(3)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tripStep === 3
                      ? 'bg-cas-blue text-white border-cas-blue'
                      : 'bg-white text-cas-slate border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>3. Arrived at Buyer Gate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTripStep(4)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tripStep === 4
                      ? 'bg-cas-green text-white border-cas-green'
                      : 'bg-white text-cas-slate border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>4. Discharge Completed</span>
                </button>
              </div>

              <p className="text-[11px] text-cas-muted mt-2">
                Tapping milestones automatically updates the buyer and releases the geofence perimeter lock when you cross into the registered facility coordinates.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
