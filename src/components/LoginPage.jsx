import React, { useState, useEffect, useRef } from 'react';
import { scrollBehavior } from '../lib/motion';
import { usePageTitle } from '../lib/usePageTitle';
import { 
  Building2, 
  UserCheck, 
  Truck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  X,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { api } from '../api';

const ROLE_CONFIGS = {
  buyer: {
    id: 'buyer',
    apiRole: 'BUYER',
    title: 'Corporate Buyer',
    shortLabel: 'Buyer',
    emailLabel: 'Email',
    emailPlaceholder: 'you@company.com'
  },
  supplier: {
    id: 'supplier',
    apiRole: 'VENDOR',
    title: 'Vendor',
    shortLabel: 'Vendor',
    emailLabel: 'Email',
    emailPlaceholder: 'you@company.com'
  },
  driver: {
    id: 'driver',
    apiRole: 'DRIVER',
    title: 'Fleet Driver',
    shortLabel: 'Driver',
    emailLabel: 'Email or Phone ID',
    emailPlaceholder: 'you@company.com'
  }
};

export default function LoginPage({ 
  onBackToHome, 
  onLoginSuccess, 
  onRegistrationSuccess,
  initialRole = 'buyer',
  initialMode = 'signin' // 'signin' or 'register'
}) {
  const urlRole = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('role')
    : null;
  const initialRoleChoice = (urlRole && ROLE_CONFIGS[urlRole])
    ? urlRole
    : (ROLE_CONFIGS[initialRole] ? initialRole : 'buyer');

  const [authMode, setAuthMode] = useState(initialMode); // 'signin' or 'register'
  const [selectedRole, setSelectedRole] = useState(initialRoleChoice);

  usePageTitle(
    authMode === 'register' ? 'Create Account' : 'Sign In',
    authMode === 'register'
      ? 'Register your corporate facility, vendor desk, or driver profile on CAS Diesel, the escrow-protected wholesale diesel marketplace.'
      : 'Sign in to CAS Diesel to manage escrow-protected orders, verified vendor pricing, and gate delivery tracking.'
  );

  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialRole && ROLE_CONFIGS[initialRole]) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  // Common Credential States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email verification step (shown after registering, or when signing in to an unverified account)
  const [verifyEmail, setVerifyEmail] = useState(null);
  const [code, setCode] = useState('');

  // Status & Modal States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const alertRef = useRef(null);

  useEffect(() => {
    if (errorMessage && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
      alertRef.current.focus({ preventScroll: true });
    }
  }, [errorMessage]);

  const [successNotice, setSuccessNotice] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetBusy, setResetBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');

  const openResetModal = () => {
    setResetEmail(email);
    setResetSent(false);
    setResetError('');
    setShowResetModal(true);
  };
  const closeResetModal = () => setShowResetModal(false);
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetBusy(true);
    setResetError('');
    try {
      await api.auth.forgotPassword({ email: resetEmail.trim() });
      setResetSent(true);
    } catch (err) {
      setResetError(err.message || 'Could not send the reset link. Try again.');
    } finally {
      setResetBusy(false);
    }
  };

  const activeConfig = ROLE_CONFIGS[selectedRole] || ROLE_CONFIGS.buyer;

  const handleModeChange = (newMode) => {
    setAuthMode(newMode);
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
        setErrorMessage('Cannot reach CAS Diesel authentication servers. If testing offline, you can use quick demo access.');
      } else {
        setErrorMessage(message);
      }
      setLoading(false);
    }
  };

  // Registration Handler
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

  // Email verification handler
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
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image: Desaturated Coastal Terminal with Deep Slate Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale contrast-125 brightness-75 opacity-40 scale-105 pointer-events-none transition-all"
        style={{ backgroundImage: `url('/terminal-aerial.jpg')` }}
      />
      
      {/* Deep Vignette & Dark Tint Overlays */}
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)] pointer-events-none" />

      {/* Floating Center Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-cas-slate text-cas-amber font-extrabold flex items-center justify-center text-sm shadow-xs group-hover:bg-black transition-colors">
              CAS
            </div>
            <span className="font-extrabold text-2xl text-cas-slate tracking-tight">
              CAS <span className="text-cas-amberDark">Diesel</span>
            </span>
          </button>
          <h1 className="text-sm font-semibold text-slate-500 mt-2">
            {authMode === 'register' ? 'Create your account' : 'Sign in to your account'}
          </h1>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div ref={alertRef} role="alert" tabIndex={-1} className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn focus:outline-none">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
            <span className="font-semibold">{successNotice}</span>
          </div>
        )}

        {/* Verification View */}
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
              className="w-full py-3 px-4 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-cas-amber" aria-hidden="true" /> : <span>Verify and continue</span>}
            </button>
            <div className="flex items-center justify-between text-xs pt-1">
              <button type="button" onClick={handleResend} className="font-bold text-cas-amberDark underline underline-offset-2 hover:text-black">Send a new code</button>
              <button type="button" onClick={() => { setVerifyEmail(null); setCode(''); setErrorMessage(''); setSuccessNotice(''); }} className="text-slate-600 underline underline-offset-2 hover:text-black">Use a different email</button>
            </div>
          </form>
        )}

        {/* Sign In Form */}
        {!verifyEmail && authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 animate-fadeIn">
            
            {/* Select account type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select account type
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'buyer'
                      ? 'bg-cas-slate text-white shadow-xs'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'buyer'}
                >
                  <Building2 className={`w-3.5 h-3.5 ${selectedRole === 'buyer' ? 'text-sky-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('supplier')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'supplier'
                      ? 'bg-cas-slate text-white shadow-xs'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'supplier'}
                >
                  <UserCheck className={`w-3.5 h-3.5 ${selectedRole === 'supplier' ? 'text-amber-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Vendor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('driver')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'driver'
                      ? 'bg-cas-slate text-white shadow-xs'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'driver'}
                >
                  <Truck className={`w-3.5 h-3.5 ${selectedRole === 'driver' ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Driver</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signin-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cas-amber focus:ring-1 focus:ring-cas-amber transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="signin-password" className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={openResetModal}
                  className="text-xs text-slate-500 hover:text-cas-amberDark transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cas-amber focus:ring-1 focus:ring-cas-amber transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer pt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cas-amber" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Mode Switcher Footer */}
            <div className="text-center pt-2 text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className="font-bold text-cas-amberDark hover:text-black transition-colors underline underline-offset-2 cursor-pointer"
              >
                Sign up
              </button>
            </div>

          </form>
        )}

        {/* Registration Form (Single View) */}
        {!verifyEmail && authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 animate-fadeIn">
            
            {/* Select account type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select account type
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'buyer'
                      ? 'bg-cas-slate text-white shadow-xs'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'buyer'}
                >
                  <Building2 className={`w-3.5 h-3.5 ${selectedRole === 'buyer' ? 'text-sky-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('supplier')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'supplier'
                      ? 'bg-cas-slate text-white shadow-xs'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'supplier'}
                >
                  <UserCheck className={`w-3.5 h-3.5 ${selectedRole === 'supplier' ? 'text-amber-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Vendor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('driver')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === 'driver'
                      ? 'bg-cas-slate text-white shadow-xs'
                      : 'text-slate-600 hover:text-cas-slate hover:bg-slate-200/60'
                  }`}
                  aria-pressed={selectedRole === 'driver'}
                >
                  <Truck className={`w-3.5 h-3.5 ${selectedRole === 'driver' ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden="true" />
                  <span>Driver</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cas-amber focus:ring-1 focus:ring-cas-amber transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password (min 6 chars, 1 capital, 1 number)
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cas-amber focus:ring-1 focus:ring-cas-amber transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cas-amber focus:ring-1 focus:ring-cas-amber transition-all"
              />
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer pt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cas-amber" aria-hidden="true" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Mode Switcher Footer */}
            <div className="text-center pt-2 text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeChange('signin')}
                className="font-bold text-cas-amberDark hover:text-black transition-colors underline underline-offset-2 cursor-pointer"
              >
                Sign in
              </button>
            </div>

          </form>
        )}

        {/* Quiet Bottom Subtext */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-600 leading-normal">
            Secure escrow settlement and verified depot distribution.
          </p>
        </div>

      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cas-amberDark" aria-hidden="true" />
                <h3 id="reset-title" className="font-bold text-base text-cas-slate">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={closeResetModal}
                className="p-1 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {resetSent ? (
              <div>
                <p role="status" className="text-sm text-slate-700 leading-relaxed mb-5">
                  If an account exists, a reset link has been sent to your email.
                </p>
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="w-full py-2.5 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Enter the email you registered with and we will send you a link to choose a new password.
                </p>
                {resetError && <p role="alert" className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">{resetError}</p>}
                <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value.toLowerCase())}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2.5 mb-5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-cas-amber"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeResetModal}
                    className="w-1/3 py-2.5 bg-white hover:bg-slate-50 text-cas-slate border border-slate-300 text-xs font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetBusy}
                    className="flex-1 py-2.5 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-60"
                  >
                    {resetBusy ? 'Sending' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Peripheral Terminal Metadata */}
      <div className="absolute bottom-4 left-0 right-0 z-10 hidden sm:flex items-center justify-center gap-6 text-[10px] font-mono uppercase tracking-wider text-slate-400 pointer-events-none">
        <span>Lagos Corridor (Apapa / Ijegun)</span>
        <span>•</span>
        <span>Niger Delta Corridor (Warri / Port Harcourt)</span>
        <span>•</span>
        <span>Cross River Corridor (Calabar)</span>
      </div>

    </div>
  );
}
