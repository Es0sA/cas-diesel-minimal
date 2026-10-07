import React from 'react';
import { X, ShieldCheck, Scale } from 'lucide-react';
import { CONTACT, LEGAL } from '../config';

const operator = [LEGAL.entityName, LEGAL.rcNumber && `RC ${LEGAL.rcNumber}`, LEGAL.registeredAddress].filter(Boolean).join(', ');
const contactLine = [CONTACT.email, CONTACT.phone].filter(Boolean).join(' or ');
const privacyContact = LEGAL.privacyEmail || CONTACT.email;

const SECTIONS = {
  terms: [
    ['1. What CAS Energy is', 'CAS Energy is an online marketplace that connects buyers of automotive gas oil (diesel) with licensed marketers and independent tanker drivers in Nigeria. We provide the platform. We are not the seller of the fuel, the owner of the product, or the carrier. The sale contract is between the buyer and the marketer. Delivery is carried out by the marketer or its driver.'],
    ['2. Who can use the platform', 'You must be at least 18 and act for a business that is registered with the Corporate Affairs Commission, or be an independent driver with a valid driving licence. Marketers must hold and keep valid NMDPRA licences for the products and depots they offer. You must give true and current information and upload genuine documents. We may verify your details and may refuse or remove any account that fails verification.'],
    ['3. Accounts', 'You are responsible for your password and for everything done through your account. Tell us at once if you think someone else has used it. One person or business may not hold several accounts to avoid a suspension or a review.'],
    ['4. Prices and orders', 'Marketers set their own prices and are responsible for the accuracy of their listings. A price is fixed for an order when the buyer places and funds it. Placing an order is an offer to buy at that price. The order is binding on the marketer once it is funded and accepted on the platform.'],
    ['5. Payment and release of funds', (LEGAL.paymentProvider ? 'Payments are processed by ' + LEGAL.paymentProvider + '. ' : 'Payments are processed by the third-party payment arrangement shown at checkout. ') + 'The platform records each order as funded, in transit, delivered, disputed or cancelled. Payment is released to the marketer when the buyer confirms delivery, or as decided in a dispute. Confirmation of delivery is final once given, so confirm only after you have checked the quantity and quality received. Fees, if any, are shown before you pay.'],
    ['6. Delivery and gate confirmation', 'The platform uses the delivery location the buyer registers and the driver\'s location updates to show when a tanker is close to the gate. This is a tracking aid only. Location data can be wrong or delayed, and it does not prove that fuel was delivered or that it was good. Estimated arrival times are estimates and are not guaranteed.'],
    ['7. Cancellation', 'An order can be cancelled before delivery only when both the buyer and the marketer agree on the platform. If both agree, the funds are returned to the buyer. If only one side asks to cancel, the order stays in place. A buyer who refuses delivery without a good reason may be held responsible for the marketer\'s reasonable costs.'],
    ['8. Product quality and disputes', 'Fuel must meet the NMDPRA standards that apply at the time of sale. A buyer who finds short delivery or off-specification fuel must open a dispute on the platform before discharge or within the period shown on the order, and should keep samples, test results, photos and the waybill. We review the evidence from both sides and decide how the funds are paid out. We may ask for independent test results. Our decision on how funds are paid out does not remove either party\'s right to take the matter to a court or to arbitration.'],
    ['9. Detention and other charges', 'CAS Energy does not set demurrage, detention or haulage rates. Any such charge must be agreed between the parties before dispatch.'],
    ['10. Prohibited use', 'You may not use the platform for fraud, to avoid the platform\'s fees by taking a listed deal off the platform, to upload false or stolen documents, to interfere with the service, or to break any law. We may suspend or close an account and hold disputed funds while we investigate.'],
    ['11. Our responsibility', 'We provide the platform as it is and work to keep it running, but we cannot promise it will always be available or free of errors. We are not responsible for the quality, quantity or delivery of fuel, for the acts of marketers or drivers, or for losses caused by events outside our control. To the extent the law allows, our total liability to you for any claim about the platform is limited to the fees you paid us for the order the claim relates to. Nothing in these terms limits liability that cannot lawfully be limited.'],
    ['12. Changes and ending', 'We may update these terms. When we make a material change we will tell users on the platform, and continued use after that means you accept the change. You may close your account at any time from your profile, after your open orders are settled.'],
    ['13. Governing law', 'These terms are governed by the laws of the Federal Republic of Nigeria. Nigerian courts have jurisdiction, unless the parties agree to arbitration.'],
    ['14. Contact', contactLine ? 'Questions about these terms: ' + contactLine + '.' : 'Questions about these terms can be sent through the support contact shown on this site.'],
  ],
  privacy: [
    ['1. Who we are', 'This policy explains how CAS Energy collects and uses personal data under the Nigeria Data Protection Act 2023 (NDPA). ' + (operator ? 'The data controller is ' + operator + '.' : 'CAS Energy is the data controller.')],
    ['2. Data we collect', 'Account data: name, email address, phone number and a hashed password. Business data: company name, CAC registration number, NMDPRA licence number, depot and product details. Driver data: driving licence details and truck plate number. Verification documents that you upload, such as your CAC certificate, NMDPRA licence and driving licence. Order data: quantities, prices, status history, waybills, messages between parties and reviews. Location data: the buyer\'s delivery gate coordinates and the driver\'s location while a delivery is in progress. Technical data: IP address and basic device and request logs used for security and rate limiting.'],
    ['3. Why we use it and our lawful basis', 'To create and run your account and fulfil orders (performance of a contract). To verify businesses and drivers, prevent fraud and meet legal duties such as tax and fuel-sector regulation (legal obligation and legitimate interests). To keep the service secure (legitimate interests). We do not use your data for advertising and we do not sell it.'],
    ['4. Who sees your data', 'The other party to an order sees the details needed to complete it. A buyer\'s exact gate coordinates and contact person are shared only with the marketer and driver on an active funded order. We do not publish them. Our admins see verification documents and order records to review accounts and settle disputes. We share data with regulators or courts when the law requires it.'],
    ['5. Service providers and transfers abroad', 'We use cloud providers to host the platform, store uploaded documents and deliver the website, including providers whose servers are outside Nigeria such as in the United States. Where data leaves Nigeria we rely on the safeguards the NDPA allows. These providers process data only to run our service.'],
    ['6. Keeping your data', 'Delivery gate coordinates are deleted when an order is delivered or cancelled. We keep order, payment and audit records for as long as needed for accounting, disputes and legal duties, and then delete or anonymise them. Verification documents are kept while your account is active and for as long as the law or a pending dispute requires afterwards. When you delete your account we anonymise your personal details, but we may keep order records in anonymised form.'],
    ['7. Your rights', 'You may ask to see your data, correct it, delete it, restrict or object to its use, receive a copy, or withdraw consent where we rely on it. You can delete your account from your profile. ' + (privacyContact ? 'For any request write to ' + privacyContact + '. ' : '') + 'You may also complain to the Nigeria Data Protection Commission.'],
    ['8. Security', 'We protect data with encrypted connections, hashed passwords, access controls and private storage for documents. No system is completely secure. If a breach puts your rights at risk we will notify you and the Commission as the law requires.'],
    ['9. Children', 'The platform is for businesses and adults. We do not knowingly collect data from anyone under 18.'],
    ['10. Changes', 'We will post changes to this policy here and show the new date at the top.'],
  ],
  refund: [
    ['1. When a refund applies', 'Funds for an order are returned to the buyer when the buyer and marketer both agree to cancel before delivery, or when a dispute is decided in the buyer\'s favour. Funds are not returned after the buyer has confirmed delivery.'],
    ['2. Opening a dispute', 'Only the buyer can open a dispute, from the order page, for short delivery, fuel that does not meet the applicable NMDPRA standard, or fuel that was not delivered. Open it before you discharge or within the period shown on the order. Explain the problem and keep samples, test results, photos and the waybill.'],
    ['3. How a dispute is decided', 'We review the evidence from the buyer, the marketer and the driver, and may ask for independent laboratory results. We then decide whether the funds go to the marketer, back to the buyer, or are split. We will tell both sides the outcome. This does not stop either side from going to court or arbitration.'],
    ['4. Timing', 'We aim to review disputes promptly but cannot promise a fixed time, because it depends on the evidence and on the payment provider. Refunds are returned to the original payment method.'],
    ['5. Detention and demurrage', 'CAS Energy does not set or collect demurrage. Any waiting-time charge must be agreed between the buyer and the marketer or driver before dispatch.'],
  ],
  cookies: [
    ['What we use', 'We use one essential cookie that keeps you signed in. It is marked HttpOnly and Secure, is tied to your login and expires after 24 hours or when you sign out. We also store your cookie notice choice in your browser. We do not use advertising or analytics cookies and we do not allow third-party trackers.'],
    ['Your choices', 'You can clear cookies in your browser at any time. If you block the sign-in cookie, you will not be able to log in.'],
  ],
};

const KEY = { terms: 'terms', privacy: 'privacy', refund: 'refund', refunds: 'refund', cookies: 'cookies' };

export default function LegalModals({ activeModal, onClose }) {
  if (!activeModal) return null;
  const key = KEY[activeModal];
  if (!key) return null;

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
              {activeModal === 'terms' && 'Terms of Service'}
              {activeModal === 'privacy' && 'Privacy Policy'}
              {(activeModal === 'refund' || activeModal === 'refunds') && 'Refunds and Disputes'}
              {activeModal === 'cookies' && 'Cookie Policy'}
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
          <p className="text-xs text-cas-muted">
            Last updated {LEGAL.lastUpdated}.
            {operator && <> Operated by {operator}.</>}
          </p>
          {SECTIONS[key].map(([title, text]) => (
            <div key={title}>
              <h4 className="font-bold text-base text-cas-slate mb-2">{title}</h4>
              <p className="text-cas-muted">{text}</p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-cas-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cas-green" aria-hidden="true" />
            <span>Please read these terms carefully</span>
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
