import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Fuel, 
  Layers, 
  Lock, 
  Sparkles, 
  AlertCircle,
  Clock,
  PhoneCall
} from 'lucide-react';
import { WAITLIST, CONTACT } from '../config';

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
      {/* Top Banner */}
      <div className="bg-cas-slate text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cas-amber animate-pulse" />
            <span className="font-semibold text-slate-200">CAS Energy Pre-Launch</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-cas-border bg-gradient-to-b from-white to-cas-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-cas-amberDark text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-cas-amber" />
              <span>Priority Access Allocation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-cas-slate tracking-tight leading-tight">
              Your Diesel Payment Is Protected Until Delivery Is Confirmed At Your Gate
            </h1>

            <p className="mt-5 text-base sm:text-xl text-cas-muted leading-relaxed max-w-2xl mx-auto">
              Compare licensed depot marketers across Lagos, Warri, Port Harcourt, and Calabar. Pay into escrow. Release payment only when your truck arrives and your delivery is verified, not before.
            </p>
          </div>

          {/* Three Core Value Badges */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-cas-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-cas-blue flex items-center justify-center mb-4">
                  <Fuel className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-cas-slate text-base">Direct Depot Pricing</h3>
                <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                  Browse live ex-depot rates from Apapa, Ibafon, Warri, Port Harcourt, and Calabar, updated directly by licensed marketers, with no broker markups.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cas-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-cas-green flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-cas-slate text-base">Pay Only When Diesel Arrives</h3>
                <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                  Your funds are locked in escrow before the truck leaves the depot. Payment is released to the marketer only after you confirm delivery at your gate.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-cas-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-cas-amberDark flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-cas-slate text-base">Documents Verified Before Discharge</h3>
                <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                  Loading tickets, batch test certificates, and calibration records are matched to your order automatically. You see the full picture before you sign anything.
                </p>
              </div>
            </div>
          </div>

          {/* Active Depot Coverage Strip */}
          <div className="mt-8 pt-6 border-t border-cas-border max-w-5xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-cas-muted text-center mb-4">Active Depot Coverage</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Apapa (Lagos)', 'Ibafon / Tin Can (Lagos)', 'Port Harcourt (Rivers)', 'Warri (Delta)', 'Oghara (Delta)', 'Calabar (Cross River)'].map((depot) => (
                <span key={depot} className="px-3 py-1.5 rounded-full bg-white border border-cas-border text-xs font-semibold text-cas-muted shadow-sm">
                  {depot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 sm:py-14 border-b border-cas-border bg-cas-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-cas-muted">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-cas-slate mt-2">
              Three Steps From Quote to Delivery
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="relative p-6 rounded-2xl bg-white border border-cas-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-cas-blue flex items-center justify-center mb-4">
                <Fuel className="w-5 h-5" />
              </div>
              <span className="absolute top-4 right-4 font-black text-slate-100 text-4xl leading-none select-none">1</span>
              <h3 className="font-extrabold text-cas-slate text-base">Compare and Fund Escrow</h3>
              <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                Browse verified marketers and their live ex-depot prices. When you are ready, fund the order into escrow. The marketer sees your funds are secured before a truck is dispatched.
              </p>
            </div>
            <div className="relative p-6 rounded-2xl bg-white border border-cas-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-cas-amberDark flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <span className="absolute top-4 right-4 font-black text-slate-100 text-4xl leading-none select-none">2</span>
              <h3 className="font-extrabold text-cas-slate text-base">Track the Delivery</h3>
              <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                A verified driver is dispatched. You follow the truck in real time and can message the marketer directly from the order page.
              </p>
            </div>
            <div className="relative p-6 rounded-2xl bg-white border border-cas-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-cas-green flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="absolute top-4 right-4 font-black text-slate-100 text-4xl leading-none select-none">3</span>
              <h3 className="font-extrabold text-cas-slate text-base">Confirm at Your Gate</h3>
              <p className="text-xs text-cas-muted mt-2 leading-relaxed">
                When the truck reaches your discharge point, you verify quantity and quality, then confirm delivery. Only then is payment released to the marketer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketer Value Proposition */}
      <section className="py-10 sm:py-14 border-b border-cas-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cas-amberLight border border-amber-200 text-cas-amberDark text-xs font-bold uppercase tracking-wider mb-5">
                <Truck className="w-4 h-4" />
                <span>For Licensed Marketers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-cas-slate leading-tight">
                Your Truck Leaves Only When Payment Is Already Secured
              </h2>
              <p className="mt-4 text-sm text-cas-muted leading-relaxed">
                Stop chasing buyers for payment after delivery. On CAS Energy, your escrow is funded and confirmed before your tanker departs the gantry. If the buyer does not fund the order, the truck does not move.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Escrow confirmed before dispatch: no more credit risk',
                  'Access verified corporate buyers across all major states',
                  'Your NMDPRA-compliant depot listings published to active buyers',
                  'Waybill and loading documents matched automatically: less paperwork',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-cas-slate">
                    <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-cas-canvas border border-cas-border">
              <p className="text-xs font-bold uppercase tracking-wider text-cas-muted mb-5">Marketer onboarding includes</p>
              <div className="space-y-5">
                {[
                  { title: 'Licence Verification', desc: 'Submit your NMDPRA licence once. We verify it and publish your depot listing to active buyers.' },
                  { title: 'Price Publishing', desc: 'Set your own ex-depot price per litre. Buyers compare and select you directly: no broker in between.' },
                  { title: 'Guaranteed Escrow', desc: 'Funds are held before your truck leaves. You receive payment upon confirmed delivery, automatically.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-cas-amberDark flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cas-slate">{item.title}</p>
                      <p className="text-xs text-cas-muted mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Benefits Strip */}
      <section className="py-8 sm:py-10 bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-cas-amberDark mb-6">
            What You Get By Joining Early
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cas-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-cas-slate">First Access to Live Depot Pricing</p>
                <p className="text-xs text-cas-muted mt-0.5 leading-relaxed">You see verified ex-depot rates before they are published to the general market.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cas-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-cas-slate">Dedicated Account Manager</p>
                <p className="text-xs text-cas-muted mt-0.5 leading-relaxed">A named operations contact handles your onboarding and first delivery personally.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-cas-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-cas-slate">Priority Gate Clearance</p>
                <p className="text-xs text-cas-muted mt-0.5 leading-relaxed">Early accounts are onboarded in the first batch, ahead of the public launch queue.</p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-cas-amberDark font-semibold flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Priority onboarding is open to the first batch of registered companies. Spots are allocated by region.
          </p>
        </div>
      </section>

      {/* Main Waitlist Form Section */}
      <section id="waitlist-form" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-white rounded-3xl border border-cas-border shadow-lg overflow-hidden">
          {submitted ? (
            /* Thank You / Confirmation State */
            <div className="p-8 sm:p-14 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-cas-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-block px-3 py-1 rounded bg-slate-100 text-cas-slate text-xs font-mono font-bold uppercase tracking-wider mb-2">
                Priority Pass: {refCode}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-cas-slate">
                Your Access Spot Is Reserved
              </h2>

              <p className="mt-3 text-sm sm:text-base text-cas-muted max-w-md mx-auto leading-relaxed">
                Thank you for joining the CAS Diesel priority list. As onboarding batches open for your region, our operations team will contact you directly via WhatsApp.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto">
                <h4 className="text-xs font-bold text-cas-slate uppercase tracking-wider mb-3">
                  What happens next
                </h4>
                <ul className="space-y-3 text-xs text-cas-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                    <span>Your WhatsApp number is registered in our priority queue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                    <span>You will receive advance notice of published depot pricing before public trading commences.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0 mt-0.5" />
                    <span>Early accounts receive dedicated account manager assignment and expedited gate clearance.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-cas-muted hover:text-cas-slate underline underline-offset-4"
                >
                  Register another corporate entity or contact
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Form State */
            <div className="p-6 sm:p-12">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-cas-slate">
                  Join The Priority Waitlist
                </h2>
                <p className="text-xs sm:text-sm text-cas-muted mt-2">
                  Are you buying diesel or supplying it? Choose your role below.
                </p>
              </div>

              {/* Role Toggle Switch */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'BUYER'
                      ? 'bg-cas-slate text-white shadow-sm'
                      : 'text-cas-muted hover:text-cas-slate'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>I am a Corporate Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('MARKETER')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'MARKETER'
                      ? 'bg-cas-amberDark text-white shadow-sm'
                      : 'text-cas-muted hover:text-cas-slate'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>I am a Licensed Marketer</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field (hidden from legitimate users) */}
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

                {/* Section 1: Required Identity Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cas-muted border-b border-slate-100 pb-2">
                    Primary Contact (Required)
                  </h3>

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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cas-slate mb-1">
                        WhatsApp Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0803 123 4567 or +234..."
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                      />
                      <p className="text-[11px] text-cas-muted mt-1">
                        We send batch notices and onboarding passes via WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cas-slate mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. procurement@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                    />
                  </div>
                </div>

                {/* Section 2: Conditional Role Specific Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cas-muted border-b border-slate-100 pb-2">
                    {role === 'BUYER' ? 'Buyer Organisation & Volume' : 'Marketer Supply Profile'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cas-slate mb-1">
                        {role === 'BUYER' ? 'Company or Organisation Name' : 'Marketing Company Name'}
                      </label>
                      <input
                        type="text"
                        placeholder={role === 'BUYER' ? 'e.g. Pinnacle Manufacturing Ltd' : 'e.g. Sahara Downstream Ltd'}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cas-slate mb-1">
                        {role === 'BUYER' ? 'State Where You Receive Fuel' : 'Primary Supply Depot or Region'}
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate bg-white"
                      >
                        <option value="">Select location...</option>
                        {(role === 'BUYER' ? STATES : DEPOTS).map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cas-slate mb-1">
                      {role === 'BUYER' 
                        ? 'Estimated Monthly Diesel Consumption (Optional)' 
                        : 'Estimated Monthly Supply Capacity (Optional)'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {VOLUME_TIERS.map((tier) => (
                        <label
                          key={tier}
                          className={`p-3 rounded-xl border text-xs font-medium cursor-pointer flex items-center gap-2 transition-colors ${
                            volume === tier
                              ? 'border-cas-slate bg-slate-50 text-cas-slate font-bold'
                              : 'border-slate-200 hover:border-slate-300 text-cas-muted'
                          }`}
                        >
                          <input
                            type="radio"
                            name="volume"
                            value={tier}
                            checked={volume === tier}
                            onChange={(e) => setVolume(e.target.value)}
                            className="text-cas-slate focus:ring-cas-slate"
                          />
                          <span>{tier}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 3: Referral Source */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cas-muted border-b border-slate-100 pb-2">
                    Attribution
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-cas-slate mb-1">
                      How Did You Hear About CAS Diesel? (Optional)
                    </label>
                    <select
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cas-slate bg-white"
                    >
                      <option value="">Select source...</option>
                      {REFERRAL_SOURCES.map((src) => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-cas-slate focus:ring-cas-slate"
                    />
                    <span className="text-xs text-cas-muted leading-relaxed">
                      I agree to be contacted by CAS Diesel regarding platform access, verified depot rates, and onboarding announcements.
                    </span>
                  </label>
                </div>

                {/* Social Proof Counter */}
                <p className="text-center text-xs text-cas-muted pt-1">
                  <span className="font-bold text-cas-slate">47 companies</span> have already joined the priority list.
                </p>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-cas-slate hover:bg-black text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
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
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
