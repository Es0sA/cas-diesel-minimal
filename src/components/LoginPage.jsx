import React, { useState, useEffect, useRef } from 'react';
import { scrollBehavior } from '../lib/motion';
import { usePageTitle } from '../lib/usePageTitle';
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
} from 'lucide-react';
import { CONTACT } from '../config';
import { api } from '../api';

const ROLE_CONFIGS = {
  buyer: {
    id: 'buyer',
    apiRole: 'BUYER',
    title: 'Corporate Buyer',
    shortLabel: 'Buyer',
    tagline: 'Procurement & Plant Facilities',
    badge: 'Escrow Protected Payments',
    signinSubtitle: 'Sign in to access bulk spot prices, manage locked escrow accounts, and monitor gate GPS discharge radar.',
    registerSubtitle: 'Register your corporate facility, set up escrow-protected payments, and pin your facility discharge gate.',
    emailLabel: 'Corporate Procurement Email',
    emailPlaceholder: 'example@mail.com',
    accentColor: 'text-cas-blue',
    destination: '/',
    destinationLabel: 'Marketplace & Discharge Gate Radar',
    featureTitle: 'Escrow Custody Protection',
    signinFeatures: [
      'Funds remain locked in virtual escrow until tanker enters 100-meter gate radius.',
      'Compare verified vendor prices by depot and order in a few clicks.'
    ],
    registerFeatures: [
      'Escrow-protected payment for zero cash transit risk.',
      'Mandatory discharge gate GPS pin drop to eliminate lost tanker diversions.',
      'Compare prices from verified vendors.'
    ]
  },
  supplier: {
    id: 'supplier',
    apiRole: 'VENDOR',
    title: 'Vendor',
    shortLabel: 'Vendor',
    tagline: 'Depot Terminals & Vendor Pricing Desk',
    badge: 'Vendor Portal',
    signinSubtitle: 'Sign in to broadcast daily spot prices, review verified buyer orders, and dispatch tanker fleets.',
    registerSubtitle: 'Register your downstream marketing entity with NMDPRA credentials and start receiving verified escrow orders.',
    emailLabel: 'Vendor Terminal Email',
    emailPlaceholder: 'example@mail.com',
    accentColor: 'text-cas-amberDark',
    destination: '/vendor',
    destinationLabel: 'Supplier Pricing Desk & Allocations',
    featureTitle: 'In-Transit Capital Protection',
    signinFeatures: [
      'Buyer escrow verified and locked before your tanker departs the loading gantry.',
      'Non-cancellable once in transit, eliminating counterparty settlement default.',
      'Payment is released when the buyer confirms delivery at the gate.'
    ],
    registerFeatures: [
      'Publish your daily price directly to verified corporate buyers.',
      'Buyer payment is held in escrow before you dispatch.',
      'Assign verified drivers to each delivery.'
    ]
  },
  driver: {
    id: 'driver',
    apiRole: 'DRIVER',
    title: 'Fleet Tanker Driver',
    shortLabel: 'Fleet Driver',
    tagline: 'Tanker Navigation',
    badge: 'Independent Logistics Network',
    signinSubtitle: 'Sign in to view assigned tanker dispatches, digital waypoint seals, and one-tap discharge gate GPS routing.',
    registerSubtitle: 'Register as an independent tanker driver to receive verified dispatch manifests and turn-by-turn routing.',
    emailLabel: 'Driver Email or Phone ID',
    emailPlaceholder: 'example@mail.com',
    accentColor: 'text-cas-green',
    destination: '/driver',
    destinationLabel: 'Driver Cockpit & Gate Navigation',
    featureTitle: 'One-Tap Turn-by-Turn Waypoints',
    signinFeatures: [
      'Turn-by-turn navigation directly to the facility discharge coordinates.',
      'Digital waypoint seals for loading gantry, transit checkpoints, and discharge.',
      'Automatic arrival detection when the tanker enters 100m gate perimeter.'
    ],
    registerFeatures: [
      'Accept dispatch manifests from verified downstream vendors across Nigeria.',
      'Clear gate GPS coordinates with truck clearance verification prevent site rejection.',
      'Instant electronic proof-of-delivery sign-off upon completion.'
    ]
  }
};

export default function LoginPage({ 
  onBackToHome, 
  onLoginSuccess, 
  onRegistrationSuccess,
  initialRole = 'buyer',
  initialMode = 'signin' // 'signin' or 'register'
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'signin' or 'register'
  const [selectedRole, setSelectedRole] = useState(initialRole);
  usePageTitle(
    authMode === 'register' ? `Create ${ROLE_CONFIGS[selectedRole]?.title || 'Account'}` : `Sign In — ${ROLE_CONFIGS[selectedRole]?.title || ''}`,
    authMode === 'register'
      ? 'Register your corporate facility, vendor desk, or driver profile on CAS Energy, the escrow-protected wholesale diesel marketplace.'
      : 'Sign in to CAS Energy to manage escrow-protected orders, verified vendor pricing, and gate delivery tracking.'
  );

  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  // Common Credential States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Email verification step (shown after registering, or when signing in to an unverified account)
  const [verifyEmail, setVerifyEmail] = useState(null);
  const [code, setCode] = useState('');

  // Status & Modal States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const alertRef = useRef(null);

  // Bring the error into view and focus it so a failed submit is never silent
  useEffect(() => {
    if (errorMessage && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
      alertRef.current.focus({ preventScroll: true });
    }
  }, [errorMessage]);
  const [successNotice, setSuccessNotice] = useState('');
  const [showAssistanceModal, setShowAssistanceModal] = useState(false);

  const activeConfig = ROLE_CONFIGS[selectedRole] || ROLE_CONFIGS.buyer;

  const handleModeChange = (newMode) => {
    setAuthMode(newMode);
    setErrorMessage('');
    setSuccessNotice('');
  };

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    setErrorMessage('');
    setSuccessNotice('');
  };

  // Sign In Handler
  const handleSignIn = async (e) => {
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
      const response = await api.auth.login({
        email: email.trim(),
        password: password,
        expectedRole: activeConfig.apiRole
      });

      const serverRole = response.role ? response.role.toUpperCase() : activeConfig.apiRole;
      setSuccessNotice(`Authentication successful. Redirecting to ${serverRole.toLowerCase()} terminal...`);

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(serverRole);
        }
      }, 700);

    } catch (err) {
      if (err.data?.needsVerification) {
        setVerifyEmail(err.data.email || email.trim());
        setCode('');
        setLoading(false);
        return;
      }
      const message = err.message || 'Authentication failed. Please verify credentials.';
      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        setErrorMessage('Cannot reach CAS Energy authentication servers. If testing offline, you can use quick demo access.');
      } else {
        setErrorMessage(message);
      }
      setLoading(false);
    }
  };

  // Registration: credentials only. Role details and documents are collected after the email is verified.
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    if (!email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setErrorMessage('Password must be at least 6 characters with an uppercase letter and a number.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const result = await api.auth.register({
        email: email.trim(),
        password: password,
        role: activeConfig.apiRole
      });

      if (result.needsVerification) {
        setVerifyEmail(result.email || email.trim());
        setCode('');
        setLoading(false);
        return;
      }

      // No mail provider configured: the account is usable straight away
      await api.auth.login({ email: email.trim(), password: password });
      setSuccessNotice('Account created. Let us set up your profile...');
      setTimeout(() => {
        if (onRegistrationSuccess) onRegistrationSuccess(activeConfig.apiRole);
        else if (onLoginSuccess) onLoginSuccess(activeConfig.apiRole);
      }, 600);
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setErrorMessage(message);
      setLoading(false);
    }
  };

  // Email verification: confirm the 6-digit code, then sign in with the password just chosen
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!/^\d{6}$/.test(code.trim())) {
      setErrorMessage('Enter the 6-digit code from your email.');
      return;
    }
    setLoading(true);
    try {
      await api.auth.verifyEmail({ email: verifyEmail, code: code.trim() });
      if (!password) {
        // Verified from the sign-in screen: ask them to sign in
        setVerifyEmail(null);
        setAuthMode('signin');
        setSuccessNotice('Email verified. Sign in to continue.');
        setLoading(false);
        return;
      }
      await api.auth.login({ email: verifyEmail, password });
      setSuccessNotice('Email verified. Let us set up your profile...');
      setTimeout(() => {
        if (onRegistrationSuccess) onRegistrationSuccess(activeConfig.apiRole);
        else if (onLoginSuccess) onLoginSuccess(activeConfig.apiRole);
      }, 600);
    } catch (err) {
      setErrorMessage(err.message || 'Could not verify the code. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    try {
      await api.auth.resendCode({ email: verifyEmail });
      setSuccessNotice('A new code is on its way. You can request another in a minute.');
    } catch (err) {
      setErrorMessage(err.message || 'Could not send a new code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Column: Unified Auth Terminal (Sign In & Register) */}
        <div className="relative lg:col-span-7">
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-between lg:max-h-[92vh] lg:overflow-y-auto">
          <div>
            {/* Top Navigation & Status Bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to home</span>
              </button>
            </div>

            {/* Brand Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cas-slate text-cas-amber font-extrabold flex items-center justify-center text-sm shadow-sm">
                  CAS
                </div>
                <span className="font-extrabold text-xl text-cas-slate tracking-tight">
                  CAS Energy
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-cas-slate tracking-tight">
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                {authMode === 'signin' ? activeConfig.signinSubtitle : activeConfig.registerSubtitle}
              </p>
            </div>

            {/* Master Mode Switcher: Sign In vs Create Account */}
            <div className="mb-6 p-1 bg-slate-100 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => handleModeChange('signin')}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center ${
                  authMode === 'signin'
                    ? 'bg-cas-slate text-white shadow-sm'
                    : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/50'
                }`}
                aria-pressed={authMode === 'signin'}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center ${
                  authMode === 'register'
                    ? 'bg-cas-slate text-white shadow-sm'
                    : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/50'
                }`}
                aria-pressed={authMode === 'register'}
              >
                Create Account
              </button>
            </div>

            {/* 3-Role Segmented Selector Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Persona
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
                  <Building2 className={`hidden min-[360px]:block w-4 h-4 ${selectedRole === 'buyer' ? 'text-sky-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span className="truncate">Buyer</span>
                </button>

                {/* 2. Vendor Role */}
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
                  <UserCheck className={`hidden min-[360px]:block w-4 h-4 ${selectedRole === 'supplier' ? 'text-amber-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Vendor</span>
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
                  <Truck className={`hidden min-[360px]:block w-4 h-4 ${selectedRole === 'driver' ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Driver</span>
                </button>

              </div>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div ref={alertRef} role="alert" tabIndex={-1} className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn focus:outline-none">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                  {authMode === 'signin' && (
                    <p className="mt-1 text-slate-600">
                      Need an account?{' '}
                      <button
                        type="button"
                        onClick={() => handleModeChange('register')}
                        className="text-cas-amberDark font-bold underline underline-offset-2 hover:text-black"
                      >
                        Register as {activeConfig.shortLabel} now
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}

            {successNotice && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
                <span className="font-semibold">{successNotice}</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW A: SIGN IN FORM */}
            {/* ============================================================== */}
            {verifyEmail && (
              <form onSubmit={handleVerify} className="space-y-4 animate-fadeIn">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Verify your email</div>
                  <p className="text-sm text-slate-700">We sent a 6-digit code to <strong>{verifyEmail}</strong>. It expires in 15 minutes.</p>
                  <div>
                    <label htmlFor="fld-verify-code" className="block text-xs font-bold text-slate-700 mb-1">Verification code</label>
                    <input id="fld-verify-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full px-3 py-3 bg-white border border-slate-300 rounded-lg text-xl tracking-[0.4em] text-center font-mono text-slate-800 focus:outline-none focus:border-cas-amber"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-cas-amber" aria-hidden="true" /> : <span>Verify and continue</span>}
                </button>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={handleResend} className="font-bold text-cas-amberDark underline underline-offset-2 hover:text-black">Send a new code</button>
                  <button type="button" onClick={() => { setVerifyEmail(null); setCode(''); setErrorMessage(''); setSuccessNotice(''); }} className="text-slate-600 underline underline-offset-2 hover:text-black">Use a different email</button>
                </div>
              </form>
            )}

            {!verifyEmail && authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 animate-fadeIn">
                
                {/* Email / Identifier */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {activeConfig.emailLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder={activeConfig.emailPlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-500 focus:outline-none transition-all"
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
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-500 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 transition-colors"
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

                {/* Remember me */}
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
            )}

            {/* ============================================================== */}
            {/* VIEW B: INTEGRATED REGISTRATION FORM */}
            {/* ============================================================== */}
            {!verifyEmail && authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 animate-fadeIn">
                
                {/* 1. Account Credentials */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
                    <span>Account</span>
                  </div>

                  <div>
                    <label htmlFor="fld-official-account-email-1" className="block text-xs font-bold text-slate-700 mb-1">
                      Email
                    </label>
                    <input id="fld-official-account-email-1"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder={activeConfig.emailPlaceholder}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-cas-amber"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="fld-password-min-12-chars-2" className="block text-xs font-bold text-slate-700 mb-1">
                        Password (min 6 chars, 1 capital, 1 number)
                      </label>
                      <input id="fld-password-min-12-chars-2"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-cas-amber"
                      />
                    </div>
                    <div>
                      <label htmlFor="fld-confirm-password-3" className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <input id="fld-confirm-password-3"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:border-cas-amber"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 px-4 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cas-amber" aria-hidden="true" />
                      <span>Creating your account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Bottom In-Place Mode Switcher */}
          <div className="pt-6 mt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">
                {authMode === 'signin' 
                  ? 'Need a new account?' 
                  : 'Already hold a verified account?'}
              </span>
              <button
                type="button"
                onClick={() => handleModeChange(authMode === 'signin' ? 'register' : 'signin')}
                className="font-bold text-cas-amberDark hover:text-black transition-colors flex items-center gap-1.5 underline underline-offset-2"
              >
                <span>
                  {authMode === 'signin' 
                    ? `Create ${activeConfig.shortLabel} Account` 
                    : `Sign In to ${activeConfig.shortLabel} Desk`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>
        {/* Bottom fade: hints that the panel above scrolls internally on tall forms */}
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" aria-hidden="true"></div>
        </div>

        {/* Right Column: Dynamic Visual Industrial Showcase */}
        <div className="relative p-8 sm:p-10 lg:p-12 lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex flex-col justify-between overflow-hidden">
          
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-cas-amber/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

          {/* Top Industrial Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300 text-xs font-semibold mb-6">
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
          <div className="relative z-10 my-8 p-6 rounded-2xl bg-white/10 border border-white/20 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                {activeConfig.shortLabel} {authMode === 'signin' ? 'Safeguards' : 'Capabilities'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-3">
              {activeConfig.featureTitle}
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-200">
              {(authMode === 'signin' ? activeConfig.signinFeatures : activeConfig.registerFeatures).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {CONTACT.phone && (
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Operations Desk:</span>
            </div>
            <a 
              href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} 
              className="font-mono font-bold text-white hover:text-amber-300 transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
          )}

        </div>

      </div>

      {/* Terminal Assistance Modal */}
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
                className="p-1 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Password reset is not self-service yet. {CONTACT.email ? 'Email us from your registered address and we will help you regain access.' : 'Please contact the CAS Energy team to regain access.'}
            </p>
            {CONTACT.email && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-xs flex justify-between">
                <span className="text-slate-500">Email:</span>
                <a href={`mailto:${CONTACT.email}`} className="font-mono font-bold text-slate-800 hover:underline">{CONTACT.email}</a>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAssistanceModal(false)}
                className="w-full py-2.5 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
