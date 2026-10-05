import React from 'react';
import { ShieldCheck, MapPin, CheckCircle2, Lock, ArrowRight, Truck } from 'lucide-react';

const STEPS = [
  { icon: Lock, title: 'Fund escrow', text: 'Pick a verified marketer and pay into escrow. The marketer sees the funds are secured before dispatching.' },
  { icon: Truck, title: 'Track the truck', text: 'A verified driver is dispatched. You follow the delivery and chat with the marketer on the order page.' },
  { icon: MapPin, title: 'Confirm at your gate', text: 'When the truck reaches your gate you confirm delivery, and payment is released to the marketer.' }
];

export default function Hero({ onExploreMarketplace, onOpenRegister }) {
  return (
    <section className="bg-white py-8 sm:py-14 md:py-16 border-b border-cas-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-cas-amberLight border border-cas-amber/40 text-cas-amberDark text-xs sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cas-amberDark shrink-0" aria-hidden="true" />
              <span>Wholesale diesel marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-cas-slate tracking-tight leading-[1.15] mb-4 sm:mb-6">
              Direct Depot Pricing. <br />
              <span className="text-cas-amberDark font-black">Escrow Protected.</span> <br />
              Delivered To Your Tanks.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-cas-muted leading-relaxed mb-6 sm:mb-8">
              Compare verified marketers, pay into escrow, and release payment only when your delivery is confirmed at your gate.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-cas-slate hover:bg-black text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 border-2 border-transparent hover:border-cas-amber"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 text-amber-400" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onExploreMarketplace}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-cas-slate font-bold text-sm sm:text-base rounded-lg border-2 border-cas-slate transition-all flex items-center justify-center gap-2"
              >
                <span>Compare Marketers</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              {['Escrow payment protection', '100-meter gate confirmation', 'Verified marketers and drivers'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-5 sm:p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">How it works</span>
              <ol className="mt-4 space-y-5">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-cas-blue flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-cas-slate text-base">{i + 1}. {step.title}</h2>
                      <p className="text-xs text-cas-muted leading-relaxed mt-0.5">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
