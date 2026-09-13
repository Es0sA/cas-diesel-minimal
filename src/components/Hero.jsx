import React from 'react';
import { ShieldCheck, MapPin, CheckCircle2, Lock, ArrowRight, Truck } from 'lucide-react';

export default function Hero({ onExploreMarketplace, onExploreSimulator, onOpenRegister }) {
  return (
    <section className="bg-white py-14 sm:py-20 md:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* 2-Column Balanced Layout with Generous White Space */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Clear Thesis & Focused Actions */}
          <div className="lg:col-span-7">
            
            {/* Subtle Regulatory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-cas-green"></span>
              <span>Official NMDPRA Regulated Trading Hub</span>
            </div>

            {/* Main Headline: Confident, Legible, Zero Clutter */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-cas-slate tracking-tight leading-[1.15] mb-6">
              Bulk Diesel Procurement, <br />
              <span className="text-cas-amberDark font-black">
                Protected by Escrow.
              </span>
            </h1>

            {/* Clear, Calm Explanation */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl font-normal">
              CAS Energy connects corporate facilities and procurement officers directly with licensed Nigerian depot terminals. Your payment stays locked safely in escrow until the calibrated tanker enters within 100 meters of your registered discharge gate.
            </p>

            {/* Simplified Dual Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-8 py-4 bg-cas-slate hover:bg-black text-white font-bold text-base rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5"
              >
                <span>Create Account / Register</span>
                <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreMarketplace}
                className="px-8 py-4 bg-slate-50 hover:bg-slate-100 text-cas-slate font-bold text-base rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <span>View Today's Depot Rates</span>
              </button>
            </div>

            {/* Quiet Trust Points */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-medium text-slate-500 pt-6 border-t border-slate-100">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                <span>Stanbic Nominees Escrow Custody</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                <span>100-Meter Geofenced Release</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                <span>100% Quality Refund Protocol</span>
              </span>
            </div>

          </div>

          {/* Right Column: Clean, Light 3-Step Trust Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50/90 rounded-3xl border-2 border-slate-200 p-7 sm:p-9 shadow-sm">
              
              <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 mb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Security Architecture
                  </span>
                  <h3 className="font-extrabold text-lg text-cas-slate mt-0.5">
                    How CAS Escrow Protects You
                  </h3>
                </div>
                <span className="p-2 rounded-xl bg-white border border-slate-200 text-cas-amberDark shadow-xs">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </span>
              </div>

              {/* 3 Step Sequence with Lots of Breathing Room */}
              <div className="space-y-6">
                
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-300 text-cas-slate font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-cas-slate">Select Verified Depot & Rate</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Compare spot prices across Apapa, Ijegun, Warri, and Port Harcourt. Every batch is certified Class A AGO.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cas-amberLight border border-cas-amber text-cas-amberDark font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-cas-slate">Payment Locked in Custody</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Your purchase capital is locked with Stanbic Nominees. The marketer cannot access funds until product is verified on site.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-300 text-cas-green font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-cas-slate">Geofenced Discharge Release</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Payment release is unlocked only when the calibrated tanker transponder crosses within 100 meters of your facility gate.
                    </p>
                  </div>
                </div>

              </div>

              {/* Card Bottom Link */}
              <div className="mt-8 pt-5 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Zero default settlement record</span>
                <button
                  type="button"
                  onClick={onExploreSimulator}
                  className="text-xs font-bold text-cas-amberDark hover:text-black transition-colors flex items-center gap-1"
                >
                  <span>Test Interactive Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* 3 Core Guarantees: Full Container Width with Generous Breathing Room */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-slate-200">
          
          <div className="p-7 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-cas-slate flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-cas-blue" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-base text-cas-slate mb-2">Two-Sided Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Marketers are protected against payment defaults once the truck departs the gantry. Corporate buyers are protected against failed or adulterated deliveries.
            </p>
          </div>

          <div className="p-7 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-cas-slate flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-cas-amberDark" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-base text-cas-slate mb-2">Geofenced Sign-Off</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discharge sign-off is physically restricted until the tanker transponder crosses into your registered GPS coordinates. No premature payout is possible.
            </p>
          </div>

          <div className="p-7 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-cas-slate flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5 text-cas-green" aria-hidden="true" />
            </div>
            <h3 className="font-extrabold text-base text-cas-slate mb-2">Certified NMDPRA Quality</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every delivery includes certified hydrometer density readings and flash point laboratory certificates. Quality disputes trigger an immediate 100% refund.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
