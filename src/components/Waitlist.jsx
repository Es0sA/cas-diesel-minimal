import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Fuel, 
  Lock, 
  Sparkles, 
  AlertCircle,
  FileCheck,
  Check
} from 'lucide-react';
import { WAITLIST } from '../config';

const VOLUME_TIERS = [
  'Under 10,000 Litres',
  '10,000 to 50,000 Litres',
  '50,000 to 200,000 Litres',
  '200,000 Litres or more'
];

const STATES = [
  'Lagos',
  'Abuja (FCT)',
  'Rivers (Port Harcourt)',
  'Ogun',
  'Kano',
  'Delta (Warri / Asaba)',
  'Oyo (Ibadan)',
  'Kaduna',
  'Edo (Benin)',
  'Anambra (Onitsha)',
  'Other State'
];

const DEPOTS = [
  'Apapa Depots (Lagos)',
  'Ibafon / Tin Can Depots (Lagos)',
  'Port Harcourt Depots (Rivers)',
  'Warri Depots (Delta)',
  'Calabar Depots (Cross River)',
  'Oghara Depots (Delta)',
  'Multiple Depots / Nationwide'
];

const REFERRAL_SOURCES = [
  'Industry Referral or Word of Mouth',
  'WhatsApp Group or Message',
  'LinkedIn',
  'Direct Contact with CAS Team',
  'Search Engine',
  'Other'
];

export default function Waitlist() {
  const [role, setRole] = useState('BUYER'); // BUYER or MARKETER
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [volume, setVolume] = useState('');
  const [referral, setReferral] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeyPot, setHoneyPot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refCode, setRefCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot trap check
    if (honeyPot.trim() !== '') {
      setSubmitted(true);
      return;
    }

    if (!fullName.trim() || !whatsapp.trim() || !email.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!consent) {
      setErrorMsg('Please check the consent box to receive access updates.');
      return;
    }

    setSubmitting(true);

    const generatedRef = `CAS-WL-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      refCode: generatedRef,
      timestamp: new Date().toISOString(),
      role: role === 'BUYER' ? 'Corporate Buyer' : 'Licensed Marketer',
      name: fullName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      company: company.trim(),
      location: location || (role === 'BUYER' ? 'Not specified' : 'All depots'),
      volume: volume || 'Not specified',
      referral: referral || 'Direct',
      submittedAt: new Date().toLocaleString()
    };

    try {
      // 1. Always save locally as immediate safety backup
      try {
        const stored = JSON.parse(localStorage.getItem(WAITLIST.storageKey) || '[]');
        stored.push(payload);
        localStorage.setItem(WAITLIST.storageKey, JSON.stringify(stored));
      } catch (storageErr) {
        console.warn('LocalStorage backup failed:', storageErr);
      }

      // 2. Post to Google Apps Script Webhook if configured
      if (WAITLIST.sheetUrl && WAITLIST.sheetUrl.trim() !== '') {
        await fetch(WAITLIST.sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      setRefCode(generatedRef);
      setSubmitted(true);
      setTimeout(() => {
        const formEl = document.getElementById('waitlist-form');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      console.error('Waitlist submission error:', err);
      // Still acknowledge submission since backup is cached
      setRefCode(generatedRef);
      setSubmitted(true);
      setTimeout(() => {
        const formEl = document.getElementById('waitlist-form');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFullName('');
    setWhatsapp('');
    setEmail('');
    setCompany('');
    setLocation('');
    setVolume('');
    setReferral('');
    setConsent(false);
    setRefCode('');
  };

  return (
    <div className="bg-cas-canvas text-cas-slate min-h-screen">
      {/* Top Pre-Launch Banner */}
      <div className="bg-cas-slate text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cas-amber animate-pulse" />
            <span className="font-semibold text-slate-200">CAS Energy Pre-Launch</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">Wholesale Automotive Gas Oil (AGO)</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-cas-amber">
            <span>casdiesel.com</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <a href="mailto:info@casdiesel.com" className="hidden sm:inline hover:text-white transition-colors">
              info@casdiesel.com
            </a>
          </div>
        </div>
      </div>

      {/* Hero & Form Section: Above-the-fold split layout */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-cas-border bg-gradient-to-b from-white via-white to-cas-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Direct value proposition */}
            <div className="lg:col-span-5 space-y-6 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-cas-amberDark text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cas-amber" />
                <span>Priority Access Allocation</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cas-slate tracking-tight leading-tight">
                Wholesale Diesel. Protected By Escrow.
              </h1>

              <p className="text-base sm:text-lg text-cas-muted leading-relaxed">
                Connect directly with licensed depot marketers across Lagos, Warri, Port Harcourt, and Calabar. Your payment stays securely locked in escrow until the truck arrives and diesel is confirmed at your gate.
              </p>

              {/* Three Core Guarantees (Desktop column highlights) */}
              <div className="hidden lg:block space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-cas-blue flex items-center justify-center shrink-0 mt-0.5">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-cas-slate">Direct Ex-Depot Pricing</h2>
                    <p className="text-xs text-cas-muted mt-0.5">Live rates published directly by licensed marketers with zero broker markups.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-cas-green flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-cas-slate">Payment Released At Gate</h2>
                    <p className="text-xs text-cas-muted mt-0.5">Funds stay safe in escrow until you verify quantity and quality upon delivery.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-cas-amberDark flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-cas-slate">Verified Loading Documents</h2>
                    <p className="text-xs text-cas-muted mt-0.5">NMDPRA licences, batch test certs, and loading tickets matched to every order.</p>
                  </div>
                </div>
              </div>

              {/* Active Depot Coverage Strip */}
              <div className="hidden lg:block pt-4 border-t border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-cas-muted mb-2.5">Depot Coverage</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Apapa', 'Ibafon / Tin Can', 'Port Harcourt', 'Warri', 'Oghara', 'Calabar'].map((depot) => (
                    <span key={depot} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-cas-slate shadow-2xs">
                      {depot}
                    </span>
                  ))}
                </div>
              </div>

              {/* Launch Notice */}
              <div className="hidden lg:flex p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-cas-muted items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cas-slate shrink-0 mt-0.5" />
                <span>
                  Registered buyers and marketers receive priority onboarding passes and real-time depot price alerts via WhatsApp before public launch.
                </span>
              </div>
            </div>

            {/* Right Column: The Waitlist Form Card (Right above the fold!) */}
            <div id="waitlist-form" className="lg:col-span-7 scroll-mt-20">
              <div className="bg-white rounded-2xl border border-cas-border shadow-md overflow-hidden">
                {submitted ? (
                  /* Confirmation State */
                  <div className="p-8 sm:p-12 text-center">
                    <div className="w-14 h-14 bg-emerald-100 text-cas-green rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <span className="inline-block px-3 py-1 rounded bg-slate-100 text-cas-slate text-xs font-mono font-bold uppercase tracking-wider mb-2">
                      Priority Pass: {refCode}
                    </span>

                    <h2 className="text-2xl font-extrabold text-cas-slate">
                      Your Access Spot Is Reserved
                    </h2>

                    <p className="mt-2 text-sm text-cas-muted max-w-md mx-auto leading-relaxed">
                      Thank you for joining CAS Diesel. As onboarding batches open for your area, our team will message you directly on WhatsApp with your pass details.
                    </p>

                    <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto text-xs text-cas-muted space-y-2.5">
                      <p className="font-bold text-cas-slate uppercase tracking-wider text-[11px]">Next Steps</p>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                        <span>Your WhatsApp contact is queued for priority onboarding.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                        <span>You will receive advance ex-depot pricing before public launch.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                        <span>Official launch schedule and credentials will be sent to your inbox.</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs font-bold text-cas-muted hover:text-cas-slate underline underline-offset-4"
                      >
                        Register another company or contact
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Input Form */
                  <div className="p-6 sm:p-8">
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-cas-slate">
                        Join The Priority Waitlist
                      </h2>
                      <p className="text-xs sm:text-sm text-cas-muted mt-1">
                        Select your role below to secure your allocation.
                      </p>
                    </div>

                    {/* Role Toggle Switch */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                      <button
                        type="button"
                        onClick={() => setRole('BUYER')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          role === 'BUYER'
                            ? 'bg-cas-slate text-white shadow-xs'
                            : 'text-cas-muted hover:text-cas-slate'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Corporate Buyer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('MARKETER')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          role === 'MARKETER'
                            ? 'bg-cas-amberDark text-white shadow-xs'
                            : 'text-cas-muted hover:text-cas-slate'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Licensed Marketer</span>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Honeypot field for bot protection */}
                      <div style={{ display: 'none' }} aria-hidden="true">
                        <label htmlFor="website_trap">Leave this blank</label>
                        <input
                          type="text"
                          id="website_trap"
                          name="website_trap"
                          value={honeyPot}
                          onChange={(e) => setHoneyPot(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {/* Row 1: Name and WhatsApp */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-cas-slate mb-1">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aliko Mohammed"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-cas-slate mb-1">
                            WhatsApp Phone <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 0803 123 4567"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                          />
                        </div>
                      </div>

                      {/* Row 2: Email and Company */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-cas-slate mb-1">
                            Work or Personal Email <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. name@company.com or name@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-cas-slate mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder={role === 'BUYER' ? 'e.g. Pinnacle Mills Ltd' : 'e.g. Sahara Downstream Ltd'}
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                          />
                        </div>
                      </div>

                      {/* Row 3: Location and Volume Tier */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-cas-slate mb-1">
                            {role === 'BUYER' ? 'Delivery State' : 'Primary Supply Depot'}
                          </label>
                          <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate bg-white"
                          >
                            <option value="">Select location...</option>
                            {(role === 'BUYER' ? STATES : DEPOTS).map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-cas-slate mb-1">
                            {role === 'BUYER' ? 'Monthly Consumption' : 'Supply Capacity'}
                          </label>
                          <select
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate bg-white"
                          >
                            <option value="">Select monthly volume...</option>
                            {VOLUME_TIERS.map((tier) => (
                              <option key={tier} value={tier}>{tier}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Row 4: Referral Source */}
                      <div>
                        <label className="block text-xs font-bold text-cas-slate mb-1">
                          How Did You Hear About CAS Diesel? (Optional)
                        </label>
                        <select
                          value={referral}
                          onChange={(e) => setReferral(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate bg-white"
                        >
                          <option value="">Select source...</option>
                          {REFERRAL_SOURCES.map((src) => (
                            <option key={src} value={src}>{src}</option>
                          ))}
                        </select>
                      </div>

                      {/* Error Banner */}
                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      {/* Consent Checkbox */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-cas-slate focus:ring-cas-slate"
                          />
                          <span className="text-xs text-cas-muted leading-relaxed">
                            I agree to receive CAS Diesel access updates, depot price notifications, and onboarding alerts.
                          </span>
                        </label>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 px-6 rounded-xl bg-cas-slate hover:bg-black text-white font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                      >
                        {submitting ? (
                          <span>Registering your priority spot...</span>
                        ) : (
                          <>
                            <span>Join The Priority Waitlist</span>
                            <ArrowRight className="w-4 h-4 text-cas-amber" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-cas-muted pt-1">
                        Zero obligation. Strictly used for priority onboarding allocation.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Secondary Clean Summary Below The Fold: Three Steps */}
      <section className="py-12 sm:py-16 border-b border-cas-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-cas-muted">Transaction Flow</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-cas-slate mt-1.5">
              Three Steps From Order To Gate Discharge
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-cas-canvas border border-cas-border">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-cas-blue flex items-center justify-center mb-3.5 font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-cas-slate text-base">Compare & Fund Escrow</h4>
              <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                Review verified depot prices from licensed marketers. Lock payment in secure escrow so suppliers see funds are guaranteed before trucks load.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cas-canvas border border-cas-border">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-cas-amberDark flex items-center justify-center mb-3.5 font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-cas-slate text-base">Track Truck Dispatch</h4>
              <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                A verified driver is assigned. Track transit in real time with automated digital loading tickets and waybills attached directly to your order.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cas-canvas border border-cas-border">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-cas-green flex items-center justify-center mb-3.5 font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-cas-slate text-base">Confirm & Release</h4>
              <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                Inspect quantity and test quality at your facility gate. Once you confirm receipt, escrow releases payout directly to the marketer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Summary for Both Sides */}
      <section className="py-12 sm:py-16 bg-cas-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Buyer Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-cas-border">
              <div className="flex items-center gap-2 text-cas-slate font-bold text-base mb-3">
                <Building2 className="w-5 h-5 text-cas-blue" />
                <span>For Corporate Buyers</span>
              </div>
              <ul className="space-y-2.5 text-xs text-cas-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                  <span>Real ex-depot prices without broker layer markups</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                  <span>100% escrow protection: funds stay locked until delivery is verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                  <span>Pinpoint gate delivery navigation so tankers never get lost</span>
                </li>
              </ul>
            </div>

            {/* Marketer Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-cas-border">
              <div className="flex items-center gap-2 text-cas-slate font-bold text-base mb-3">
                <Truck className="w-5 h-5 text-cas-amberDark" />
                <span>For Licensed Marketers</span>
              </div>
              <ul className="space-y-2.5 text-xs text-cas-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                  <span>Guaranteed payment in escrow before truck leaves the depot</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                  <span>Direct reach to vetted corporate buyers across all states</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                  <span>Automated waybills, certificates, and instant payout release</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
