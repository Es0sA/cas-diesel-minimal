import React, { useEffect, useRef, useState } from 'react';
import { Hourglass, AlertCircle } from 'lucide-react';
import { api } from '../api';

export const PENDING_VENDOR = 'PENDING_VENDOR_ACCEPTANCE';

// Shown while an awarded order waits for the winning vendor. The buyer sees the waiting state with a cancel option;
// the vendor sees the action required. Renders nothing for any other status or role.
export default function PendingAcceptance({ order, role, onChanged, compact = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!confirming) return undefined;
    cancelRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setConfirming(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirming]);

  if (!order || order.status !== PENDING_VENDOR) return null;
  if (role !== 'BUYER' && role !== 'VENDOR') return null;

  const run = async (action) => {
    setBusy(true);
    setError('');
    try {
      // Awards from a request for quotes revert the request; direct orders are cancelled on their own
      await action(order.rfqId || order.id, Boolean(order.rfqId));
      setConfirming(false);
      if (onChanged) await onChanged();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  const isBuyer = role === 'BUYER';
  return (
    <div className={`${compact ? 'p-3' : 'p-4 sm:p-5 mb-8'} bg-cas-amberLight border border-cas-amber rounded-xl`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Hourglass className="w-5 h-5 text-cas-amberDark shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-extrabold text-cas-slate leading-tight">{isBuyer ? 'Waiting for Vendor to confirm' : 'Action Required: Accept Order'}</p>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              {isBuyer
                ? 'The order can be funded once the vendor confirms it. If the vendor delays, you can cancel and award a different quote.'
                : 'The buyer has awarded this request to you. Accept the order so the buyer can fund the escrow.'}
            </p>
          </div>
        </div>
        {isBuyer ? (
          <button type="button" onClick={() => setConfirming(true)} disabled={busy} className="btn-secondary shrink-0">Cancel Order</button>
        ) : (
          <button type="button" onClick={() => run((id, fromRfq) => (fromRfq ? api.rfqs.vendorAccept(id) : api.orders.vendorAccept(id)))} disabled={busy} className="btn-primary shrink-0">{busy ? 'Accepting...' : 'Accept Order'}</button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm text-rose-700 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60" role="dialog" aria-modal="true" aria-labelledby="cancel-order-title">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 id="cancel-order-title" className="text-xl font-extrabold text-cas-slate leading-tight">Cancel this order?</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              The order is cancelled and no funds have been taken. If it came from a request for quotes, the request opens again so you can award another quote.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" ref={cancelRef} onClick={() => setConfirming(false)} className="btn-secondary">Keep Order</button>
              <button type="button" onClick={() => run((id, fromRfq) => (fromRfq ? api.rfqs.buyerCancel(id) : api.orders.buyerCancel(id)))} disabled={busy} className="btn-primary">{busy ? 'Cancelling...' : 'Cancel Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
