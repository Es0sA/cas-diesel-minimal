import React, { useState } from 'react';
import { SUPPLIERS, DEPOT_PRICES } from '../data/depots';
import { Search, Filter, ShieldCheck, CheckCircle2, Truck, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function Marketplace({ onSelectSupplierForEscrow }) {
  const [selectedDepotFilter, setSelectedDepotFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuppliers = SUPPLIERS.filter((sup) => {
    const matchesDepot = selectedDepotFilter === 'all' || sup.depotId === selectedDepotFilter;
    const matchesSearch = sup.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sup.primaryDepot.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepot && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerLitre - b.pricePerLitre;
    if (sortBy === 'price-desc') return b.pricePerLitre - a.pricePerLitre;
    if (sortBy === 'volume-asc') return a.minOrderVolume - b.minOrderVolume;
    if (sortBy === 'trips-desc') return b.verifiedTrips - a.verifiedTrips;
    return 0;
  });

  return (
    <section id="marketplace" className="bg-white py-12 md:py-20 border-b border-cas-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cas-amberDark mb-2">
              Verified Wholesale Distribution
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
              Live Marketer Spot Directory
            </h2>
            <p className="text-base text-cas-muted mt-1 max-w-2xl">
              Compare licensed downstream marketers loading out of major Nigerian depot terminals.
              All marketers hold valid NMDPRA off-taking licenses and supply certified Class A AGO.
            </p>
          </div>

          <div className="text-xs font-semibold text-cas-slate bg-slate-50 px-4 py-3 rounded-lg border border-cas-border">
            <span>Showing {filteredSuppliers.length} Verified Marketers Available For Instant Escrow Loading</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 rounded-xl border border-cas-border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search marketer or terminal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber focus:ring-0"
              aria-label="Search suppliers by name or terminal"
            />
          </div>

          {/* Filter by Depot */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-cas-muted uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Depot:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedDepotFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedDepotFilter === 'all'
                  ? 'bg-cas-slate text-white'
                  : 'bg-white text-cas-slate border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Depots
            </button>
            <button
              type="button"
              onClick={() => setSelectedDepotFilter('ijegun')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedDepotFilter === 'ijegun'
                  ? 'bg-cas-slate text-white'
                  : 'bg-white text-cas-slate border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Ijegun Cluster
            </button>
            <button
              type="button"
              onClick={() => setSelectedDepotFilter('apapa')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedDepotFilter === 'apapa'
                  ? 'bg-cas-slate text-white'
                  : 'bg-white text-cas-slate border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Apapa
            </button>
            <button
              type="button"
              onClick={() => setSelectedDepotFilter('ph')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedDepotFilter === 'ph'
                  ? 'bg-cas-slate text-white'
                  : 'bg-white text-cas-slate border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Port Harcourt
            </button>
            <button
              type="button"
              onClick={() => setSelectedDepotFilter('warri')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                selectedDepotFilter === 'warri'
                  ? 'bg-cas-slate text-white'
                  : 'bg-white text-cas-slate border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Warri
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-cas-muted uppercase flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-xs font-bold text-cas-slate focus:border-cas-amber"
              aria-label="Sort supplier results"
            >
              <option value="price-asc">Price (Lowest first)</option>
              <option value="price-desc">Price (Highest first)</option>
              <option value="volume-asc">Minimum Volume (Lowest)</option>
              <option value="trips-desc">Verified Deliveries (Highest)</option>
            </select>
          </div>
        </div>

        {/* Supplier Cards List */}
        <div className="space-y-4">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="p-5 sm:p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-cas-amber transition-all shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              {/* Marketer Credentials */}
              <div className="max-w-xl">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-extrabold text-lg text-cas-slate">{supplier.companyName}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-cas-green text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>NMDPRA Verified</span>
                  </span>
                </div>

                <div className="text-xs text-cas-muted flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                  <span>Licence: {supplier.nmdpraLicense}</span>
                  <span>|</span>
                  <span>Depot: <strong className="text-cas-slate">{supplier.primaryDepot}</strong></span>
                  <span>|</span>
                  <span>Dedicated Fleet: {supplier.fleetSize} Calibrated Tankers</span>
                </div>

                {/* Laboratory Specifications Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-700">
                    Density: <strong className="font-mono">{supplier.densitySpec}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-700">
                    Flash Point: <strong className="font-mono">{supplier.flashPoint}</strong>
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 rounded border border-amber-200 text-cas-amberDark font-semibold">
                    Depot Turnaround: {supplier.leadTimeHours}
                  </span>
                </div>
              </div>

              {/* Price & Allocation Action Box */}
              <div className="flex flex-row lg:flex-col sm:items-end justify-between lg:justify-center border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="text-xs text-cas-muted font-bold uppercase tracking-wider">Spot Ex-Depot</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cas-slate">
                    ₦{supplier.pricePerLitre}
                    <span className="text-sm font-normal text-cas-muted">/L</span>
                  </div>
                  <div className="text-xs text-cas-muted mt-0.5">
                    MOQ: {supplier.minOrderVolume.toLocaleString()} Litres
                  </div>
                </div>

                <div className="mt-0 lg:mt-3">
                  <button
                    type="button"
                    onClick={() => onSelectSupplierForEscrow(supplier)}
                    className="px-5 py-3 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
                  >
                    <span>Order via Escrow</span>
                    <ChevronRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
