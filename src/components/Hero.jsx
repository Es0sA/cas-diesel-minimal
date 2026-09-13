import React from 'react';
import { ShieldCheck, MapPin, CheckCircle2, Lock, ArrowRight, Truck, Activity, ExternalLink } from 'lucide-react';

export default function Hero({ onExploreMarketplace, onExploreSimulator }) {
  return (
    <section className="bg-white py-8 sm:py-14 md:py-16 border-b border-cas-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        
        {/* Main 2-Column Hero Section for Balanced Desktop & Mobile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs (7 cols) */}
          <div className="lg:col-span-7">
            {/* Regulatory Trust Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-cas-amberLight border border-cas-amber/40 text-cas-amberDark text-[11px] sm:text-xs font-bold mb-4 sm:mb-6">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cas-amberDark shrink-0" aria-hidden="true" />
              <span>Downstream Petroleum Trading Architecture | CAS Energy</span>
            </div>

            {/* Main Headline with clean typography and no detached underline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-cas-slate tracking-tight leading-[1.15] mb-4 sm:mb-6">
              Direct Depot Pricing. <br />
              <span className="text-cas-amberDark font-black">
                Escrow Protected.
              </span> <br />
              Delivered To Your Tanks.
            </h1>

            {/* Subtitle formatted for clarity */}
            <p className="text-base sm:text-lg lg:text-xl text-cas-muted leading-relaxed mb-6 sm:mb-8">
              CAS Energy connects corporate procurement officers with licensed Nigerian depot marketers.
              Your payment is held safely in escrow. Once delivery begins, dispatch is guaranteed, and funds can only be released after the truck arrives inside your registered facility perimeter.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
              <button
                type="button"
                onClick={onExploreSimulator}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-cas-slate hover:bg-black text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 border-2 border-transparent hover:border-cas-amber"
              >
                <span>Test the Escrow Simulator</span>
                <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreMarketplace}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-cas-slate font-bold text-sm sm:text-base rounded-lg border-2 border-cas-slate transition-all flex items-center justify-center gap-2"
              >
                <span>Compare Depot Suppliers</span>
              </button>
            </div>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                <span>Stanbic Nominees Escrow Custody</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                <span>100-Meter Geofence Release Lock</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                <span>NMDPRA Certified AGO Class A</span>
              </span>
            </div>
          </div>

          {/* Right Column: Live Escrow Pipeline Preview Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white rounded-2xl border-2 border-slate-700 shadow-xl overflow-hidden">
              
              {/* Card Header with Active Pulse */}
              <div className="p-4 sm:p-5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cas-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cas-green"></span>
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Live Escrow Security Monitor
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-cas-amber/20 text-cas-amber px-2 py-0.5 rounded border border-cas-amber/40">
                  REF: CAS-8812
                </span>
              </div>

              {/* Card Body with Petroleum Pipeline Specs */}
              <div className="p-5 sm:p-6 space-y-4 text-xs">
                
                {/* Active Order Summary */}
                <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Verified Loading Terminal:</span>
                    <span className="text-cas-amber font-mono font-bold">Ijegun Egba Cluster</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Product Grade:</span>
                    <span className="text-white font-bold">Automotive Gas Oil (AGO Class A)</span>
                  </div>
                </div>

                {/* Laboratory Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 font-mono">
                  <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px]">Certified Density:</span>
                    <span className="text-white font-bold text-sm">0.839 kg/L</span>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/80">
                    <span className="text-slate-400 block text-[11px]">Flash Point:</span>
                    <span className="text-cas-amber font-bold text-sm">67 °C (Pass)</span>
                  </div>
                </div>

                {/* Escrow Lock Status */}
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-600/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Fiduciary Escrow Locked</span>
                    </span>
                    <span className="font-mono text-white text-sm">₦40,425,000</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-snug">
                    Funds are secured by Stanbic Nominees. Payment release is physically impossible until the tanker enters your 100-meter gate geofence.
                  </p>
                </div>

                {/* Non-Cancellable Route Lock */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                    <div>
                      <div className="font-bold text-white text-[11px]">Tanker LSR-492-XA in Transit</div>
                      <div className="text-[10px] text-slate-400">Route Locked: Non-Cancellable by Buyer</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onExploreSimulator}
                    className="text-[11px] font-bold text-cas-amber hover:text-white underline underline-offset-2 shrink-0"
                  >
                    View Radar
                  </button>
                </div>

              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Discharge Radius: 100 Meters</span>
                <span className="text-cas-green font-bold">Zero Default Record</span>
              </div>

            </div>
          </div>

        </div>

        {/* The 3 Core Guarantees across full 1280px container width */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 mt-10 border-t border-cas-border">
          
          <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-start gap-4 hover:border-cas-blue transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-cas-blue flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-cas-slate text-base mb-1">Two-Sided Escrow Lock</h3>
              <p className="text-xs text-cas-muted leading-relaxed">
                Marketers are protected against payment defaults; corporate buyers are protected against failed or adulterated deliveries.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-start gap-4 hover:border-cas-blue transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-cas-blue flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-cas-slate text-base mb-1">Geofenced Sign-Off</h3>
              <p className="text-xs text-cas-muted leading-relaxed">
                Payment release is physically locked until the fuel tanker's verified GPS transponder crosses into your registered facility coordinates.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-start gap-4 hover:border-cas-amber transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-cas-amberDark flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-cas-slate text-base mb-1">Certified NMDPRA Quality</h3>
              <p className="text-xs text-cas-muted leading-relaxed">
                Every loading manifest includes certified hydrometer density readings and flash point laboratory certificates before gantry discharge.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
