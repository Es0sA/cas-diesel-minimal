import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEPOTS } from '../data/depots';
import { api } from '../api';
import AgoPriceBlock from './AgoPriceBlock';

export default function FeaturedDepotsRow() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    api.depots.prices()
      .then((all) => {
        const map = {};
        all.forEach((p) => {
          if (p.product === 'AGO') map[p.depotId] = p;
        });
        setPrices(map);
      })
      .catch(() => setPrices({}));
  }, []);

  // Automatic slow horizontal rotation, paused on hover or touch
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Controls & Section Eyebrow */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cas-amberDark block">
            Featured Depots
          </span>
          <span className="text-xs text-cas-muted font-medium">
            Active loading terminals with accredited vendors
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DEPOTS.map((depot) => {
          const price = prices[depot.id];

          return (
            <Link
              key={depot.id}
              to={`/depots/${depot.id}`}
              className="min-w-[280px] max-w-[280px] sm:min-w-[300px] sm:max-w-[300px] shrink-0 snap-start bg-white rounded-2xl border-2 border-cas-border p-5 hover:border-cas-amber transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {depot.loadingAxis}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {depot.state} State
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-cas-slate group-hover:text-cas-amberDark transition-colors line-clamp-1">
                  {depot.name}
                </h3>

                <div className="space-y-1 text-xs text-cas-muted">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{depot.operator}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{depot.region}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <AgoPriceBlock
                  compact
                  price={price?.price}
                />
                <span className="text-xs font-bold text-cas-slate group-hover:text-cas-amberDark inline-flex items-center gap-1 transition-colors">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}

        {/* Trailing View All Depots Card */}
        <Link
          to="/depots"
          className="min-w-[240px] shrink-0 snap-start bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-cas-slate transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-cas-slate text-white flex items-center justify-center mb-3 group-hover:bg-black transition-colors shadow">
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="font-extrabold text-sm text-cas-slate">More / View All Depots</span>
          <span className="text-xs text-cas-muted mt-1">Browse all 14 loading terminals nationwide</span>
        </Link>
      </div>
    </div>
  );
}
