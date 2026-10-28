import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, ChevronRight, Layers, Navigation } from 'lucide-react';
import { api } from '../api';
import { DEPOTS } from '../data/depots';
import { usePageTitle } from '../lib/usePageTitle';
import AgoPriceBlock from './AgoPriceBlock';

export default function Depots({ user }) {
  usePageTitle('Depot Directory', 'Accredited loading terminals, operating companies, and indicative AGO diesel prices across Nigeria.');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3-Level Sequential Filter State
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedAxis, setSelectedAxis] = useState('All');

  useEffect(() => {
    api.depots.prices()
      .then(setPrices)
      .catch(() => setError('Could not load current depot benchmark prices.'))
      .finally(() => setLoading(false));
  }, []);

  // Map prices by depotId
  const priceMap = useMemo(() => {
    const map = {};
    prices.forEach((p) => {
      if (p.product === 'AGO') map[p.depotId] = p;
    });
    return map;
  }, [prices]);

  // Derived filter options
  const regions = useMemo(() => ['All', ...Array.from(new Set(DEPOTS.map((d) => d.region)))], []);

  const axes = useMemo(() => {
    const filteredDepots = selectedRegion === 'All' ? DEPOTS : DEPOTS.filter((d) => d.region === selectedRegion);
    return ['All', ...Array.from(new Set(filteredDepots.map((d) => d.loadingAxis)))];
  }, [selectedRegion]);

  // Auto-reset dependent axis filter when region changes
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedAxis('All');
  };

  // Filtered rows
  const filteredDepots = useMemo(() => {
    return DEPOTS.filter((d) => {
      const matchRegion = selectedRegion === 'All' || d.region === selectedRegion;
      const matchAxis = selectedAxis === 'All' || d.loadingAxis === selectedAxis;
      return matchRegion && matchAxis;
    });
  }, [selectedRegion, selectedAxis]);

  return (
    <section className="bg-cas-canvas py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Header Block */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-cas-slate text-xs font-mono font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
            <span>Terminal Intelligence & Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
            Depot Directory & Loading Corridors
          </h1>
          <p className="text-sm sm:text-base text-cas-muted leading-relaxed">
            Select your corridor and loading terminal below to inspect official indicative AGO spot prices and browse accredited vendors currently allocated to each gantry.
          </p>
        </div>

        {/* 3-Level Filter Hierarchy Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-cas-border shadow-sm space-y-5">
          
          {/* Step 1: Region */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cas-slate text-white text-[11px] flex items-center justify-center font-bold">1</span>
                <span>Select Region</span>
              </span>
              <span className="text-[11px] text-cas-muted">
                {selectedRegion === 'All' ? 'All Nigerian Corridors' : selectedRegion}
              </span>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Region filter">
              {regions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => handleRegionChange(region)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedRegion === region
                      ? 'bg-cas-slate text-white border-cas-slate shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  aria-pressed={selectedRegion === region}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Step 2: Loading Axis */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cas-slate text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Select Loading Axis</span>
              </span>
              <span className="text-[11px] text-cas-muted">
                {selectedAxis === 'All' ? 'All Loading Axes' : selectedAxis}
              </span>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Loading axis filter">
              {axes.map((axis) => (
                <button
                  key={axis}
                  type="button"
                  onClick={() => setSelectedAxis(axis)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedAxis === axis
                      ? 'bg-cas-amber text-cas-slate border-cas-amber shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  aria-pressed={selectedAxis === axis}
                >
                  {axis}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Spec Banner */}
        <div className="flex items-center justify-between text-xs text-cas-muted px-1">
          <span className="inline-flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-cas-slate">
            <span className="w-2 h-2 rounded-full bg-cas-green" aria-hidden="true" />
            <span>Product: AGO (Diesel) | Unit: Per Liter</span>
          </span>
          <span className="font-bold">
            Showing {filteredDepots.length} loading {filteredDepots.length === 1 ? 'terminal' : 'terminals'}
          </span>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Step 3: Depot Cards Grid */}
        <div className="space-y-4">
          {filteredDepots.map((depot) => {
            const price = priceMap[depot.id];

            return (
              <div
                key={depot.id}
                className="bg-white rounded-2xl border-2 border-cas-border p-5 sm:p-6 hover:border-cas-amber transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                {/* Depot Info */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/depots/${depot.id}`}
                      className="text-lg sm:text-xl font-extrabold text-cas-slate group-hover:text-cas-amberDark transition-colors"
                    >
                      {depot.name}
                    </Link>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {depot.loadingAxis}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-cas-muted">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>Operator: <strong className="text-cas-slate">{depot.operator}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{depot.hub}, {depot.state}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Flank */}
                <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3 shrink-0">
                  <AgoPriceBlock
                    compact
                    price={price?.price}
                    className="md:text-right"
                  />

                  <Link
                    to={`/depots/${depot.id}`}
                    className="px-4 py-2.5 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow"
                  >
                    <span>View Terminal & Vendors</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cas-amber" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
