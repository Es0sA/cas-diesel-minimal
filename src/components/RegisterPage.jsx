import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  UserCheck, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MapPin, 
  Navigation, 
  KeyRound, 
  ArrowLeft,
  Lock
} from 'lucide-react';
import { INITIAL_INVITES } from '../data/invites';
import { DEPOT_PRICES } from '../data/depots';
import { api } from '../api';

export default function RegisterPage({ 
  onBackToHome, 
  initialRole = 'buyer', 
  inviteCodeParam = '',
  onRegistrationSuccess
}) {
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'buyer', 'supplier', 'driver'

  // Global Invite Codes state
  const [invites, setInvites] = useState(() => {
    const saved = localStorage.getItem('cas_invites_store');
    return saved ? JSON.parse(saved) : INITIAL_INVITES;
  });

  // Driver Form States
  const [driverInviteCode, setDriverInviteCode] = useState(inviteCodeParam || '');
  const [verifiedSupplier, setVerifiedSupplier] = useState(null);
  const [codeError, setCodeError] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverConfirmPassword, setDriverConfirmPassword] = useState('');
  const [driverError, setDriverError] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverPlate, setDriverPlate] = useState('');
  const [driverCapacity, setDriverCapacity] = useState('33000');

  // Buyer Form States
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [buyerConfirmPassword, setBuyerConfirmPassword] = useState('');
  const [buyerError, setBuyerError] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerRcNumber, setBuyerRcNumber] = useState('');
  const [buyerCategory, setBuyerCategory] = useState('manufacturing');
  const [latitude, setLatitude] = useState('6.595200');
  const [longitude, setLongitude] = useState('3.342100');
  const [geolocating, setGeolocating] = useState(false);
  const [truckClearance, setTruckClearance] = useState('33000');
  const [receivingOfficerName, setReceivingOfficerName] = useState('');
  const [receivingOfficerPhone, setReceivingOfficerPhone] = useState('');
  const [buyerConsent, setBuyerConsent] = useState(true);

  // Supplier Form States
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierPassword, setSupplierPassword] = useState('');
  const [supplierConfirmPassword, setSupplierConfirmPassword] = useState('');
  const [supplierError, setSupplierError] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierRc, setSupplierRc] = useState('');
  const [supplierLicense, setSupplierLicense] = useState('');
  const [primaryDepot, setPrimaryDepot] = useState('Ijegun Egba Tank Farm Cluster');
  const [initialPrice, setInitialPrice] = useState(1175);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Submission Status
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const validateCode = React.useCallback((codeToTest) => {
    const trimmed = codeToTest.trim().toUpperCase();
    if (!trimmed) {
      setVerifiedSupplier(null);
      setCodeError('');
      return;
    }

    const found = invites.find(inv => inv.code.toUpperCase() === trimmed);
    if (!found) {
      setVerifiedSupplier(null);
      setCodeError('Invalid code. Please request a valid one-time registration link or code from your marketer.');
    } else if (found.status === 'used') {
      setVerifiedSupplier(null);
      setCodeError('This authorization code has already been redeemed by another driver. Codes are strictly single use.');
    } else {
      setVerifiedSupplier(found);
      setCodeError('');
    }
  }, [invites]);

  // Check code on load if inviteCodeParam is present
  useEffect(() => {
    if (inviteCodeParam) {
      setDriverInviteCode(inviteCodeParam);
      validateCode(inviteCodeParam);
    }
  }, [inviteCodeParam, validateCode]);

  const handleDriverCodeChange = (e) => {
    const val = e.target.value.toUpperCase();
    setDriverInviteCode(val);
    validateCode(val);
  };

  const handleTriggerGeolocation = () => {
    setGeolocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
          setGeolocating(false);
        },
        () => {
          setLatitude('6.595180');
          setLongitude('3.342110');
          setGeolocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setGeolocating(false);
    }
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    if (!verifiedSupplier) {
      setCodeError('You must enter a valid marketer authorization code to register as a driver.');
      return;
    }

    // Mark code as redeemed
    const updatedInvites = invites.map(inv => {
      if (inv.code === verifiedSupplier.code) {
        return {
          ...inv,
          status: 'used',
          usedBy: `${driverName} (${driverPlate})`
        };
      }
      return inv;
    });

    setInvites(updatedInvites);
    localStorage.setItem('cas_invites_store', JSON.stringify(updatedInvites));

    setSubmitSuccess({
      role: 'driver',
      title: 'Driver Registration Approved',
      message: `You are now officially registered as a fleet tanker driver for ${verifiedSupplier.supplierName}. You will receive order dispatch notifications on WhatsApp at ${driverPhone}.`
    });
  };

  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    setBuyerError('');
    if (buyerPassword.length < 12) {
      setBuyerError('Password must be at least 12 characters.');
      return;
    }
    if (buyerPassword !== buyerConfirmPassword) {
      setBuyerError('Passwords do not match.');
      return;
    }
    
    try {
      await api.auth.register({ email: buyerEmail, password: buyerPassword, role: 'BUYER' });
      await api.auth.login({ email: buyerEmail, password: buyerPassword });
      
      await api.companies.updateProfile({
        companyName: buyerCompany,
        registrationNumber: buyerRcNumber,
        businessAddress: `${latitude}, ${longitude}`,
        contactPhone: receivingOfficerPhone
      });

      setSubmitSuccess({
        role: 'buyer',
        title: 'Corporate Buyer Account Activated',
        message: `${buyerCompany} has been registered with verified discharge gate coordinates at (${latitude}, ${longitude}). You can now deposit into escrow and order directly from loading terminals.`
      });
    } catch (err) {
      console.error(err);
      setBuyerError(err.message || 'An error occurred during buyer registration.');
    }
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    setSupplierError('');
    if (supplierPassword.length < 12) {
      setSupplierError('Password must be at least 12 characters.');
      return;
    }
    if (supplierPassword !== supplierConfirmPassword) {
      setSupplierError('Passwords do not match.');
      return;
    }
    
    try {
      await api.auth.register({ email: supplierEmail, password: supplierPassword, role: 'SUPPLIER' });
      await api.auth.login({ email: supplierEmail, password: supplierPassword });
      
      await api.companies.updateProfile({
        companyName: supplierName,
        registrationNumber: supplierRc,
        businessAddress: primaryDepot,
        contactPhone: contactPhone
      });

      setSubmitSuccess({
        role: 'supplier',
        title: 'Marketer Account Created',
        message: `${supplierName} has been registered under NMDPRA license ${supplierLicense}. You can now broadcast spot prices and generate one-time driver invitation links.`
      });
    } catch (err) {
      console.error(err);
      setSupplierError(err.message || 'An error occurred during supplier registration.');
    }
  };

  return (
    <div className="bg-cas-canvas min-h-screen py-6 sm:py-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-8">
        
        {/* Back Button */}
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cas-slate hover:text-black mb-6 sm:mb-8 px-3 py-1.5 rounded bg-white border border-cas-border shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
          <span>Return to Homepage</span>
        </button>

        {/* Page Title & Context */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-200 text-cas-slate text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cas-green" aria-hidden="true" />
            <span>Regulated Downstream Registration</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
            Create Your CAS Energy Account
          </h1>
          <p className="text-sm sm:text-base text-cas-muted mt-2">
            Select your role below. Buyers map their facility gate coordinates; drivers must provide an authorization code from their employing marketer.
          </p>
        </div>

        {/* Success Alert Banner */}
        {submitSuccess && (
          <div className="p-6 mb-10 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-950 shadow-md">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-cas-green shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-extrabold text-emerald-900">{submitSuccess.title}</h3>
                <p className="text-sm text-emerald-800 mt-1 leading-relaxed">{submitSuccess.message}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onRegistrationSuccess) onRegistrationSuccess(submitSuccess.role);
                    }}
                    className="px-5 py-2.5 bg-cas-slate hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Proceed to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    Back to Marketplace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          
          {/* Card 1: Buyer */}
          <button
            type="button"
            onClick={() => { setSelectedRole('buyer'); setSubmitSuccess(null); }}
            className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
              selectedRole === 'buyer'
                ? 'bg-white border-cas-slate shadow-md ring-2 ring-cas-slate/20'
                : 'bg-white/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-cas-blue flex items-center justify-center mb-4 border border-sky-200">
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-extrabold text-base text-cas-slate">Corporate Buyer</h2>
              <p className="text-xs text-cas-muted mt-1.5 leading-snug">
                For factory procurement officers, commercial establishments, and estate managers purchasing bulk AGO.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-cas-blue">
              Includes GPS Gate Pin Setup
            </div>
          </button>

          {/* Card 2: Supplier */}
          <button
            type="button"
            onClick={() => { setSelectedRole('supplier'); setSubmitSuccess(null); }}
            className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
              selectedRole === 'supplier'
                ? 'bg-white border-cas-slate shadow-md ring-2 ring-cas-slate/20'
                : 'bg-white/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-cas-amberDark flex items-center justify-center mb-4 border border-amber-200">
                <UserCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-extrabold text-base text-cas-slate">Licensed Marketer</h2>
              <p className="text-xs text-cas-muted mt-1.5 leading-snug">
                For downstream petroleum off-takers and depot owners marketing certified AGO at custom spot rates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-cas-amberDark">
              Includes Driver Code Generator
            </div>
          </button>

          {/* Card 3: Driver */}
          <button
            type="button"
            onClick={() => { setSelectedRole('driver'); setSubmitSuccess(null); }}
            className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
              selectedRole === 'driver'
                ? 'bg-white border-cas-slate shadow-md ring-2 ring-cas-slate/20'
                : 'bg-white/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-cas-green flex items-center justify-center mb-4 border border-emerald-200">
                <Truck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-extrabold text-base text-cas-slate">Fleet Tanker Driver</h2>
              <p className="text-xs text-cas-muted mt-1.5 leading-snug">
                For calibrated truck operators delivering fuel under an authorized marketer fleet.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-cas-green">
              Requires Marketer Authorization Code
            </div>
          </button>

        </div>

        {/* Step 2: Role-Specific Forms */}

        {/* ============================================================ */}
        {/* DRIVER REGISTRATION FORM (With Supplier Code Requirement) */}
        {/* ============================================================ */}
        {selectedRole === 'driver' && (
          <form onSubmit={handleDriverSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-cas-border shadow-sm space-y-8">
            
            {/* The Mandatory Supplier Authorization Box */}
            <div className="p-6 bg-amber-50/80 border-2 border-cas-amber rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <KeyRound className="w-6 h-6 text-cas-amberDark shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-extrabold text-base text-cas-slate">
                    Mandatory Marketer Authorization Code
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    All drivers must be authorized by a registered petroleum marketer before receiving delivery orders.
                    Enter the single-use registration code provided by your employing company, or paste the link they texted you.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="auth-code" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Authorization Code (e.g. MAT-8849, PIN-4412, RAI-9921)
                </label>
                <div className="relative max-w-sm">
                  <input
                    id="auth-code"
                    type="text"
                    required
                    placeholder="ENTER CODE"
                    value={driverInviteCode}
                    onChange={handleDriverCodeChange}
                    className="w-full p-3 bg-white border-2 border-slate-300 rounded-lg text-lg font-mono font-extrabold tracking-widest text-cas-slate focus:border-cas-amber uppercase"
                  />
                </div>

                {/* Validation Status Feedback */}
                {verifiedSupplier && (
                  <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cas-green shrink-0" aria-hidden="true" />
                    <span>
                      Authorization Confirmed: You will be bound to fleet: <strong>{verifiedSupplier.supplierName}</strong> ({verifiedSupplier.depotName}).
                    </span>
                  </div>
                )}

                {codeError && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                    <span>{codeError}</span>
                  </div>
                )}

                <div className="mt-3 text-[11px] text-cas-muted">
                  Demo hint: Active sample codes include <strong className="font-mono text-cas-slate">MAT-8849</strong> (Matrix) or <strong className="font-mono text-cas-slate">PIN-4412</strong> (Pinnacle).
                </div>
              </div>
            </div>

            {/* Driver Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-5">
                Driver Personal & Licensing Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Email Address</label>
                  <input type="email" required value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Password</label>
                  <input type="password" required value={driverPassword} onChange={(e) => setDriverPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Confirm Password</label>
                  <input type="password" required value={driverConfirmPassword} onChange={(e) => setDriverConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                {driverError && (
                  <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold">{driverError}</div>
                )}
                <div>
                  <label htmlFor="driver-name-in" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    id="driver-name-in"
                    type="text"
                    required
                    placeholder="e.g. Suleiman Tanko"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="driver-phone-in" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Mobile Number (WhatsApp Enabled for Dispatch)
                  </label>
                  <input
                    id="driver-phone-in"
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="driver-lic-in" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    FRSC Articulated Drivers License Number
                  </label>
                  <input
                    id="driver-lic-in"
                    type="text"
                    required
                    placeholder="FRSC-LAG-90821-XA"
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="driver-plate-in" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Assigned Calibrated Tanker Plate
                  </label>
                  <input
                    id="driver-plate-in"
                    type="text"
                    required
                    placeholder="e.g. LSR-492-XA"
                    value={driverPlate}
                    onChange={(e) => setDriverPlate(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>
              </div>
            </div>

            {/* Tanker Volume */}
            <div>
              <label htmlFor="driver-cap-in" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                Calibrated Compartment Capacity
              </label>
              <select
                id="driver-cap-in"
                value={driverCapacity}
                onChange={(e) => setDriverCapacity(e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-cas-slate focus:border-cas-amber"
              >
                <option value="11000">11,000 Litres (Bobtail Tanker)</option>
                <option value="22000">22,000 Litres (Medium Rigid Tanker)</option>
                <option value="33000">33,000 Litres (Standard 3-Axle Articulated)</option>
                <option value="45000">45,000 Litres (Multi-Compartment Articulated)</option>
                <option value="60000">60,000 Litres (Heavy Industrial Articulated)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={!verifiedSupplier}
                className="w-full py-4 px-6 bg-cas-slate hover:bg-black text-white font-extrabold text-base rounded-lg transition-all shadow-md flex items-center justify-center gap-2 border-2 border-transparent hover:border-cas-amber disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5 text-cas-green" aria-hidden="true" />
                <span>Complete Driver Registration & Bind to Supplier Fleet</span>
              </button>
            </div>

          </form>
        )}

        {/* ============================================================ */}
        {/* BUYER REGISTRATION FORM (With Mandatory GPS Discharge Pin)  */}
        {/* ============================================================ */}
        {selectedRole === 'buyer' && (
          <form onSubmit={handleBuyerSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-cas-border shadow-sm space-y-8">
            
            {/* Establishment Basics */}
            <div>
              <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cas-slate text-white text-xs flex items-center justify-center font-mono">1</span>
                <span>Corporate Establishment Data</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Email Address</label>
                  <input type="email" required value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Password</label>
                  <input type="password" required value={buyerPassword} onChange={(e) => setBuyerPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Confirm Password</label>
                  <input type="password" required value={buyerConfirmPassword} onChange={(e) => setBuyerConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                {buyerError && (
                  <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold">{buyerError}</div>
                )}
                <div>
                  <label htmlFor="b-company" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Company / Establishment Name
                  </label>
                  <input
                    id="b-company"
                    type="text"
                    required
                    placeholder="e.g. Flour Mills Nigeria Plc"
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="b-rc" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    CAC Registration Number (RC)
                  </label>
                  <input
                    id="b-rc"
                    type="text"
                    required
                    placeholder="RC 492019"
                    value={buyerRcNumber}
                    onChange={(e) => setBuyerRcNumber(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="b-category" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Facility Operation Classification
                  </label>
                  <select
                    id="b-category"
                    value={buyerCategory}
                    onChange={(e) => setBuyerCategory(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  >
                    <option value="manufacturing">Manufacturing Plant / Industrial Factory</option>
                    <option value="bank">Commercial Bank Regional Headquarters / Branch Network</option>
                    <option value="telecom">Telecommunications Switch / Data Centre</option>
                    <option value="hospital">Hospital / Healthcare Institution (Continuous Critical Power)</option>
                    <option value="estate">Commercial Real Estate / Residential Estate Management</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mandatory Geolocation Discharge Gate Pin Drop */}
            <div>
              <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cas-slate text-white text-xs flex items-center justify-center font-mono">2</span>
                <span>Mandatory Delivery Location Mapping (Visible to Assigned Drivers)</span>
              </h3>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs font-bold text-cas-slate uppercase tracking-wider block">Automatic GPS Pin Drop</span>
                    <span className="text-xs text-cas-muted">Click below to allow location access so drivers receive turn-by-turn coordinates.</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerGeolocation}
                    disabled={geolocating}
                    className="px-4 py-2.5 bg-cas-blue hover:bg-sky-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{geolocating ? 'Reading Coordinates...' : 'Detect Discharge Gate Coordinates'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b-lat" className="block text-xs font-bold text-cas-slate mb-1">
                      Latitude (WGS84)
                    </label>
                    <input
                      id="b-lat"
                      type="text"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded font-mono text-sm text-cas-slate"
                    />
                  </div>
                  <div>
                    <label htmlFor="b-lng" className="block text-xs font-bold text-cas-slate mb-1">
                      Longitude (WGS84)
                    </label>
                    <input
                      id="b-lng"
                      type="text"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded font-mono text-sm text-cas-slate"
                    />
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="relative w-full h-52 bg-slate-200 rounded-xl overflow-hidden border-2 border-slate-300 flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute w-full h-3 bg-slate-300 top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-full w-3 bg-slate-300 left-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="p-2.5 bg-cas-amber text-slate-900 rounded-full shadow-lg border-2 border-white animate-bounce">
                    <MapPin className="w-6 h-6 fill-current" aria-hidden="true" />
                  </div>
                  <div className="mt-1 px-3 py-1 bg-cas-slate text-white text-[11px] font-bold rounded shadow font-mono">
                    {latitude} N, {longitude} E
                  </div>
                  <span className="text-[10px] text-cas-slate font-bold bg-white/90 px-2 py-0.5 rounded mt-0.5">
                    Discharge Geofence Radius: 100 meters
                  </span>
                </div>
              </div>
            </div>

            {/* Site Clearance & Receiving Officer Contact */}
            <div>
              <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cas-slate text-white text-xs flex items-center justify-center font-mono">3</span>
                <span>Gate Clearance & Receiving Officer</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="b-clearance" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Maximum Permitted Truck Size
                  </label>
                  <select
                    id="b-clearance"
                    value={truckClearance}
                    onChange={(e) => setTruckClearance(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  >
                    <option value="11000">11,000L Bobtail Only (Narrow Gate / Low Overhead Cables)</option>
                    <option value="22000">Up to 22,000L Rigid Tanker</option>
                    <option value="33000">Up to 33,000L Standard Semi-Trailer (Recommended)</option>
                    <option value="45000">Up to 45,000L Articulated Multi-Axle</option>
                    <option value="60000">Full 60,000L Heavy Industrial Articulated</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="b-officer" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Receiving Officer Full Name
                  </label>
                  <input
                    id="b-officer"
                    type="text"
                    required
                    placeholder="e.g. Babatunde Adeleke"
                    value={receivingOfficerName}
                    onChange={(e) => setReceivingOfficerName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="b-phone" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Receiving Officer Phone (Driver Will Call When At Gate)
                  </label>
                  <input
                    id="b-phone"
                    type="tel"
                    required
                    placeholder="+234 803 491 2289"
                    value={receivingOfficerPhone}
                    onChange={(e) => setReceivingOfficerPhone(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>
              </div>

              {/* Form Consent Checkbox */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={buyerConsent}
                    onChange={(e) => setBuyerConsent(e.target.checked)}
                    className="w-5 h-5 text-cas-green rounded mt-0.5"
                  />
                  <span className="text-xs text-cas-slate leading-relaxed">
                    <strong>NDPR Consent:</strong> I agree that our facility GPS coordinates and receiving contact phone will be transmitted to the verified marketer and assigned driver once an order is placed.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={!buyerConsent}
                className="w-full py-4 px-6 bg-cas-slate hover:bg-black text-white font-extrabold text-base rounded-lg transition-all shadow-md flex items-center justify-center gap-2 border-2 border-transparent hover:border-cas-amber disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5 text-cas-green" aria-hidden="true" />
                <span>Activate Corporate Buyer Account</span>
              </button>
            </div>

          </form>
        )}

        {/* ============================================================ */}
        {/* SUPPLIER / MARKETER REGISTRATION FORM */}
        {/* ============================================================ */}
        {selectedRole === 'supplier' && (
          <form onSubmit={handleSupplierSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-cas-border shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-5">
                Downstream Marketer Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Email Address</label>
                  <input type="email" required value={supplierEmail} onChange={(e) => setSupplierEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Password</label>
                  <input type="password" required value={supplierPassword} onChange={(e) => setSupplierPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-cas-slate mb-1.5">Confirm Password</label>
                  <input type="password" required value={supplierConfirmPassword} onChange={(e) => setSupplierConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm" />
                </div>
                {supplierError && (
                  <div className="sm:col-span-2 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold">{supplierError}</div>
                )}
                <div>
                  <label htmlFor="s-company" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Registered Marketer Company Name
                  </label>
                  <input
                    id="s-company"
                    type="text"
                    required
                    placeholder="e.g. Matrix Downstream Distribution Ltd"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="s-rc" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    CAC Incorporation Number (RC)
                  </label>
                  <input
                    id="s-rc"
                    type="text"
                    required
                    placeholder="RC 890123"
                    value={supplierRc}
                    onChange={(e) => setSupplierRc(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="s-license" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    NMDPRA Downstream Operating License No.
                  </label>
                  <input
                    id="s-license"
                    type="text"
                    required
                    placeholder="NMDPRA/DW/DEP/2024/0981"
                    value={supplierLicense}
                    onChange={(e) => setSupplierLicense(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="s-depot" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Primary Loading Depot / Terminal
                  </label>
                  <select
                    id="s-depot"
                    value={primaryDepot}
                    onChange={(e) => setPrimaryDepot(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  >
                    {DEPOT_PRICES.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="s-price" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Initial Daily Spot Price Per Litre (₦)
                  </label>
                  <input
                    id="s-price"
                    type="number"
                    required
                    min="1000"
                    max="2000"
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="s-contact" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Gantry Operations Manager Name
                  </label>
                  <input
                    id="s-contact"
                    type="text"
                    required
                    placeholder="e.g. Alhaji Garba Shehu"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                  />
                </div>

                <div>
                  <label htmlFor="s-phone" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                    Official Operations Hotline
                  </label>
                  <input
                    id="s-phone"
                    type="tel"
                    required
                    placeholder="+234 802 000 0000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-cas-slate hover:bg-black text-white font-extrabold text-base rounded-lg transition-all shadow-md flex items-center justify-center gap-2 border-2 border-transparent hover:border-cas-amber"
              >
                <CheckCircle2 className="w-5 h-5 text-cas-green" aria-hidden="true" />
                <span>Register Marketer Account & Enable Fleet Invitation Desk</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
