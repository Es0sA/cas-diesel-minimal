import React from 'react';
import { DEPOT_PRICES } from '../data/depots';
import { ArrowDownRight, ArrowUpRight, Minus, Activity } from 'lucide-react';

export default function DepotTicker() {
  return (
    <section id="depot-rates" aria-label="Today's Certified Depot Spot Prices" className="bg-slate-50/70 py-12 sm:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-cas-amber"></span>
              <span>Physical Terminal Spot Prices</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight">
              Today's Certified Depot Rates
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Live wholesale spot pricing refreshed hourly against physical loading manifests. All rates exclude haulage and are verified ex-gantry.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shrink-0 shadow-xs">
            Market Hours: 06:00 to 18:00 WAT
          </div>
        </div>

        {/* Rates Grid: Horizontal Swipe on Mobile, 6-Column on Desktop */}
        <div className="flex overflow-x-auto gap-4 pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6">
          {DEPOT_PRICES.map((depot) => (
            <div 
              key={depot.id}
              className="min-w-[170px] sm:min-w-0 shrink-0 snap-start bg-white border border-slate-200 rounded-2xl p-4 hover:border-cas-amber hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                  <span className="truncate">{depot.name.replace(' Tank Farm Cluster', '').replace(' Marine Terminal', '')}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {depot.state}
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-extrabold font-mono text-cas-slate">
                  ₦{depot.spotPrice}
                  <span className="text-xs font-normal text-slate-500">/L</span>
                </div>

                <div className="flex items-center text-xs font-semibold mt-1">
                  {depot.dailyChange < 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                      ₦{Math.abs(depot.dailyChange)}
                    </span>
                  ) : depot.dailyChange > 0 ? (
                    <span className="text-rose-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      ₦{depot.dailyChange}
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center">
                      <Minus className="w-3 h-3" aria-hidden="true" />
                      Flat
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Density: {depot.densitySpec}</span>
                <span className="font-mono text-cas-amberDark font-bold">{depot.flashPoint}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
