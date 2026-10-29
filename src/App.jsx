import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { api } from './api';
import { WAITLIST } from './config';
import { scrollBehavior } from './lib/motion';
import { usePageTitle } from './lib/usePageTitle';
import Header from './components/Header';
import Hero from './components/Hero';
import Waitlist from './components/Waitlist';
import Marketplace from './components/Marketplace';
import LoginPage from './components/LoginPage';
import SupplierPortal from './components/SupplierPortal';
import Depots from './components/Depots';
import DepotDetail from './components/DepotDetail';
import DriverCockpit from './components/DriverCockpit';
import OrderDetail from './components/OrderDetail';
import ProfileSettings from './components/ProfileSettings';
import AccountDeleted from './components/AccountDeleted';
import AdminDashboard from './components/AdminDashboard';
import OrderCheckoutModal from './components/OrderCheckoutModal';
import LegalModals from './components/LegalModals';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Rfqs from './components/Rfqs';
import Onboarding from './components/Onboarding';
import BuyerDashboard from './components/BuyerDashboard';
import MyOrders from './components/MyOrders';
import AboutUs from './components/AboutUs';
import Privacy from './components/Privacy';
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFound';
import { 
  Building2, 
  UserCheck, 
  Truck, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2
} from 'lucide-react';

function HomePage({ user, handleOpenRegistration }) {
  usePageTitle(null, "Browse accredited diesel vendors by depot and price, and order with escrow-protected payment on CAS Diesel.");
  const [checkoutSupplier, setCheckoutSupplier] = useState(null);
  const navigate = useNavigate();

  const handleCheckoutSuccess = (orderId) => {
    setCheckoutSupplier(null);
    navigate(`/orders/${orderId}`);
  };
  return (
    <>
      {user && <h1 className="sr-only leading-tight">Fuel marketplace</h1>}
      {!user && (
        <>
          <Hero 
        onExploreMarketplace={() => {
          const rates = document.getElementById('depot-rates') || document.getElementById('marketplace');
          if (rates) rates.scrollIntoView({ behavior: scrollBehavior() });
        }}
        onOpenRegister={() => handleOpenRegistration('buyer')}
      />


      <section id="how-it-works" className="bg-white py-14 sm:py-20 border-b border-cas-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-cas-slate text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
              <span>How CAS Diesel Operates</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight leading-tight">
              Vendors Meet The Companies That Need Diesel
            </h2>
            <p className="text-base sm:text-lg text-cas-muted mt-2 leading-relaxed">
              Stop chasing quotes and phone calls. Browse verified vendors, compare prices by depot and order in minutes. Your payment stays in escrow until the diesel is delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col justify-between hover:border-cas-blue transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-cas-blue flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-cas-slate mb-2 leading-tight">For Corporate Buyers</h3>
                <p className="text-sm text-cas-muted leading-relaxed mb-6">
                  Procurement managers pick a depot by price, then vendors quote to supply it. Funds are held in escrow. During registration, you map your exact GPS discharge gate so trucks never get lost.
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-cas-slate space-y-2 mb-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green" aria-hidden="true" />
                    <span>Compare prices by depot</span>
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
                <h3 className="text-xl font-extrabold text-cas-slate mb-2 leading-tight">For Vendors</h3>
                <p className="text-sm text-cas-muted leading-relaxed mb-6">
                  Get buyer requests, quote one all-in price, and see the money secured in escrow before you load. You never chase payment after delivery.
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
                  <span>Register As A Vendor</span>
                  <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col justify-between hover:border-cas-green transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-cas-green flex items-center justify-center mb-6">
                  <Truck className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-cas-slate mb-2 leading-tight">For Fleet Tanker Drivers</h3>
                <p className="text-sm text-cas-muted leading-relaxed mb-6">
                  Register under your vendor. Receive verified dispatch orders with exact gate coordinates and turn-by-turn route navigation.
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

        </>
      )}

      <AboutUs />

      {/* Competitor isolation: Logged-in vendors are not permitted to browse competing vendor profiles */}
      {user?.role === 'VENDOR' ? (
        <section className="bg-white py-14 sm:py-20 border-b border-cas-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cas-greenLight text-cas-green text-xs font-bold uppercase tracking-wider mb-4">
              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Vendor Operations Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight mb-3 leading-tight">
              Your Vendor Workspace
            </h2>
            <p className="text-sm text-cas-muted max-w-xl mx-auto mb-8 leading-relaxed">
              Review open buyer requests to place private quotes, check official refinery depot prices, or manage your stock and spot pricing from your Vendor Desk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/rfqs')}
                className="w-full sm:w-auto px-6 py-3.5 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Open Requests</span>
                <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/vendor')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 text-cas-slate text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Go to Vendor Desk</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/depots')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 text-cas-slate text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Depot Prices</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <Marketplace 
          onSelectSupplierForEscrow={(supplier) => setCheckoutSupplier(supplier)}
        />
      )}

      {checkoutSupplier && (
        <OrderCheckoutModal
          supplier={checkoutSupplier}
          onClose={() => setCheckoutSupplier(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      
    </>
  );
}

// Admins have their own dashboard and never use the vendor or driver workspaces.
const NotForAdmin = ({ user, children }) =>
  (user?.role || '').toUpperCase() === 'ADMIN' ? <Navigate to="/admin" replace /> : children;

const SessionSpinner = () => (
  <div className="flex justify-center p-24" role="status" aria-label="Loading">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cas-blue" />
  </div>
);

// While the pre-launch waitlist is on, signed-out visitors only see the waitlist and the auth screens.
const GateWhileWaitlisted = ({ user, authLoading, children }) => {
  if (authLoading) return <SessionSpinner />;
  if (!user && WAITLIST.enabled) return <Navigate to="/" replace />;
  return children;
};

// Pages that always need a signed-in account (optionally limited to some roles).
const RequireAuth = ({ user, authLoading, roles, children }) => {
  if (authLoading) return <SessionSpinner />;
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes((user.role || '').toUpperCase())) return <Navigate to="/" replace />;
  return children;
};

function OrdersPage() {
  usePageTitle('My orders', 'Every order you have placed on CAS Diesel, with its escrow status.');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[60vh]">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight mb-6 leading-tight">My orders</h1>
      <MyOrders />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeLegalModal, setActiveLegalModal] = useState(null);
  const [registerInitialRole, setRegisterInitialRole] = useState('buyer');
  const loginInitialRole = 'buyer';
  const navigate = useNavigate();
  const location = useLocation();

  // Restore the logged-in state after a refresh (the session lives in an HttpOnly cookie)
  useEffect(() => {
    api.auth.me()
      .then((session) => { if (session.role) setUser({ role: session.role }); })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }, [location.pathname]);

  const handleOpenRegistration = (role = 'buyer') => {
    setRegisterInitialRole(role);
    navigate('/register');
  };


  // New accounts finish their profile (and documents) right after verifying their email
  const handleRegistrationSuccess = (role) => {
    setUser({ role });
    navigate('/onboarding');
  };

  // Accounts that signed up but never finished their profile are sent back to it
  const profileMissing = async (role) => {
    try {
      if (role === 'DRIVER') await api.drivers.getProfile();
      else await api.companies.getProfile();
      return false;
    } catch (e) {
      return /not found/i.test(e.message || '');
    }
  };

  const handleLoginSuccess = async (role) => {
    setUser({ role });
    const normalizedRole = (role || '').toUpperCase();
    if (normalizedRole === 'ADMIN') {
      navigate('/admin');
    } else if (await profileMissing(normalizedRole)) {
      navigate('/onboarding');
    } else if (normalizedRole === 'VENDOR') {
      navigate('/vendor');
    } else if (normalizedRole === 'DRIVER') {
      navigate('/driver');
    } else if (normalizedRole === 'BUYER') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.error('Logout failed:', e);
    }
    setUser(null);
    navigate('/');
  };


  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-cas-slate">
      {/* Top Header */}
      <Header user={user} onLogout={handleLogout} onOpenLegalModal={(modal) => setActiveLegalModal(modal)} />

      {/* Main Body */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={WAITLIST.enabled && !user ? <Waitlist onOpenLegalModal={(modal) => setActiveLegalModal(modal)} /> : <HomePage user={user} handleOpenRegistration={handleOpenRegistration} />} />
          <Route path="/waitlist" element={<Waitlist onOpenLegalModal={(modal) => setActiveLegalModal(modal)} />} />
          <Route path="/portal" element={<RequireAuth user={user} authLoading={authLoading}><HomePage user={user} handleOpenRegistration={handleOpenRegistration} /></RequireAuth>} />
          <Route path="/register" element={<LoginPage initialRole={registerInitialRole} initialMode="register" onBackToHome={() => navigate('/')} onLoginSuccess={handleLoginSuccess} onRegistrationSuccess={handleRegistrationSuccess} />} />
          <Route path="/login" element={<LoginPage initialRole={loginInitialRole} initialMode="signin" onBackToHome={() => navigate('/')} onLoginSuccess={handleLoginSuccess} onRegistrationSuccess={handleRegistrationSuccess} />} />
          <Route path="/depots" element={<Depots user={user} />} />
          <Route path="/depots/:id" element={<DepotDetail user={user} />} />
          <Route path="/vendor" element={<NotForAdmin user={user}><SupplierPortal /></NotForAdmin>} />
          <Route path="/driver" element={<NotForAdmin user={user}><DriverCockpit onNavigateToRegister={() => handleOpenRegistration('driver')} /></NotForAdmin>} />
          <Route path="/onboarding" element={<Onboarding user={user} />} />
          <Route path="/dashboard" element={<RequireAuth user={user} authLoading={authLoading} roles={['BUYER']}><BuyerDashboard /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth user={user} authLoading={authLoading} roles={['BUYER']}><OrdersPage /></RequireAuth>} />
          <Route path="/rfqs" element={<RequireAuth user={user} authLoading={authLoading}><Rfqs user={user} /></RequireAuth>} />
          <Route path="/rfqs/:id" element={<RequireAuth user={user} authLoading={authLoading}><Rfqs user={user} /></RequireAuth>} />
          <Route path="/orders/:id" element={<OrderDetail user={user} />} />
          <Route path="/profile" element={<ProfileSettings user={user} onDeleted={() => { setUser(null); navigate('/account-deleted'); }} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy onOpenTerms={(modal) => setActiveLegalModal(modal)} />} />
          <Route path="/account-deleted" element={<AccountDeleted />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="*" element={<NotFound />} />
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
