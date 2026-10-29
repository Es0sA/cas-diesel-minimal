import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, CheckCircle2, Lock, ArrowRight, Truck, UserCheck } from 'lucide-react';
import FeaturedDepotsRow from './FeaturedDepotsRow';

const STEPS = [
  {
    icon: Lock,
    title: 'Fund Escrow',
    text: 'Lock funds into regulated escrow once you pick an accredited vendor. The vendor verifies capital security before gantry loading.'
  },
  {
    icon: Truck,
    title: 'Track Calibrated Truck',
    text: 'A verified fleet driver is dispatched with intact terminal seals and certified waybills. Follow delivery via perimeter radar.'
  },
  {
    icon: MapPin,
    title: 'Confirm at Your Gate',
    text: 'When the tanker enters your 100-meter gate perimeter and offloading clears quality checks, payment releases to the vendor.'
  }
];

export default function Hero({ onOpenRegister }) {
  return (
    <>
      {/* 1. Primary Hero Section (Clean White Background) */}
      <section className="bg-white border-b border-cas-border py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-cas-slate text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
              <span>Institutional Downstream Sourcing & Escrow Settlement</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-cas-slate tracking-tight leading-[1.08]">
              Buy diesel from official depot prices.<br />
              <span className="text-slate-900">Pay only when confirmed at your gate.</span>
            </h1>

            <p className="text-base sm:text-lg text-cas-muted leading-relaxed max-w-2xl font-normal">
              Accredited downstream vendors and calibrated fleet drivers load directly from certified terminals across Nigeria. Pick your depot, review official benchmark prices, and fund escrow with zero cash transit risk.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/depots"
                className="px-8 py-4 bg-cas-amber hover:bg-amber-500 text-cas-slate font-extrabold text-sm sm:text-base rounded-xl shadow-sm transition-all flex items-center justify-center gap-2.5"
              >
                <span>Browse Depot Prices</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                to="/register?role=supplier"
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-cas-slate font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <span>Register as a Vendor</span>
              </Link>

              <button
                type="button"
                onClick={() => onOpenRegister ? onOpenRegister('buyer') : null}
                className="px-6 py-4 text-slate-600 hover:text-cas-slate font-bold text-sm sm:text-base rounded-xl transition-colors text-center underline underline-offset-4"
              >
                Register as Corporate Buyer
              </button>
            </div>

            {/* Trust Assurance Signals */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-600 pt-3">
              {[
                'Bank Escrow Payment Protection',
                '100-Meter Gate Perimeter Confirmation',
                'Accredited Terminal Marketers & Calibrated Fleet'
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 2. Featured Depots Carousel Row */}
          <div className="pt-6 border-t border-slate-100">
            <FeaturedDepotsRow />
          </div>

        </div>
      </section>

      {/* 3. Three-Step Settlement Protocol */}
      <section className="bg-slate-50/70 border-b border-cas-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Settlement Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight mt-1 leading-tight">
              Three steps between purchase and gate delivery
            </h2>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="bg-white rounded-2xl border-2 border-cas-border p-6 shadow-sm space-y-3">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-extrabold text-cas-slate text-base leading-tight">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-cas-muted leading-relaxed mt-1.5">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
