import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, UserPlus, Menu, X, ArrowRight, ExternalLink } from 'lucide-react';

export default function Header({ 
  currentView, 
  onNavigate, 
  onOpenLegalModal 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleModalClick = (modal) => {
    onOpenLegalModal(modal);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-cas-border shadow-sm">
      {/* Top Regulatory & Operations Phone Bar */}
      <div className="bg-cas-slate text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-cas-green animate-pulse shrink-0" aria-hidden="true"></span>
            <span className="font-medium text-slate-300 truncate">NMDPRA Regulated Trading Hub</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">CAS Holdings Nigeria</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 shrink-0">
            <a 
              href="tel:+23418880227" 
              className="flex items-center gap-1 hover:text-white transition-colors"
              aria-label="Call CAS Energy Operations Desk"
            >
              <PhoneCall className="w-3 h-3 text-cas-amber" aria-hidden="true" />
              <span className="hidden xs:inline">Ops Desk:</span>
              <span className="font-mono text-white text-xs">+234 (01) 888-0227</span>
            </a>
            <button 
              type="button"
              onClick={() => handleModalClick('terms')} 
              className="hidden sm:inline hover:text-white underline underline-offset-2 text-slate-400"
            >
              Escrow Terms
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between">
          
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-cas-slate rounded-lg flex items-center justify-center border-2 border-cas-amber shadow-inner shrink-0">
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-cas-amber">CAS</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-cas-slate group-hover:text-cas-amberDark transition-colors">
                  CAS Energy
                </span>
                <span className="bg-cas-amberLight text-cas-amberDark text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded border border-cas-amber">
                  AGO Diesel
                </span>
              </div>
              <p className="text-[11px] text-cas-muted font-medium hidden sm:block">
                Bulk Fuel Marketplace & Geofenced Escrow Logistics
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links & Action Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentView === 'home'
                  ? 'bg-slate-100 text-cas-slate'
                  : 'text-cas-muted hover:text-cas-slate'
              }`}
            >
              What We Do
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('supplier-portal')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentView === 'supplier-portal'
                  ? 'bg-slate-100 text-cas-slate'
                  : 'text-cas-muted hover:text-cas-slate'
              }`}
            >
              Supplier Desk
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('driver-cockpit')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentView === 'driver-cockpit'
                  ? 'bg-slate-100 text-cas-slate'
                  : 'text-cas-muted hover:text-cas-slate'
              }`}
            >
              Driver Cockpit
            </button>

            {/* Primary Registration CTA Button */}
            <button
              type="button"
              onClick={() => handleNavClick('register')}
              className={`px-4 lg:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 shadow-sm ${
                currentView === 'register'
                  ? 'bg-cas-slate text-white'
                  : 'bg-cas-amber hover:bg-cas-amberDark text-slate-900 hover:text-white border-2 border-cas-amber'
              }`}
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span>Create Account / Register</span>
            </button>
          </div>

          {/* Mobile Right Controls: Quick Call & Hamburger Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="tel:+23418880227"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-cas-slate border border-slate-200"
              aria-label="Call Dispatch Operations Desk"
            >
              <PhoneCall className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-cas-slate border border-slate-200"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-cas-slate" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 text-cas-slate" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold text-left ${
                currentView === 'home' ? 'bg-slate-100 text-cas-slate' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>What We Do & Marketplace</span>
              <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('supplier-portal')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold text-left ${
                currentView === 'supplier-portal' ? 'bg-slate-100 text-cas-slate' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Downstream Supplier Desk</span>
              <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('driver-cockpit')}
              className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold text-left ${
                currentView === 'driver-cockpit' ? 'bg-slate-100 text-cas-slate' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Driver Cockpit & Manifest</span>
              <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('register')}
              className="flex items-center justify-center gap-2 p-3 mt-1 rounded-xl text-sm font-extrabold bg-cas-amber text-slate-900 shadow-sm border border-amber-500"
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span>Create Account / Register</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <button 
              type="button" 
              onClick={() => handleModalClick('terms')}
              className="underline underline-offset-2 hover:text-cas-slate"
            >
              Escrow Terms
            </button>
            <button 
              type="button" 
              onClick={() => handleModalClick('privacy')}
              className="underline underline-offset-2 hover:text-cas-slate"
            >
              NDPR Privacy Policy
            </button>
            <button 
              type="button" 
              onClick={() => handleModalClick('refund')}
              className="underline underline-offset-2 hover:text-cas-slate"
            >
              Demurrage & Refunds
            </button>
            <button 
              type="button" 
              onClick={() => handleModalClick('cookies')}
              className="underline underline-offset-2 hover:text-cas-slate"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
