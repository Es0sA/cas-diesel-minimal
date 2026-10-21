import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, CheckCircle2, Lock, ArrowRight, Truck, Clock } from 'lucide-react';
import { api } from '../api';
import { DEPOTS } from '../data/depots';

const STEPS = [
  { icon: Lock, title: 'Fund escrow', text: 'Pay into escrow once you pick a vendor. The vendor sees the money is secured before loading.' },
  { icon: Truck, title: 'Track the truck', text: 'A verified driver is dispatched. You follow the delivery and chat with the vendor on the order page.' },
  { icon: MapPin, title: 'Confirm at your gate', text: 'When the truck reaches your gate you confirm delivery, and payment is released to the vendor.' }
];

const naira = (n) => `₦${Number(n).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;

// Live AGO prices from the public depot board. Nothing is shown that CAS has not entered.
function PriceBoard() {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    api.depots.prices().then((all) => setRows(all.filter((p) => p.product === 'AGO').sort((a, b) => a.price - b.price).slice(0, 4))).catch(() => setRows([]));
  }, []);
  const name = (id) => DEPOTS.find((d) => d.id === id)?.name || id;
  return (
    <div className="rounded-3xl bg-white/[0.06] border border-white/15 backdrop-blur-sm p-5 sm:p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Depot prices, AGO per litre</span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />Live</span>
      </div>
      {rows === null ? (
        <p className="mt-6 text-sm text-slate-400">Loading prices...</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-slate-300 leading-relaxed">Depot prices are posted here as soon as they are confirmed with the depots. Check back shortly.</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10">
          {rows.map((r, i) => (
            <li key={r.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{name(r.depotId)}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400"><Clock className="w-3 h-3" aria-hidden="true" />{new Date(r.updatedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</div>
              </div>
              <div className={`text-xl font-extrabold tracking-tight ${i === 0 ? 'text-amber-400' : 'text-white'}`}>{naira(r.price)}</div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/depots" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300">See all depots <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
    </div>
  );
}

export default function Hero({ onOpenRegister }) {
  return (
    <>
      <section className="relative overflow-hidden bg-cas-slate text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} aria-hidden="true" />
        <div className="absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full bg-cas-amber/25 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Wholesale diesel marketplace</span>
              </div>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05]">
                Buy diesel from the depot price.<br />
                <span className="text-amber-400">Pay only when it arrives.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Compare depot prices, get quotes from verified vendors, and fund escrow. Your money is released only when the truck reaches your gate and you confirm delivery.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="button" onClick={onOpenRegister} className="px-8 py-4 bg-cas-amber hover:bg-amber-500 text-cas-slate font-extrabold text-base rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2.5">
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <Link to="/depots" className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/25 text-white font-bold text-base rounded-xl transition-colors flex items-center justify-center">See depot prices</Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-300">
                {['Escrow payment protection', '100-meter gate confirmation', 'Verified vendors and drivers'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5"><PriceBoard /></div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-cas-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <h2 className="sr-only">How it works</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cas-amberLight text-cas-amberDark flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-extrabold text-cas-slate text-lg">{i + 1}. {step.title}</h3>
                  <p className="text-sm text-cas-muted leading-relaxed mt-1">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
