import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, Scale } from 'lucide-react';
import { LEGAL } from '../config';
import { TERMS_SECTIONS } from '../lib/legalText';

const operator = [LEGAL.entityName, LEGAL.rcNumber && `RC ${LEGAL.rcNumber}`, LEGAL.registeredAddress].filter(Boolean).join(', ');

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function LegalModals({ activeModal, onClose }) {
  const dialogRef = useRef(null);
  // The parent passes a new onClose every render; keep the latest one without re-running the focus effect
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!activeModal) return undefined;
    const opener = document.activeElement;
    const root = dialogRef.current;
    const focusables = () => (root ? [...root.querySelectorAll(FOCUSABLE)] : []);
    focusables()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = root.contains(document.activeElement);
      if (!inside || (e.shiftKey && document.activeElement === first)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [activeModal]);

  if (!activeModal) return null;

  return (
    <div 
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-cas-border shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-cas-slate text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-cas-amber" aria-hidden="true" />
            <h3 id="modal-title" className="font-extrabold text-xl sm:text-xl text-white leading-tight">
              Terms & Conditions
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close terms dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-6 sm:text-base sm:leading-7 text-cas-slate">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-cas-muted">
            <span className="font-bold text-cas-slate">Effective Date:</span> {LEGAL.lastUpdated}.
            {operator && <span> Operated by {operator}.</span>}
          </div>

          {TERMS_SECTIONS.map(([title, text]) => (
            <div key={title} className="space-y-1.5">
              <h4 className="font-semibold text-base sm:text-xl text-cas-slate leading-tight">{title}</h4>
              <p className="text-sm leading-6 sm:text-base sm:leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-cas-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cas-green" aria-hidden="true" />
            <span>Official CAS Diesel Institutional Terms</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-cas-slate hover:bg-black text-white font-bold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
