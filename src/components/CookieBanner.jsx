import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner({ onOpenPolicy }) {
  const [dismissed, setDismissed] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cas_cookie_consent');
    if (!saved) {
      setDismissed(false);
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cas_cookie_consent', 'accepted');
    setDismissed(true);
  };

  const showing = !dismissed && visible;

  // Reserve space under the page while the banner is up so it never hides content or form actions.
  useEffect(() => {
    document.body.classList.toggle('cookie-banner-open', showing);
    return () => document.body.classList.remove('cookie-banner-open');
  }, [showing]);

  if (!showing) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cas-border rounded-t-2xl sm:rounded-none shadow-[0_-8px_30px_rgba(15,23,42,0.15)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4"
    >
      <div className="flex items-start gap-2.5 sm:gap-3 max-w-7xl mx-auto">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-cas-amberLight text-cas-amberDark flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h4 className="font-extrabold text-xs sm:text-sm text-cas-slate leading-tight">Essential Security Cookies</h4>
          <p className="text-xs sm:text-xs text-cas-muted mt-0.5 leading-relaxed">
            CAS Diesel uses one essential cookie to keep you signed in. No advertising or third-party trackers.
          </p>

          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
            <button
              type="button"
              onClick={handleAccept}
              className="px-3 py-1.5 bg-cas-slate hover:bg-black text-white text-xs sm:text-xs font-bold rounded-lg transition-colors"
            >
              Accept Cookies
            </button>
            <button
              type="button"
              onClick={() => onOpenPolicy('terms')}
              className="text-xs sm:text-xs font-semibold text-cas-muted hover:text-cas-slate underline underline-offset-2"
            >
              Terms & Conditions
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAccept}
          className="text-slate-500 hover:text-cas-slate p-1 shrink-0"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
