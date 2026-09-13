import React from 'react';
import { DEPOT_PRICES } from '../data/depots';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export default function DepotTicker() {
  return (
    <section aria-label="Live Nigerian Depot Spot Prices" className="bg-slate-900 text-white py-2.5 sm:py-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cas-amber opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-cas-amber"></span>
            </span>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 truncate">
              Certified AGO Spot Rates (Terminals)
            </h2>
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-2 sm:gap-3">
            <span>Session: 06:00 to 18:00 WAT</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Refreshed hourly against physical manifests</span>
          </div>
        </div>

        {/* Responsive Ticker: Horizontal Swipe on Mobile, Grid on Desktop */}
        <div className="flex overflow-x-auto gap-2.5 pb-1 sm:pb-0 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 sm:gap-3">
          {DEPOT_PRICES.map((depot) => (
            <div 
              key={depot.id}
              className="min-w-[155px] sm:min-w-0 shrink-0 snap-start bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 sm:p-3 hover:border-cas-amber transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-300 font-medium mb-1 truncate">
                <span className="truncate">{depot.name.replace(' Tank Farm Cluster', '').replace(' Marine Terminal', '')}</span>
                <span className="text-[9px] sm:text-[10px] px-1 py-0.5 rounded bg-slate-700 text-slate-300 font-mono shrink-0 ml-1">
                  {depot.state}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div className="text-base sm:text-xl font-extrabold font-mono text-white">
                  ₦{depot.spotPrice}
                  <span className="text-[10px] sm:text-[11px] font-normal text-slate-400">/L</span>
                </div>
                
                <div className="flex items-center text-[11px] sm:text-xs font-semibold">
                  {depot.dailyChange < 0 ? (
                    <span className="text-emerald-400 flex items-center">
                      <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                      ₦{Math.abs(depot.dailyChange)}
                    </span>
                  ) : depot.dailyChange > 0 ? (
                    <span className="text-rose-400 flex items-center">
                      <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
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

              <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span>Density: {depot.densitySpec}</span>
                <span className="text-cas-amber font-mono">{depot.flashPoint}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
