import React from 'react';
import { X, ShieldCheck, Scale, FileText, AlertTriangle } from 'lucide-react';

export default function LegalModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border-2 border-cas-border shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-cas-slate text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-cas-amber" aria-hidden="true" />
            <h3 id="modal-title" className="font-extrabold text-lg sm:text-xl text-white">
              {activeModal === 'terms' && 'Terms of Service & Escrow Rules'}
              {activeModal === 'privacy' && 'Privacy Policy & NDPR Compliance'}
              {(activeModal === 'refund' || activeModal === 'refunds') && 'Refund, Demurrage & Quality Disputes'}
              {activeModal === 'cookies' && 'Cookies & Security Policy'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close modal dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-cas-slate leading-relaxed">
          
          {/* Terms Content */}
          {activeModal === 'terms' && (
            <>
              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">1. The Two-Sided Escrow Model</h4>
                <p className="text-cas-muted">
                  CAS Energy operates a trustless settlement protocol under Nigerian commercial contract laws. When a buyer initiates an order, 100% of the landed fuel cost is deposited into an independent fiduciary escrow account. These funds are never released to the supplier until digital discharge sign-off is completed.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">2. Non-Cancellable Route Lock</h4>
                <p className="text-cas-muted">
                  To protect licensed marketers from malicious order withdrawals while hauling hazardous materials, orders become strictly non-cancellable once the loaded tanker departs the depot gantry. The buyer cannot reverse or recall escrow funds while product is on the road.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">3. The Geofenced Verification Requirement</h4>
                <p className="text-cas-muted">
                  The "Confirm Receipt & Release Escrow" control is physically disabled until the assigned tanker's GPS transponder enters within a 100-meter perimeter of the buyer's registered discharge gate. Neither the marketer nor the driver can demand or coerce fund release prior to arrival.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">4. Quality Standards (NMDPRA Compliance)</h4>
                <p className="text-cas-muted">
                  All Automotive Gas Oil (AGO) traded on CAS Energy must meet or exceed NMDPRA specification: Density between 0.820 and 0.860 kg/L at 15 degrees Celsius, Flash Point minimum 66 degrees Celsius, and Maximum Sulphur 50 ppm.
                </p>
              </div>
            </>
          )}

          {/* Privacy Content */}
          {activeModal === 'privacy' && (
            <>
              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">1. Nigeria Data Protection Regulation (NDPR) Compliance</h4>
                <p className="text-cas-muted">
                  CAS Energy complies with the Nigeria Data Protection Act 2023. We collect only data strictly necessary to execute physical fuel logistics: establishment name, facility GPS coordinates, truck clearance dimensions, and receiving officer contact numbers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">2. Geolocation Privacy & Access Rules</h4>
                <p className="text-cas-muted">
                  Your facility's exact discharge coordinates and security contact details are confidential. They are never published in public marketplace directories. They are decrypted and transmitted strictly to the designated marketer and driver upon active escrow lock.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">3. Data Retention & Auditing</h4>
                <p className="text-cas-muted">
                  Transaction logs, waybills, and GPS verification stamps are retained for seven years in compliance with Federal Inland Revenue Service (FIRS) and NMDPRA audit requirements.
                </p>
              </div>
            </>
          )}

          {/* Refund & Demurrage Content */}
          {(activeModal === 'refund' || activeModal === 'refunds') && (
            <>
              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">1. Fuel Rejection Protocol</h4>
                <p className="text-cas-muted">
                  If on-site hydrometer testing indicates density below 0.820 kg/L or above 0.860 kg/L, or if visual water contamination is detected in bottom samples, the receiving officer may initiate a Quality Dispute on the platform before discharging.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">2. Full Escrow Refund Conditions</h4>
                <p className="text-cas-muted">
                  Upon confirmation of failed product quality by a neutral laboratory inspector, 100% of product escrow is refunded to the buyer within twenty-four banking hours.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">3. Demurrage Standards</h4>
                <p className="text-cas-muted">
                  Tanker drivers allow up to four free hours for discharge upon gate arrival. Thereafter, demurrage is calculated at ₦15,000 per additional hour of detention caused by facility delays, payable to the driver's fleet.
                </p>
              </div>
            </>
          )}

          {/* Cookie Content */}
          {activeModal === 'cookies' && (
            <>
              <div>
                <h4 className="font-bold text-base text-cas-slate mb-2">Strictly Essential Session Cookies</h4>
                <p className="text-cas-muted">
                  CAS Energy utilizes only strictly necessary first-party cookies for authenticated session persistence, CSRF security tokens, and user preference storage. We do not use third-party advertising cookies or sell commercial tracking beacons.
                </p>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-cas-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cas-green" aria-hidden="true" />
            <span>CAS Holdings Legal & Corporate Compliance Unit</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-cas-slate hover:bg-black text-white font-bold text-xs rounded-lg transition-colors"
          >
            I Understand & Close
          </button>
        </div>

      </div>
    </div>
  );
}
