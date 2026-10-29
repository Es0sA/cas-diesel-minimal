import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { api } from '../api';
import { usePageTitle } from '../lib/usePageTitle';

const inputCls = 'input';

export default function ResetPassword() {
  usePageTitle('Reset password', 'Choose a new password for your CAS Diesel account.');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must be at least 6 characters with an uppercase letter and a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await api.auth.resetPassword({ token, newPassword });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Could not reset the password. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 min-h-[60vh]">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="w-10 h-10 text-cas-green mx-auto mb-3" aria-hidden="true" />
            <h1 className="text-xl font-extrabold text-cas-slate leading-tight">Password updated</h1>
            <p role="status" className="text-sm text-cas-muted mt-2 mb-6 leading-relaxed">Password reset successfully. You can now log in.</p>
            <Link to="/login" className="inline-block w-full py-2.5 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl transition-colors">Go to sign in</Link>
          </div>
        ) : !token ? (
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-cas-slate leading-tight">Reset link is missing</h1>
            <p className="text-sm text-cas-muted mt-2 mb-6 leading-relaxed">Open the link from your email, or ask for a new one from the sign-in page.</p>
            <Link to="/login" className="inline-block w-full py-2.5 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl transition-colors">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-5 h-5 text-cas-amberDark" aria-hidden="true" />
              <h1 className="text-xl font-extrabold text-cas-slate leading-tight">Choose a new password</h1>
            </div>
            <p className="text-sm text-cas-muted mb-5 leading-relaxed">At least 6 characters, with an uppercase letter and a number. Signing in on other devices will stop working.</p>
            {error && <p role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">{error}</p>}

            <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
            <div className="relative mb-4">
              <input id="new-password" type={showPassword ? 'text' : 'password'} required autoComplete="new-password" maxLength={128} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-800" aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>
                {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>

            <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
            <input id="confirm-password" type={showPassword ? 'text' : 'password'} required autoComplete="new-password" maxLength={128} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputCls} mb-6`} />

            <button type="submit" disabled={busy} className="w-full py-2.5 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
              {busy ? 'Saving' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
