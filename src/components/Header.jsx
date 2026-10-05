import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, UserPlus, Menu, X, ArrowRight, LogIn, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ user, onLogout, onOpenLegalModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleModalClick = (modal) => {
    onOpenLegalModal(modal);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Regulatory & Operations Bar in Calm Neutral Tone */}
      <div className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs sm:text-xs py-2 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-cas-green shrink-0" aria-hidden="true"></span>
            <span className="font-semibold text-slate-700 sm:hidden">NMDPRA Regulated</span>
            <span className="font-semibold text-slate-700 hidden sm:inline">NMDPRA Regulated Wholesale Hub</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
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
          <Link
            to="/"
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
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded border border-slate-300">
                  AGO Diesel
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Bulk Fuel Marketplace & Geofenced Escrow
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-3 lg:gap-4">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'bg-slate-100 text-cas-slate font-bold'
                  : 'text-slate-600 hover:text-black hover:bg-slate-50'
              }`}
            >
              What We Do
            </Link>

            <Link
              to="/marketer"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/marketer')
                  ? 'bg-slate-100 text-cas-slate font-bold'
                  : 'text-slate-600 hover:text-black hover:bg-slate-50'
              }`}
            >
              Supplier Desk
            </Link>

            <Link
              to="/driver"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/driver')
                  ? 'bg-slate-100 text-cas-slate font-bold'
                  : 'text-slate-600 hover:text-black hover:bg-slate-50'
              }`}
            >
              Driver Cockpit
            </Link>

            {/* Desktop User Controls */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/login')
                      ? 'bg-slate-100 text-cas-slate font-bold'
                      : 'text-slate-700 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="ml-1 px-5 py-2.5 rounded-xl text-sm font-bold bg-cas-slate hover:bg-black text-white transition-all shadow-sm flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                  <span>Create Account</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive('/profile')
                      ? 'bg-slate-100 text-cas-slate font-bold'
                      : 'text-slate-700 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  <span>Profile</span>
                </Link>
                <div className="px-3.5 py-2 rounded-lg text-sm font-bold bg-slate-100 text-cas-slate capitalize border border-slate-200">
                  {user.role}
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="ml-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 hover:bg-red-100 text-red-700 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                isActive('/') ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>What We Do & Marketplace</span>
              <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
            </Link>

            <Link
              to="/marketer"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                isActive('/marketer') ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Downstream Supplier Desk</span>
              <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
            </Link>

            <Link
              to="/driver"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                isActive('/driver') ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Driver Cockpit & Manifest</span>
              <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                    isActive('/login') ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
                    <span>Sign In to Terminal</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-3.5 mt-2 rounded-xl text-sm font-bold bg-cas-slate text-white shadow-sm"
                >
                  <UserPlus className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                  <span>Create Account</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-left ${
                    isActive('/profile') ? 'bg-slate-100 text-cas-slate font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <span>Profile Settings</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
                </Link>
                <div className="flex items-center justify-between p-3.5 rounded-xl text-sm font-bold bg-slate-100 text-cas-slate capitalize">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
                    <span>Role: {user.role}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="flex items-center justify-center gap-2 p-3.5 mt-2 rounded-xl text-sm font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
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
