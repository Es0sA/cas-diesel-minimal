import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, UserCheck, Truck, MapPin, Navigation, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { DEPOTS } from '../data/depots';
import KycUpload from './KycUpload';
import { usePageTitle } from '../lib/usePageTitle';

const ROLE_COPY = {
  BUYER: { icon: Building2, title: 'Set up your delivery location', intro: 'Tell us who is buying and pin the discharge gate so tankers never get lost.', home: '/' },
  VENDOR: { icon: UserCheck, title: 'Set up your vendor profile', intro: 'Your business details, then the documents we need to verify you.', home: '/vendor' },
  DRIVER: { icon: Truck, title: 'Set up your driver profile', intro: 'Your details and truck, then your licence and calibration chart.', home: '/driver' }
};

const inputCls = 'w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-cas-amber';
const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
    {children}
  </div>
);

export default function Onboarding({ user }) {
  usePageTitle('Set up your profile', 'Finish setting up your CAS Diesel account.');
  const navigate = useNavigate();
  const role = (user?.role || '').toUpperCase();
  const copy = ROLE_COPY[role];
  const [step, setStep] = useState('details');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [geolocating, setGeolocating] = useState(false);

  const [buyer, setBuyer] = useState({ company: '', officer: '', phone: '', lat: '6.595200', lng: '3.342100', clearance: '33000' });
  const [supplier, setSupplier] = useState({
    name: '',
    rc: '',
    depot: DEPOTS[0]?.name || '',
    phone: '',
    customDepotName: '',
    customDepotState: 'Lagos',
    customDepotArea: '',
    customDepotAddress: '',
    customDepotPhone: ''
  });
  const [driver, setDriver] = useState({ name: '', phone: '', licence: '', plate: '', capacity: '33000' });

  useEffect(() => {
    if (user && !copy) navigate('/', { replace: true });
  }, [user, copy, navigate]);

  if (!user) {
    return <div className="max-w-xl mx-auto px-4 py-16 text-center text-sm text-slate-600">Sign in to finish setting up your account.</div>;
  }
  if (!copy) return null;
  const Icon = copy.icon;

  const locate = () => {
    if (!('geolocation' in navigator)) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setBuyer((b) => ({ ...b, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) })); setGeolocating(false); },
      () => setGeolocating(false),
      { timeout: 8000 }
    );
  };

  const saveDetails = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (role === 'BUYER') {
        if (!buyer.company.trim()) throw new Error('Company name is required.');
        await api.companies.updateProfile({
          companyName: buyer.company.trim(),
          businessAddress: `Gate: (${buyer.lat}, ${buyer.lng}) | Clearance: ${buyer.clearance}L`,
          gateLatitude: parseFloat(buyer.lat),
          gateLongitude: parseFloat(buyer.lng),
          contactPhone: buyer.phone.trim()
        });
        navigate(copy.home);
        return;
      }
      if (role === 'VENDOR') {
        if (!supplier.name.trim() || !supplier.rc.trim()) throw new Error('Company name and CAC RC number are required.');
        let formattedAddress = supplier.depot;
        let depotIdVal = 'other';
        if (supplier.depot === 'OTHER') {
          if (!supplier.customDepotName.trim()) throw new Error('Please enter the custom depot / tank farm name.');
          if (!supplier.customDepotAddress.trim()) throw new Error('Please provide the depot terminal address or landmark.');
          const areaPart = supplier.customDepotArea.trim() ? `${supplier.customDepotArea.trim()}, ` : '';
          formattedAddress = `${supplier.customDepotName.trim()} (${areaPart}${supplier.customDepotState}) - ${supplier.customDepotAddress.trim()}`;
          if (supplier.customDepotPhone.trim()) {
            formattedAddress += ` | Desk: ${supplier.customDepotPhone.trim()}`;
          }
        } else {
          const matched = DEPOTS.find((d) => d.name === supplier.depot);
          if (matched) depotIdVal = matched.id;
        }

        await api.companies.updateProfile({
          companyName: supplier.name.trim(),
          registrationNumber: supplier.rc.trim(),
          businessAddress: formattedAddress,
          contactPhone: supplier.phone.trim(),
          depotId: depotIdVal
        });
      } else {
        if (!driver.name.trim() || !driver.phone.trim() || !driver.licence.trim()) throw new Error('Name, WhatsApp number and licence number are required.');
        const parts = driver.name.trim().split(' ');
        await api.drivers.updateProfile({
          firstName: parts[0],
          lastName: parts.slice(1).join(' ') || 'Driver',
          licenseNumber: driver.licence.trim(),
          truckPlateNumber: driver.plate.trim() || 'UNREGISTERED',
          truckCapacityLiters: parseInt(driver.capacity, 10) || 33000
        });
      }
      setStep('documents');
    } catch (err) {
      setError(err.message || 'Could not save your details. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        <span className={step === 'details' ? 'text-cas-slate' : ''}>1. Your details</span>
        {role !== 'BUYER' && (<><span aria-hidden="true">/</span><span className={step === 'documents' ? 'text-cas-slate' : ''}>2. Documents</span></>)}
      </div>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-cas-slate text-cas-amber flex items-center justify-center"><Icon className="w-5 h-5" aria-hidden="true" /></span>
        <h1 className="text-2xl font-extrabold tracking-tight text-cas-slate">{step === 'details' ? copy.title : 'Upload your documents'}</h1>
      </div>
      <p className="text-sm text-slate-600 mb-6">{step === 'details' ? copy.intro : 'An admin reviews each document. You can add them now or come back to them later from your desk.'}</p>

      {error && <div role="alert" className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">{error}</div>}

      {step === 'details' && (
        <form onSubmit={saveDetails} className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          {role === 'BUYER' && (
            <>
              <Field id="ob-company" label="Company name"><input id="ob-company" className={inputCls} value={buyer.company} onChange={(e) => setBuyer({ ...buyer, company: e.target.value })} required /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field id="ob-officer" label="Receiving officer"><input id="ob-officer" className={inputCls} value={buyer.officer} onChange={(e) => setBuyer({ ...buyer, officer: e.target.value })} /></Field>
                <Field id="ob-bphone" label="Officer phone"><input id="ob-bphone" type="tel" className={inputCls} value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} /></Field>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />Discharge gate</span>
                  <button type="button" onClick={locate} className="text-xs font-bold text-cas-amberDark underline underline-offset-2 flex items-center gap-1">
                    {geolocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Navigation className="w-3.5 h-3.5" aria-hidden="true" />}Use my location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="ob-lat" label="Latitude"><input id="ob-lat" className={`${inputCls} font-mono`} value={buyer.lat} onChange={(e) => setBuyer({ ...buyer, lat: e.target.value })} /></Field>
                  <Field id="ob-lng" label="Longitude"><input id="ob-lng" className={`${inputCls} font-mono`} value={buyer.lng} onChange={(e) => setBuyer({ ...buyer, lng: e.target.value })} /></Field>
                </div>
                <Field id="ob-clear" label="Truck clearance at the gate">
                  <select id="ob-clear" className={inputCls} value={buyer.clearance} onChange={(e) => setBuyer({ ...buyer, clearance: e.target.value })}>
                    <option value="33000">33,000 litre trucks</option><option value="45000">45,000 litre trucks</option><option value="60000">60,000 litre trucks</option>
                  </select>
                </Field>
              </div>
            </>
          )}
          {role === 'VENDOR' && (
            <>
              <Field id="ob-sname" label="Company name"><input id="ob-sname" className={inputCls} value={supplier.name} onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} required /></Field>
              <Field id="ob-rc" label="CAC RC number"><input id="ob-rc" className={inputCls} value={supplier.rc} onChange={(e) => setSupplier({ ...supplier, rc: e.target.value })} required /></Field>
              <Field id="ob-depot" label="Primary depot">
                <select id="ob-depot" className={inputCls} value={supplier.depot} onChange={(e) => setSupplier({ ...supplier, depot: e.target.value })}>
                  {DEPOTS.map((d) => <option key={d.name} value={d.name}>{d.name} ({d.hub})</option>)}
                  <option value="OTHER">Other depot (please specify)</option>
                </select>
              </Field>

              {supplier.depot === 'OTHER' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cas-slate">
                    <MapPin className="w-4 h-4 text-cas-amberDark" aria-hidden="true" />
                    <span>Custom Depot / Loading Terminal Details</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Provide the loading terminal details so buyers and admins have accurate facility information.
                  </p>

                  <Field id="ob-cdepot-name" label="Depot / Tank farm name">
                    <input
                      id="ob-cdepot-name"
                      className={inputCls}
                      placeholder="e.g. Pinnacle Oil & Gas, Matrix Energy, Prudent, NIPCO"
                      value={supplier.customDepotName}
                      onChange={(e) => setSupplier({ ...supplier, customDepotName: e.target.value })}
                      required
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field id="ob-cdepot-state" label="State / Hub">
                      <select
                        id="ob-cdepot-state"
                        className={inputCls}
                        value={supplier.customDepotState}
                        onChange={(e) => setSupplier({ ...supplier, customDepotState: e.target.value })}
                      >
                        <option value="Lagos">Lagos</option>
                        <option value="Delta (Warri / Koko / Oghara)">Delta (Warri / Koko / Oghara)</option>
                        <option value="Rivers (Port Harcourt / Onne)">Rivers (Port Harcourt / Onne)</option>
                        <option value="Cross River (Calabar)">Cross River (Calabar)</option>
                        <option value="Edo">Edo</option>
                        <option value="Akwa Ibom">Akwa Ibom</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Kano">Kano</option>
                        <option value="Other State">Other State</option>
                      </select>
                    </Field>

                    <Field id="ob-cdepot-area" label="City / Port area / Zone">
                      <input
                        id="ob-cdepot-area"
                        className={inputCls}
                        placeholder="e.g. Koko Free Zone, Dockyard Apapa, Onne"
                        value={supplier.customDepotArea}
                        onChange={(e) => setSupplier({ ...supplier, customDepotArea: e.target.value })}
                      />
                    </Field>
                  </div>

                  <Field id="ob-cdepot-addr" label="Terminal address / Landmark / Gate">
                    <input
                      id="ob-cdepot-addr"
                      className={inputCls}
                      placeholder="e.g. Berth 2, Marine Jetty Gate, Commercial Wharf"
                      value={supplier.customDepotAddress}
                      onChange={(e) => setSupplier({ ...supplier, customDepotAddress: e.target.value })}
                      required
                    />
                  </Field>

                  <Field id="ob-cdepot-phone" label="Depot sales desk / Loading rep phone (Optional)">
                    <input
                      id="ob-cdepot-phone"
                      type="tel"
                      className={inputCls}
                      placeholder="e.g. 08012345678"
                      value={supplier.customDepotPhone}
                      onChange={(e) => setSupplier({ ...supplier, customDepotPhone: e.target.value })}
                    />
                  </Field>
                </div>
              )}

              <Field id="ob-sphone" label="Contact phone"><input id="ob-sphone" type="tel" className={inputCls} value={supplier.phone} onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })} /></Field>
            </>
          )}
          {role === 'DRIVER' && (
            <>
              <Field id="ob-dname" label="Full name"><input id="ob-dname" className={inputCls} value={driver.name} onChange={(e) => setDriver({ ...driver, name: e.target.value })} required /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field id="ob-dphone" label="WhatsApp number"><input id="ob-dphone" type="tel" className={inputCls} value={driver.phone} onChange={(e) => setDriver({ ...driver, phone: e.target.value })} required /></Field>
                <Field id="ob-dlic" label="Licence number"><input id="ob-dlic" className={inputCls} value={driver.licence} onChange={(e) => setDriver({ ...driver, licence: e.target.value })} required /></Field>
                <Field id="ob-plate" label="Truck plate"><input id="ob-plate" className={inputCls} value={driver.plate} onChange={(e) => setDriver({ ...driver, plate: e.target.value })} /></Field>
                <Field id="ob-cap" label="Tanker capacity">
                  <select id="ob-cap" className={inputCls} value={driver.capacity} onChange={(e) => setDriver({ ...driver, capacity: e.target.value })}>
                    <option value="33000">33,000 litres</option><option value="45000">45,000 litres</option><option value="60000">60,000 litres</option>
                  </select>
                </Field>
              </div>
            </>
          )}
          <button type="submit" disabled={busy} className="w-full py-3.5 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-70">
            {busy ? <Loader2 className="w-4 h-4 animate-spin text-cas-amber" aria-hidden="true" /> : <><span>{role === 'BUYER' ? 'Finish setup' : 'Save and continue'}</span><ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" /></>}
          </button>
        </form>
      )}

      {step === 'documents' && (
        <div>
          <KycUpload types={role === 'VENDOR' ? ['CAC_CERT', 'NMDPRA_LICENCE'] : ['DRIVER_LICENCE', 'TRUCK_CALIBRATION']} />
          <button type="button" onClick={() => navigate(copy.home)} className="w-full py-3.5 bg-cas-slate hover:bg-black text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
            <span>Go to my desk</span><ArrowRight className="w-4 h-4 text-cas-amber" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
