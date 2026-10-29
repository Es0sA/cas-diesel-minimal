import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Truck,
  FileText
} from 'lucide-react';
import { getDepotById } from '../data/depots';
import { api } from '../api';
import { normalizeSuppliers } from '../lib/suppliers';
import AgoPriceBlock from './AgoPriceBlock';
import { usePageTitle } from '../lib/usePageTitle';

export default function DepotDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const depot = getDepotById(id);

  usePageTitle(
    depot ? `${depot.name} | Depot Rates & Vendors` : 'Depot Details',
    depot ? `Official indicative AGO price and accredited vendors loading from ${depot.name}, ${depot.loadingAxis}.` : 'Depot details on CAS Diesel.'
  );

  const [priceData, setPriceData] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  useEffect(() => {
    if (!depot) return;

    // Fetch live terminal benchmark prices
    api.depots.prices()
      .then((prices) => {
        const match = prices.find((p) => p.depotId === depot.id && p.product === 'AGO');
        setPriceData(match || null);
      })
      .catch(() => setPriceData(null))
      .finally(() => setLoadingPrice(false));

    // Fetch accredited vendors loading at this depot
    api.companies.listSuppliers()
      .then((data) => {
        const all = normalizeSuppliers(data);
        const filtered = all.filter((s) => s.depotId === depot.id || s.primaryDepot === depot.name);
        setVendors(filtered);
      })
      .catch(() => setVendors([]))
      .finally(() => setLoadingVendors(false));
  }, [depot]);

  if (!depot) {
    return (
      <section className="bg-cas-canvas py-16 px-4">
        <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-2xl border-2 border-cas-border">
          <AlertTriangle className="w-10 h-10 text-cas-amber mx-auto mb-3" aria-hidden="true" />
          <h1 className="text-2xl font-extrabold text-cas-slate leading-tight">Terminal Not Found</h1>
          <p className="text-cas-muted text-sm mt-2 leading-relaxed">
            The loading depot requested does not exist or has not yet been confirmed in our network.
          </p>
          <div className="mt-6">
            <Link
              to="/depots"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cas-slate text-white text-sm font-bold hover:bg-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Return to Depot Directory</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cas-canvas py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/depots" className="hover:text-cas-slate inline-flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Depot Directory</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">{depot.region}</span>
          <span>/</span>
          <span className="text-slate-400">{depot.loadingAxis}</span>
          <span>/</span>
          <span className="text-cas-slate truncate">{depot.name}</span>
        </div>

        {/* 1. Official Depot Notice Board Header */}
        <div className="bg-cas-slate text-white rounded-3xl p-6 sm:p-10 border-2 border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                <span>Official Depot Notice Board</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {depot.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cas-amber shrink-0" aria-hidden="true" />
                  <span>
                    Operator: <strong className="text-white font-bold">{depot.operator || 'Terminal Operations'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cas-amber shrink-0" aria-hidden="true" />
                  <span>
                    Loading Axis: <strong className="text-white font-bold">{depot.loadingAxis}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-center font-mono font-bold text-cas-amber text-xs">REG</span>
                  <span>
                    Region: <strong className="text-white font-bold">{depot.region}</strong> ({depot.state} State)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-center font-mono font-bold text-cas-amber text-xs">HUB</span>
                  <span className="truncate">{depot.hub}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex md:flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-700">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Terminal ID
              </span>
              <span className="font-mono text-sm font-bold px-3 py-1 bg-black/40 border border-white/20 rounded-lg text-amber-300">
                DEPOT-{depot.id.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Official Indicative AGO Price Block */}
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 leading-tight">
            Terminal Benchmark Rate
          </h2>
          <AgoPriceBlock
            price={priceData?.price}
            updatedAt={priceData?.updatedAt}
          />
        </div>

        {/* 3. Mandatory Verification Advisory Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-extrabold uppercase tracking-wide block mb-0.5 text-amber-900">
              Depot Verification Notice
            </span>
            <span>
              Verification confirms depot-level authorization only. Always confirm transactions through official depot channels before paying.
            </span>
          </div>
        </div>

        {/* 4. Accredited Vendors Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cas-amberDark">
                Direct Terminal Allocation
              </div>
              <h2 className="text-2xl font-extrabold text-cas-slate tracking-tight leading-tight">
                Accredited Depot Vendors
              </h2>
            </div>
            <span className="text-xs font-bold text-cas-muted">
              {vendors.length} accredited {vendors.length === 1 ? 'vendor' : 'vendors'} ready to load
            </span>
          </div>

          {loadingVendors ? (
            <div className="py-12 bg-white rounded-2xl border-2 border-cas-border flex justify-center items-center">
              <div className="w-7 h-7 border-4 border-cas-slate border-t-transparent rounded-full animate-spin" />
            </div>
          ) : vendors.length === 0 ? (
            /* Honest, zero-fabrication empty state */
            <div className="bg-white rounded-2xl border-2 border-cas-border p-8 sm:p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-extrabold text-base sm:text-xl text-cas-slate leading-tight">
                No Accredited Vendors Currently Listed for this Terminal
              </h3>
              <p className="text-xs sm:text-sm text-cas-muted max-w-lg mx-auto leading-relaxed">
                Verified seller allocations appear here as soon as downstream vendors complete NMDPRA licensing and gantry clearance for {depot.name}.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cas-amberDark hover:underline"
                >
                  <span>Are you an accredited vendor operating from this depot? Register here</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            /* Authentic vendor cards */
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-2xl border-2 border-cas-border p-5 sm:p-6 hover:border-cas-amber transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-lg text-cas-slate">
                        {vendor.companyName}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-cas-green text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Depot Accredited</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cas-muted">
                      {vendor.nmdpraLicense && (
                        <span>NMDPRA Lic: <strong className="text-cas-slate font-mono">{vendor.nmdpraLicense}</strong></span>
                      )}
                      <span>Terminal: <strong className="text-cas-slate">{depot.name}</strong></span>
                      <span>Axis: <strong className="text-cas-slate">{depot.loadingAxis}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-2">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-cas-muted block md:text-right">
                        Spot Price
                      </span>
                      <div className="text-xl sm:text-2xl font-display tabular-nums font-bold tracking-tight text-cas-slate md:text-right">
                        ₦{Number(vendor.pricePerLitre).toLocaleString('en-NG')}
                        <span className="text-xs font-normal text-cas-muted ml-0.5">/L</span>
                      </div>
                      {vendor.minOrderVolume > 0 && (
                        <span className="text-xs text-cas-muted block md:text-right mt-0.5">
                          Min: {vendor.minOrderVolume.toLocaleString()} Liters
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      <Link
                        to={user ? `/rfqs?depotId=${depot.id}` : '/register'}
                        className="px-4 py-2 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Request Quote via Escrow</span>
                        <ChevronRight className="w-3.5 h-3.5 text-cas-amber" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
