import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner({ onOpenPolicy }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cas_cookie_consent');
    if (!saved) {
      setDismissed(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cas_cookie_consent', 'accepted');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <aside 
      aria-label="Cookie consent banner"
      className="fixed bottom-14 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-30 bg-white border-2 border-cas-border rounded-xl shadow-2xl p-3 sm:p-5"
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-cas-amberLight text-cas-amberDark flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h4 className="font-extrabold text-xs sm:text-sm text-cas-slate">Essential Security Cookies</h4>
          <p className="text-[11px] sm:text-xs text-cas-muted mt-0.5 leading-relaxed">
            CAS Energy uses essential session cookies for escrow security and CSRF protection. No third-party ad trackers.
          </p>

          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
            <button
              type="button"
              onClick={handleAccept}
              className="px-3 py-1.5 bg-cas-slate hover:bg-black text-white text-[11px] sm:text-xs font-bold rounded-lg transition-colors"
            >
              Accept Cookies
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('cookies')}
              className="text-[11px] sm:text-xs font-semibold text-cas-muted hover:text-cas-slate underline underline-offset-2"
            >
              Policy
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAccept}
          className="text-slate-400 hover:text-cas-slate p-1 shrink-0"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
