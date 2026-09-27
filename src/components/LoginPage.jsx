import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Truck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  HelpCircle, 
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { api } from '../api';

const ROLE_CONFIGS = {
  buyer: {
    id: 'buyer',
    apiRole: 'BUYER',
    title: 'Corporate Buyer',
    shortLabel: 'Buyer',
    tagline: 'Procurement & Plant Facilities',
    badge: 'Stanbic Nominees Virtual Escrow',
    subtitle: 'Sign in to access bulk spot prices, manage locked escrow accounts, and monitor gate GPS discharge radar.',
    emailLabel: 'Corporate Procurement Email',
    emailPlaceholder: 'procurement@dan-industries.ng',
    accentColor: 'text-cas-blue',
    accentBg: 'bg-sky-50 text-cas-blue border-sky-200',
    activeTabClass: 'bg-cas-slate text-white shadow-md',
    destination: '/',
    destinationLabel: 'Marketplace & Discharge Gate Radar',
    featureTitle: '100% Escrow Custody Protection',
    features: [
      'Funds remain locked in virtual escrow until tanker enters 100-meter gate radius.',
      'Direct refinery spot rates across Apapa, Ijegun, Warri, and Port Harcourt.',
      'Instant 24-hour full refund guarantee on any verified quality discrepancy.'
    ],
    sampleEmail: 'buyer@corporate.com'
  },
  supplier: {
    id: 'supplier',
    apiRole: 'SUPPLIER',
    title: 'Licensed Marketer',
    shortLabel: 'Marketer',
    tagline: 'Depot Terminals & Marketer Pricing Desk',
    badge: 'NMDPRA Licensed Portal',
    subtitle: 'Sign in to broadcast daily spot prices, review verified buyer orders, and dispatch calibrated tanker fleets.',
    emailLabel: 'Marketer Terminal Email',
    emailPlaceholder: 'operations@sahara-energy.ng',
    accentColor: 'text-cas-amberDark',
    accentBg: 'bg-amber-50 text-cas-amberDark border-amber-200',
    activeTabClass: 'bg-cas-slate text-white shadow-md',
    destination: '/marketer',
    destinationLabel: 'Supplier Pricing Desk & Allocations',
    featureTitle: 'In-Transit Capital Guarantee',
    features: [
      'Buyer escrow verified and locked before your tanker departs the loading gantry.',
      'Non-cancellable once in transit, eliminating counterparty settlement default.',
      'Real-time automated funds disbursement upon verified gate arrival.'
    ],
    sampleEmail: 'marketer@depot.ng'
  },
  driver: {
    id: 'driver',
    apiRole: 'DRIVER',
    title: 'Fleet Tanker Driver',
    shortLabel: 'Fleet Driver',
    tagline: 'Calibrated Tanker Navigation & Seals',
    badge: 'Independent Logistics Network',
    subtitle: 'Sign in to view assigned tanker dispatches, digital waypoint seals, and one-tap discharge gate GPS routing.',
    emailLabel: 'Driver Email or Phone ID',
    emailPlaceholder: 'driver01@logistics.ng',
    accentColor: 'text-cas-green',
    accentBg: 'bg-emerald-50 text-cas-green border-emerald-200',
    activeTabClass: 'bg-cas-slate text-white shadow-md',
    destination: '/driver',
    destinationLabel: 'Driver Cockpit & Gate Navigation',
    featureTitle: 'One-Tap Turn-by-Turn Waypoints',
    features: [
      'Turn-by-turn navigation directly to the facility discharge coordinates.',
      'Digital waypoint seals for loading gantry, transit checkpoints, and discharge.',
      'Automatic arrival detection when calibrated tanker enters 100m gate perimeter.'
    ],
    sampleEmail: 'driver@fleet.ng'
  }
};

export default function LoginPage({ 
  onBackToHome, 
  onLoginSuccess, 
  onNavigateToRegister,
  initialRole = 'buyer' 
}) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [showAssistanceModal, setShowAssistanceModal] = useState(false);

  const activeConfig = ROLE_CONFIGS[selectedRole] || ROLE_CONFIGS.buyer;

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    setErrorMessage('');
    setSuccessNotice('');
  };

  const handleQuickDemoFill = () => {
    setEmail(activeConfig.sampleEmail);
    setPassword('securepassword123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email or terminal ID.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // Send login request to backend
      const response = await api.auth.login({
        email: email.trim(),
        password: password
      });

      // Role returned by server
      const serverRole = response.role ? response.role.toUpperCase() : activeConfig.apiRole;
      
      setSuccessNotice(`Authentication successful. Redirecting to ${serverRole.toLowerCase()} terminal...`);

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(serverRole);
        }
      }, 700);

    } catch (err) {
      // If server returned an error message or backend is not reachable
      const message = err.message || 'Authentication failed. Please verify credentials.';
      
      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        setErrorMessage('Cannot reach CAS Energy authentication servers. If testing offline, you can use quick demo access.');
      } else {
        setErrorMessage(message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Column: Form & Role Controls */}
        <div className="p-6 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Top Navigation & Brand Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Return to Portal</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-cas-green" aria-hidden="true" />
                <span>256-Bit SSL Escrow Gateway</span>
              </div>
            </div>

            {/* Brand Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cas-slate text-cas-amber font-extrabold flex items-center justify-center text-sm shadow-sm">
                  CAS
                </div>
                <span className="font-extrabold text-xl text-cas-slate tracking-tight">
                  CAS Energy Terminal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight">
                Sign In to Terminal
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                {activeConfig.subtitle}
              </p>
            </div>

            {/* 3-Role Segmented Selector Tabs */}
            <div className="mb-7">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                
                {/* 1. Buyer Role */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'buyer'
                      ? 'bg-cas-slate text-white shadow-sm'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'buyer'}
                >
                  <Building2 className={`w-4 h-4 ${selectedRole === 'buyer' ? 'text-sky-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span className="truncate">Buyer</span>
                </button>

                {/* 2. Marketer Role */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('supplier')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'supplier'
                      ? 'bg-cas-slate text-white shadow-sm'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'supplier'}
                >
                  <UserCheck className={`w-4 h-4 ${selectedRole === 'supplier' ? 'text-amber-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span className="truncate">Marketer</span>
                </button>

                {/* 3. Driver Role */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('driver')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'driver'
                      ? 'bg-cas-slate text-white shadow-sm'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'driver'}
                >
                  <Truck className={`w-4 h-4 ${selectedRole === 'driver' ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span className="truncate">Driver</span>
                </button>

              </div>
              
              {/* Dynamic Role Context Ribbon */}
              <div className="mt-2.5 flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700">
                  {activeConfig.title}
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-500">
                  {activeConfig.badge}
                </span>
              </div>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="mt-1 text-slate-600">
                    Need an account?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigateToRegister(selectedRole)}
                      className="text-cas-amberDark font-bold underline underline-offset-2 hover:text-black"
                    >
                      Register as {activeConfig.shortLabel} now
                    </button>
                  </p>
                </div>
              </div>
            )}

            {successNotice && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span className="font-semibold">{successNotice}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email / Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {activeConfig.emailLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeConfig.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAssistanceModal(true)}
                    className="text-xs text-slate-500 hover:text-cas-amberDark transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter terminal password"
                    className="w-full pl-10 pr-11 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Quick Fill */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-cas-amber rounded border-slate-300 focus:ring-cas-amber"
                  />
                  <span>Keep session active</span>
                </label>

                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cas-amberDark hover:text-black transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-cas-amber" aria-hidden="true" />
                  <span>Demo fill</span>
                </button>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cas-amber" aria-hidden="true" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {activeConfig.shortLabel} Desk</span>
                    <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Bottom Switcher: New to CAS Energy */}
          <div className="pt-8 mt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">
                New to the CAS Energy network?
              </span>
              <button
                type="button"
                onClick={() => onNavigateToRegister(selectedRole)}
                className="font-bold text-cas-amberDark hover:text-black transition-colors flex items-center gap-1.5 underline underline-offset-2"
              >
                <span>Register as {activeConfig.shortLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-4 text-center sm:text-left">
              Regulated by NMDPRA under the Petroleum Industry Act (PIA). All settlements secured via virtual escrow.
            </p>
          </div>

        </div>

        {/* Right Column: Visual Industrial Pane & Contextual Safeguards */}
        <div className="relative p-8 sm:p-10 lg:p-12 lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Decorative Geometry & Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-cas-amber/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

          {/* Top Industrial Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-slate-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Downstream Bulk Fuel Network</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2">
              Downstream Escrow Logistics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every litre of AGO is certified, tracked, and secured from depot gantry to discharge gate.
            </p>
          </div>

          {/* Center: Frosted Glass Dynamic Role Card */}
          <div className="relative z-10 my-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                {activeConfig.shortLabel} Safeguards
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-black/40 text-slate-200 border border-white/10">
                Live Terminal
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-3">
              {activeConfig.featureTitle}
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-200">
              {activeConfig.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-300">
              <span>Settlement Custody:</span>
              <span className="font-semibold text-white">Stanbic Virtual Escrow</span>
            </div>
          </div>

          {/* Bottom Desk Hotline */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Operations Desk:</span>
            </div>
            <a 
              href="tel:+23418880227" 
              className="font-mono font-bold text-white hover:text-amber-300 transition-colors"
            >
              +234 (01) 888-0227
            </a>
          </div>

        </div>

      </div>

      {/* Assistance Modal */}
      {showAssistanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cas-amberDark" aria-hidden="true" />
                <h3 className="font-bold text-base text-cas-slate">Terminal Access Assistance</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssistanceModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              For security reasons on downstream financial terminals, password resets and security token re-issuances require authorization via our 24/7 verification desk.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mb-5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Operations Desk:</span>
                <a href="tel:+23418880227" className="font-mono font-bold text-slate-800 hover:underline">
                  +234 (01) 888-0227
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compliance Email:</span>
                <span className="font-mono font-bold text-slate-800">support@cas-holdings.ng</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operating Hours:</span>
                <span className="font-bold text-slate-800">24/7 Wholesale Dispatch</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAssistanceModal(false)}
                className="w-full py-2.5 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
              >
                Got It, Return to Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
