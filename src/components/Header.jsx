import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, UserPlus, Menu, X, ArrowRight } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Regulatory & Operations Bar in Calm Neutral Tone */}
      <div className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] sm:text-xs py-2 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-cas-green shrink-0" aria-hidden="true"></span>
            <span className="font-semibold text-slate-700 truncate">NMDPRA Regulated Wholesale Hub</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline">CAS Holdings Nigeria</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 shrink-0">
            <a 
              href="tel:+23418880227" 
              className="flex items-center gap-1.5 hover:text-black transition-colors"
              aria-label="Call Operations Desk"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
              <span className="hidden xs:inline">Desk:</span>
              <span className="font-mono font-bold text-slate-800 text-xs">+234 (01) 888-0227</span>
            </a>
            <button 
              type="button"
              onClick={() => handleModalClick('terms')} 
              className="hidden sm:inline hover:text-black underline underline-offset-2 text-slate-500"
            >
              Escrow Terms
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Generous Spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between">
          
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 bg-cas-slate rounded-xl flex items-center justify-center border border-slate-700 shadow-sm shrink-0">
              <span className="font-extrabold text-lg tracking-wider text-cas-amber">CAS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-cas-slate group-hover:text-cas-amberDark transition-colors">
                  CAS Energy
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">
                  AGO Diesel
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Bulk Fuel Marketplace & Geofenced Escrow
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'home'
                  ? 'bg-slate-100 text-cas-slate font-bold'
                  : 'text-slate-600 hover:text-black hover:bg-slate-50'
              }`}
            >
              What We Do
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('supplier-portal')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'supplier-portal'
                  ? 'bg-slate-100 text-cas-slate font-bold'
                  : 'text-slate-600 hover:text-black hover:bg-slate-50'
              }`}
            >
              Supplier Desk
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('driver-cockpit')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'driver-cockpit'
                  ? 'bg-slate-100 text-cas-slate font-bold'
                  : 'text-slate-600 hover:text-black hover:bg-slate-50'
              }`}
            >
              Driver Cockpit
            </button>

            {/* Primary Registration CTA */}
            <button
              type="button"
              onClick={() => handleNavClick('register')}
              className="ml-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-cas-slate hover:bg-black text-white transition-all shadow-sm flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-cas-amber" aria-hidden="true" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="tel:+23418880227"
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
              aria-label="Call Dispatch Operations"
            >
              <PhoneCall className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                currentView === 'home' ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>What We Do & Marketplace</span>
              <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('supplier-portal')}
              className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                currentView === 'supplier-portal' ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Downstream Supplier Desk</span>
              <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('driver-cockpit')}
              className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                currentView === 'driver-cockpit' ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Driver Cockpit & Manifest</span>
              <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('register')}
              className="flex items-center justify-center gap-2 p-3.5 mt-2 rounded-xl text-sm font-bold bg-cas-slate text-white shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-cas-amber" aria-hidden="true" />
              <span>Create Account / Register</span>
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            <button 
              type="button" 
              onClick={() => handleModalClick('terms')}
              className="underline underline-offset-2 hover:text-black"
            >
              Escrow Terms
            </button>
            <button 
              type="button" 
              onClick={() => handleModalClick('privacy')}
              className="underline underline-offset-2 hover:text-black"
            >
              NDPR Privacy
            </button>
            <button 
              type="button" 
              onClick={() => handleModalClick('refund')}
              className="underline underline-offset-2 hover:text-black"
            >
              Refunds & Demurrage
            </button>
            <button 
              type="button" 
              onClick={() => handleModalClick('cookies')}
              className="underline underline-offset-2 hover:text-black"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
