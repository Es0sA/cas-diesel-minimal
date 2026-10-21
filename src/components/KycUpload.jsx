import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { FileCheck2, Upload } from 'lucide-react';

const LABELS = {
  CAC_CERT: 'CAC registration certificate',
  NMDPRA_LICENCE: 'NMDPRA licence',
  DRIVER_LICENCE: 'Driver licence',
  TRUCK_CALIBRATION: 'Truck calibration chart'
};
const NEEDS_EXPIRY = ['DRIVER_LICENCE', 'TRUCK_CALIBRATION'];
const HINTS = {
  DRIVER_LICENCE: 'Attached to every order you drive, so suppliers never upload it.',
  TRUCK_CALIBRATION: 'Attached to every order you drive. Upload the chart for your current truck.'
};

export default function KycUpload({ types }) {
  const [docs, setDocs] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [expiry, setExpiry] = useState({});
  const [tomorrow] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));

  const load = () => api.kyc.mine().then(setDocs).catch(() => {});
  useEffect(() => {
    load();
    api.kyc.status().then((r) => setVerified(r.verified)).catch(() => {});
  }, []);

  const driverDocs = types.some((t) => NEEDS_EXPIRY.includes(t));
  if (verified && !driverDocs) return null;

  const onPick = async (type, file) => {
    if (!file) return;
    setError('');
    setBusy(type);
    try {
      if (NEEDS_EXPIRY.includes(type) && !expiry[type]) throw new Error('Enter the expiry date first.');
      await api.kyc.upload(type, file, expiry[type]);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-4 mb-6 bg-white border-2 border-cas-border rounded-xl">
      <h2 className="font-extrabold text-base text-cas-slate mb-1">Verification documents</h2>
      <p className="text-xs text-cas-muted mb-4">PDF, JPG or PNG, up to 5 MB each. An admin will either approve or reject each document.</p>
      <div className="space-y-3">
        {types.map((type) => {
          const doc = docs.find((d) => d.documentType === type);
          return (
            <div key={type} className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <div className="font-bold text-slate-800">{LABELS[type]}</div>
                <div className={`text-xs truncate ${doc ? 'text-slate-600' : 'text-cas-muted'}`}>
                  {doc ? (<span className="inline-flex items-center gap-1"><FileCheck2 className="w-3 h-3" aria-hidden="true" />{doc.fileName}</span>) : 'Not uploaded'}
                </div>
                {HINTS[type] && <div className="text-xs text-cas-muted mt-0.5">{HINTS[type]}</div>}
                {doc?.expiresAt && <div className="text-xs text-cas-muted">Expires {new Date(doc.expiresAt).toLocaleDateString()}</div>}
                {doc && (
                  <div className={`text-xs font-bold ${doc.status === 'APPROVED' ? 'text-cas-green' : doc.status === 'REJECTED' ? 'text-rose-600' : 'text-amber-700'}`}>
                    {doc.status === 'APPROVED' ? 'Approved' : doc.status === 'REJECTED' ? `Rejected: ${doc.rejectReason}. Please upload a new one.` : 'Waiting for admin review'}
                  </div>
                )}
              </div>
              {NEEDS_EXPIRY.includes(type) && (
                <label className="shrink-0 text-xs font-bold text-cas-slate">
                  <span className="block mb-0.5">Expiry date</span>
                  <input type="date" min={tomorrow} value={expiry[type] || ''} onChange={(e) => setExpiry((x) => ({ ...x, [type]: e.target.value }))} className="border border-slate-300 rounded-lg px-2 py-1 text-xs font-normal" />
                </label>
              )}
              <label className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-300 text-cas-slate cursor-pointer hover:border-cas-amber">
                <Upload className="w-3 h-3" aria-hidden="true" />
                {busy === type ? 'Uploading...' : doc ? (doc.status === 'REJECTED' ? 'Re-upload' : 'Replace') : 'Upload'}
                <input type="file" accept="application/pdf,image/jpeg,image/png" className="sr-only" disabled={busy === type} onChange={(e) => { onPick(type, e.target.files[0]); e.target.value = ''; }} />
              </label>
            </div>
          );
        })}
      </div>
      {error && <p className="mt-3 text-xs font-bold text-rose-600">{error}</p>}
    </div>
  );
}
