import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Settings, ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// One workspace link per role. Public visitors get anchors on the home page.
const ROLE_LINKS = {
  BUYER: [{ label: 'Marketers', hash: 'marketplace' }],
  SUPPLIER: [{ label: 'Supplier Desk', to: '/marketer' }],
  DRIVER: [{ label: 'Driver Cockpit', to: '/driver' }],
  ADMIN: [
    { label: 'Admin', to: '/admin' },
    { label: 'Marketers', hash: 'marketplace' },
    { label: 'Supplier Desk', to: '/marketer' },
    { label: 'Driver Cockpit', to: '/driver' },
  ],
};
const PUBLIC_LINKS = [
  { label: 'How it works', hash: 'how-it-works' },
  { label: 'Marketers', hash: 'marketplace' },
];

export default function Header({ user, onLogout, onOpenLegalModal }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role ? user.role.toUpperCase() : null;
  const onAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const links = user ? ROLE_LINKS[role] || [] : onAuthPage ? [] : PUBLIC_LINKS;
  const roleLabel = role ? role.charAt(0) + role.slice(1).toLowerCase() : '';

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const go = (link) => (e) => {
    setMobileOpen(false);
    if (!link.hash) return;
    e.preventDefault();
    if (location.pathname === '/') scrollTo(link.hash);
    else {
      navigate('/');
      setTimeout(() => scrollTo(link.hash), 350);
    }
  };

  const isActive = (link) => link.to && location.pathname === link.to;
  const linkCls = (link) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive(link) ? 'bg-slate-100 text-cas-slate' : 'text-slate-600 hover:text-black hover:bg-slate-50'
    }`;

  const NavLink = ({ link, className }) => (
    <Link to={link.to || '/'} onClick={go(link)} className={className}>
      {link.label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-9 h-9 bg-cas-slate rounded-lg flex items-center justify-center">
            <span className="font-extrabold text-sm tracking-wider text-cas-amber">CAS</span>
          </span>
          <span className="font-extrabold text-xl tracking-tight text-cas-slate group-hover:text-cas-amberDark transition-colors">
            CAS Energy
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.label} link={l} className={linkCls(l)} />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {!user && onAuthPage ? null : !user ? (
            <>
              <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-black hover:bg-slate-50">
                Sign in
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-bold bg-cas-slate hover:bg-black text-white transition-colors">
                Get started
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50"
              >
                <span className="w-7 h-7 rounded-full bg-cas-slate text-cas-amber text-xs font-extrabold flex items-center justify-center">
                  {roleLabel.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-cas-slate">{roleLabel}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 animate-fadeIn">
                  <Link to="/profile" role="menuitem" className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setMenuOpen(false); if (onLogout) onLogout(); }}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.label}
                link={l}
                className="flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              />
            ))}
            {!user && onAuthPage ? null : !user ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center p-3 rounded-xl text-sm font-semibold border border-slate-300 text-slate-800">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center p-3 rounded-xl text-sm font-bold bg-cas-slate text-white">
                  Get started
                </Link>
              </div>
            ) : (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <span>Profile ({roleLabel})</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); if (onLogout) onLogout(); }}
                  className="flex items-center justify-center gap-2 p-3 mt-2 rounded-xl text-sm font-bold bg-red-50 text-red-700"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign out
                </button>
              </>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {[['terms', 'Escrow Terms'], ['privacy', 'NDPR Privacy'], ['refund', 'Refunds & Demurrage'], ['cookies', 'Cookie Policy']].map(([k, t]) => (
              <button key={k} type="button" onClick={() => { setMobileOpen(false); onOpenLegalModal(k); }} className="underline underline-offset-2 hover:text-black">
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
