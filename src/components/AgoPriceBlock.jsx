import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

const formatNaira = (n) => `₦${Number(n).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
const formatDate = (iso) => {
  if (!iso) return 'Today, Official Trading Hours';
  try {
    return new Date(iso).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Recent';
  }
};

export default function AgoPriceBlock({ price, updatedAt, compact = false, className = '' }) {
  const hasPrice = price !== undefined && price !== null && Number(price) > 0;

  if (compact) {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
          AGO (Diesel)
        </span>
        {hasPrice ? (
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-display tabular-nums font-bold tracking-tight text-cas-slate">
              {formatNaira(price)}
            </span>
            <span className="text-xs text-cas-muted font-bold">per liter</span>
          </div>
        ) : (
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            Awaiting price
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-5 sm:p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Product
          </span>
          <span className="font-extrabold text-sm sm:text-base text-cas-slate mt-0.5 block">
            AGO (Diesel)
          </span>
        </div>

        <div>
          <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Unit
          </span>
          <span className="font-extrabold text-sm sm:text-base text-cas-slate mt-0.5 block">
            Per Liter
          </span>
        </div>

        <div>
          <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Official Indicative Price
          </span>
          {hasPrice ? (
            <span className="font-display tabular-nums font-bold tracking-tight text-xl sm:text-2xl text-cas-slate mt-0.5 block">
              {formatNaira(price)}
            </span>
          ) : (
            <span className="font-bold text-xs sm:text-sm font-mono text-slate-500 uppercase tracking-wider mt-1 block">
              Awaiting price
            </span>
          )}
        </div>

        <div>
          <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Last Confirmed
          </span>
          <span className="text-xs sm:text-sm text-cas-muted flex items-center gap-1 mt-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span>{hasPrice ? formatDate(updatedAt) : 'Terminal verification pending'}</span>
          </span>
        </div>
      </div>

      <div className="pt-3.5 flex items-start gap-2 text-xs text-cas-muted leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-cas-amber shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          <strong className="text-cas-slate font-bold">Indicative Benchmark Rate:</strong> Posted rates are benchmark figures confirmed through terminal sales desks and remain subject to official depot confirmation at loading.
        </span>
      </div>
    </div>
  );
}
