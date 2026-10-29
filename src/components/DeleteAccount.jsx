import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { api } from '../api';

const inputCls = 'w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-colors';

// Delete account: blockers first, then type DELETE, then an emailed 6-digit code.
export default function DeleteAccount({ onDeleted }) {
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(null);
  const [step, setStep] = useState('confirm'); // confirm, code
  const [typed, setTyped] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!open) return;
    setCheck(null);
    api.auth.deleteCheck().then(setCheck).catch((e) => setError(e.message));
  }, [open]);

  const days = check?.retentionDays || 30;
  const blocked = check && check.blockers.length > 0;

  const close = () => { setOpen(false); setStep('confirm'); setTyped(''); setCode(''); setError(null); setInfo(null); };

  const sendCode = async () => {
    setBusy(true); setError(null); setInfo(null);
    try {
      const r = await api.auth.sendDeleteCode();
      setInfo(r.message);
      setStep('code');
    } catch (e) {
      if (e.data?.blockers) setCheck((c) => ({ ...c, blockers: e.data.blockers }));
      setError(e.message);
    } finally { setBusy(false); }
  };

  const finish = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await api.auth.deleteAccount(code.trim());
      onDeleted();
    } catch (err) {
      if (err.data?.blockers) setCheck((c) => ({ ...c, blockers: err.data.blockers }));
      setError(err.message);
    } finally { setBusy(false); }
  };

  const needsCode = check?.codeRequired;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl border border-rose-200 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-extrabold text-rose-700 flex items-center gap-2 leading-tight"><Trash2 className="w-5 h-5" aria-hidden="true" />Delete account</h2>
      <p className="mt-2 text-sm text-cas-muted leading-relaxed">Uploaded files are erased {days} days after you delete your account. If you sign up again with the same email within {days} days, you get them back.</p>
      {!open ? (
        <button onClick={() => setOpen(true)} className="mt-4 px-5 py-2.5 rounded-xl border border-rose-300 text-rose-700 text-sm font-bold hover:bg-rose-50">Delete my account</button>
      ) : (
        <div className="mt-5 border-t border-rose-100 pt-5">
          {error && <p role="alert" className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm leading-relaxed">{error}</p>}
          {!check ? (
            <p className="text-sm text-cas-muted leading-relaxed">Checking your account...</p>
          ) : blocked ? (
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-cas-slate leading-relaxed"><AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />You cannot delete your account yet</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-cas-muted space-y-1">{check.blockers.map((b) => <li key={b}>{b}</li>)}</ul>
              <button onClick={close} className="mt-4 px-4 py-2 text-sm font-semibold text-cas-muted">Close</button>
            </div>
          ) : step === 'confirm' ? (
            <div>
              <p className="text-sm text-cas-slate leading-relaxed">This signs you out and anonymizes your profile. Past orders are kept for our records. This cannot be undone.</p>
              <label htmlFor="del-typed" className="block mt-4 text-sm font-bold text-slate-700 mb-1.5">Type DELETE to continue</label>
              <input id="del-typed" className={inputCls} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
              <div className="mt-4 flex gap-3">
                {needsCode ? (
                  <button onClick={sendCode} disabled={busy || typed !== 'DELETE'} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-40">{busy ? 'Sending' : 'Email me a code'}</button>
                ) : (
                  <button onClick={finish} disabled={busy || typed !== 'DELETE'} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-40">{busy ? 'Deleting' : 'Delete account'}</button>
                )}
                <button onClick={close} className="px-4 py-2.5 text-sm font-semibold text-cas-muted">Cancel</button>
              </div>
            </div>
          ) : (
            <form onSubmit={finish}>
              {info && <p role="status" className="mb-3 text-sm text-cas-muted leading-relaxed">{info} It expires in 15 minutes.</p>}
              <label htmlFor="del-code" className="block text-sm font-bold text-slate-700 mb-1.5">6-digit code</label>
              <input id="del-code" className={inputCls} inputMode="numeric" pattern="\d{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} autoComplete="one-time-code" />
              <div className="mt-4 flex flex-wrap gap-3">
                <button disabled={busy || code.length !== 6} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-40">{busy ? 'Deleting' : 'Delete account'}</button>
                <button type="button" onClick={sendCode} disabled={busy} className="px-4 py-2.5 text-sm font-semibold text-cas-muted">Send a new code</button>
                <button type="button" onClick={close} className="px-4 py-2.5 text-sm font-semibold text-cas-muted">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
