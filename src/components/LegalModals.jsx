import React from 'react';
import { X, ShieldCheck, Scale } from 'lucide-react';
import { CONTACT, LEGAL } from '../config';
import { PRIVACY_SECTIONS } from '../lib/legalText';

const operator = [LEGAL.entityName, LEGAL.rcNumber && `RC ${LEGAL.rcNumber}`, LEGAL.registeredAddress].filter(Boolean).join(', ');
const contactLine = [CONTACT.email, CONTACT.phone].filter(Boolean).join(' or ');

const UNIFIED_TERMS = [
  [
    '1. Platform Scope and Marketplace Operation',
    'CAS Diesel is an institutional marketplace platform connecting corporate buyers of Automotive Gas Oil (AGO, diesel) with accredited downstream vendors and calibrated fleet drivers across Nigerian loading terminals. We operate the technological and escrow coordination infrastructure. We are not the seller of the fuel, the physical owner of the cargo, or the carrier. The contract of sale is formed directly between the buyer and the accredited vendor, with dispatch carried out by the vendor or its assigned calibrated fleet driver.'
  ],
  [
    '2. Counterparty Requirements and NMDPRA Accreditation',
    'Platform participation is restricted to incorporated corporate buyers, licensed petroleum marketers and vendors holding valid NMDPRA (Nigerian Midstream and Downstream Petroleum Regulatory Authority) operating credentials, and fleet drivers possessing verified driver licences and calibrated tanker charts. All participants must provide genuine, verifiable documentation. CAS Diesel verifies credentials prior to depot accreditation and reserves the right to suspend or remove any entity that fails ongoing compliance checks.'
  ],
  [
    '3. Ex-Depot Pricing and Escrow Settlement Protocol',
    'Accredited vendors publish indicative ex-depot spot rates per liter. When a corporate buyer places an order, the agreed price is fixed upon escrow funding. Buyer funds are held securely in institutional escrow custody and are never disbursed prior to confirmed delivery. Payment is released to the vendor only when the buyer completes gate inspection and delivery sign-off, or pursuant to a formal dispute determination. Platform transaction fees, where applicable, are transparently itemized prior to payment.'
  ],
  [
    '4. Gantry Dispatch and Discharge Gate Delivery Verification',
    'Following loading and terminal seal application at the designated depot, the vendor dispatches a calibrated tanker. The platform provides waypoint tracking and arrival perimeter detection as an operational aid. The driver must arrive with intact depot seals and a certified waybill. Delivery is officially completed only when the buyer confirms physical receipt at the discharge gate.'
  ],
  [
    '5. Product Quality Standards, Inspection and Dispute Resolution',
    'All Automotive Gas Oil supplied through the platform must strictly conform to official NMDPRA product specifications. If a buyer identifies short delivery or off-spec product, a dispute must be formally opened through the order console prior to discharge. Parties must preserve official loading samples, retain lab analysis reports, and maintain waybill records. CAS Diesel coordinates evidence review, which may include joint independent re-testing, to direct the final release or refund of escrowed funds.'
  ],
  [
    '6. Cancellation and Refund Policy',
    'An order may be cancelled prior to gantry dispatch upon mutual agreement of both buyer and vendor through the platform, prompting an immediate full refund of escrow funds to the buyer. Once a tanker is loaded and sealed in transit, cancellation cannot be unilaterally executed. A buyer who unlawfully refuses an on-specification delivery remains liable for reasonable logistics and terminal handling expenses incurred by the vendor.'
  ],
  [
    '7. Demurrage and Detention Terms',
    'CAS Diesel does not assess, collect, or enforce haulage demurrage or site detention charges. Any allowable waiting-time provisions or detention thresholds must be agreed in writing between the buyer and the vendor before truck dispatch.'
  ],
  ...PRIVACY_SECTIONS.map(([title, text], i) => [`${8 + i}. ${title}`, text]),
  [
    '10. Limitation of Liability and Governing Law',
    'The platform is provided on an institutional as-available basis. To the maximum extent permitted under applicable law, CAS Diesel liability is limited strictly to transaction fees received for the specific transaction in question. These Terms and Conditions are governed exclusively by the laws of the Federal Republic of Nigeria, with jurisdiction vested in Nigerian courts of competent authority.'
  ],
  [
    '11. Official Contact',
    contactLine ? 'Official inquiries regarding these Terms and Conditions may be addressed to: ' + contactLine + '.' : 'Official inquiries may be directed to info@casdiesel.com.'
  ]
];

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
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-cas-slate leading-relaxed">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-cas-muted">
            <span className="font-bold text-cas-slate">Effective Date:</span> {LEGAL.lastUpdated}.
            {operator && <span> Operated by {operator}.</span>}
          </div>

          {UNIFIED_TERMS.map(([title, text]) => (
            <div key={title} className="space-y-1.5">
              <h4 className="font-bold text-sm sm:text-base text-cas-slate">{title}</h4>
              <p className="text-xs sm:text-sm text-cas-muted leading-relaxed">{text}</p>
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
