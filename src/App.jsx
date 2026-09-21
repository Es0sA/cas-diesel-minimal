import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import DepotTicker from './components/DepotTicker';
import Hero from './components/Hero';
import EscrowTerminal from './components/EscrowTerminal';
import Marketplace from './components/Marketplace';
import RegisterPage from './components/RegisterPage';
import SupplierPortal from './components/SupplierPortal';
import DriverCockpit from './components/DriverCockpit';
import LegalModals from './components/LegalModals';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import { 
  Building2, 
  UserCheck, 
  Truck, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';

function HomePage({ handleOpenRegistration, handleSelectSupplierForEscrow }) {
  return (
    <>
      <Hero 
        onExploreMarketplace={() => {
          const rates = document.getElementById('depot-rates') || document.getElementById('marketplace');
          if (rates) rates.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreSimulator={() => {
          const sim = document.getElementById('escrow-simulator');
          if (sim) sim.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenRegister={() => handleOpenRegistration('buyer')}
      />

      <DepotTicker />

      <section className="bg-white py-14 sm:py-20 border-b border-cas-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-cas-slate text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
              <span>How CAS Energy Operates</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
              What We Do Across The Downstream Chain
            </h2>
            <p className="text-base sm:text-lg text-cas-muted mt-2">
              We eliminate middlemen markups and delivery uncertainty by connecting corporate facilities directly with loading terminals through an escrow-backed logistics network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col justify-between hover:border-cas-blue transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-cas-blue flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-cas-slate mb-2">For Corporate Buyers</h3>
                <p className="text-sm text-cas-muted leading-relaxed mb-6">
                  Procurement managers choose suppliers by price and depot location. Funds are held in escrow. During registration, you map your exact GPS discharge gate so trucks never get lost.
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-cas-slate space-y-2 mb-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green" aria-hidden="true" />
                    <span>Direct refinery & depot spot rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green" aria-hidden="true" />
                    <span>100% money-back quality guarantee</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenRegistration('buyer')}
                  className="w-full py-3 px-4 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Register As A Buyer</span>
                  <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col justify-between hover:border-cas-amber transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-cas-amberDark flex items-center justify-center mb-6">
                  <UserCheck className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-cas-slate mb-2">For Licensed Marketers</h3>
                <p className="text-sm text-cas-muted leading-relaxed mb-6">
                  Publish your own spot price per litre and available volumes. Once your truck departs the gantry, the order is non-cancellable, protecting your capital.
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-cas-slate space-y-2 mb-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green" aria-hidden="true" />
                    <span>Guaranteed escrow before truck departs</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenRegistration('supplier')}
                  className="w-full py-3 px-4 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Register As A Marketer</span>
                  <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col justify-between hover:border-cas-green transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-cas-green flex items-center justify-center mb-6">
                  <Truck className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-cas-slate mb-2">For Fleet Tanker Drivers</h3>
                <p className="text-sm text-cas-muted leading-relaxed mb-6">
                  Register under your marketer. Receive verified dispatch orders with exact gate coordinates and turn-by-turn route navigation.
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-cas-slate space-y-2 mb-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green" aria-hidden="true" />
                    <span>One-tap GPS navigation to discharge gate</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenRegistration('driver')}
                  className="w-full py-3 px-4 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Register As A Driver</span>
                  <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <EscrowTerminal />

      <Marketplace 
        onSelectSupplierForEscrow={handleSelectSupplierForEscrow}
      />

      <section className="bg-white py-14 sm:py-20 border-b border-cas-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-cas-slate text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-cas-green" aria-hidden="true" />
              <span>Trust & Security Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
              How CAS Escrow Protects Both Parties
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <h3 className="text-lg font-extrabold text-cas-slate mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cas-blue" aria-hidden="true" />
                <span>Buyer Protection</span>
              </h3>
              <ul className="space-y-3 text-sm text-cas-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Funds remain untouched until the tanker enters within 100 meters of your registered gate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Quality disputes before discharge trigger full 100% escrow refund within 24 banking hours.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <h3 className="text-lg font-extrabold text-cas-slate mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cas-amberDark" aria-hidden="true" />
                <span>Marketer Protection</span>
              </h3>
              <ul className="space-y-3 text-sm text-cas-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Escrow is verified and locked before your calibrated tanker leaves the loading terminal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Once the truck departs the gantry, cancellation is blocked to protect your fuel in transit.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [activeLegalModal, setActiveLegalModal] = useState(null);
  const [registerInitialRole, setRegisterInitialRole] = useState('buyer');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleOpenRegistration = (role = 'buyer') => {
    setRegisterInitialRole(role);
    navigate('/register');
  };

  const handleSelectSupplierForEscrow = (supplier) => {
    navigate('/');
    setTimeout(() => {
      const sim = document.getElementById('escrow-simulator');
      if (sim) {
        sim.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRegistrationSuccess = (role) => {
    if (role === 'supplier') {
      navigate('/marketer');
    } else if (role === 'driver') {
      navigate('/driver');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cas-canvas text-cas-slate">
      {/* Top Header */}
      <Header onOpenLegalModal={(modal) => setActiveLegalModal(modal)} />

      {/* Main Body */}
      <main className="flex-1 pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage handleOpenRegistration={handleOpenRegistration} handleSelectSupplierForEscrow={handleSelectSupplierForEscrow} />} />
          <Route path="/register" element={<RegisterPage initialRole={registerInitialRole} onBackToHome={() => navigate('/')} onRegistrationSuccess={handleRegistrationSuccess} />} />
          <Route path="/marketer" element={<SupplierPortal />} />
          <Route path="/driver" element={<DriverCockpit onNavigateToRegister={() => handleOpenRegistration('driver')} />} />
        </Routes>
      </main>

      {/* Compliance Modals */}
      <LegalModals 
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Cookie Banner */}
      <CookieBanner onOpenPolicy={(modal) => setActiveLegalModal(modal)} />

      {/* Footer */}
      <Footer onOpenLegalModal={(modal) => setActiveLegalModal(modal)} />
    </div>
  );
}
