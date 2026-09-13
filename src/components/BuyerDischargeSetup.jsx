import React, { useState } from 'react';
import { MapPin, Navigation, Building2, CheckCircle2, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';

export default function BuyerDischargeSetup() {
  const [facilityName, setFacilityName] = useState('Standard Industrial Plant - Ikeja Terminal');
  const [facilityType, setFacilityType] = useState('manufacturing');
  const [latitude, setLatitude] = useState('6.5952');
  const [longitude, setLongitude] = useState('3.3421');
  const [geolocating, setGeolocating] = useState(false);
  const [truckClearance, setTruckClearance] = useState('33000');
  const [dischargeHose, setDischargeHose] = useState('camlock-3');
  const [officerName, setOfficerName] = useState('Babatunde Adeleke');
  const [officerPhone, setOfficerPhone] = useState('+234 803 491 2289');
  const [consentChecked, setConsentChecked] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTriggerGeolocation = () => {
    setGeolocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setGeolocating(false);
        },
        () => {
          // Fallback to accurate Lagos industrial coordinates if permission dismissed
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  return (
    <section id="buyer-registration" className="bg-cas-canvas py-12 md:py-20 border-b border-cas-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cas-blueLight text-cas-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Procurement Onboarding Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
            Register Facility Discharge Location
          </h2>
          <p className="text-base text-cas-muted mt-2">
            To prevent lost fuel trucks and ensure seamless delivery, your facility discharge gate must be mapped with verified GPS coordinates during registration.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 mb-6 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cas-green shrink-0" aria-hidden="true" />
            <span>Facility discharge profile successfully registered. Coordinates locked to your buyer account.</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-cas-border shadow-sm space-y-8">
          
          {/* Section 1: Facility Basics */}
          <div>
            <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cas-slate text-white text-xs flex items-center justify-center font-mono">1</span>
              <span>Establishment & Plant Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fac-name" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Establishment / Plant Name
                </label>
                <input
                  id="fac-name"
                  type="text"
                  required
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                />
              </div>

              <div>
                <label htmlFor="fac-type" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Facility Classification
                </label>
                <select
                  id="fac-type"
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                >
                  <option value="manufacturing">Manufacturing / Heavy Industrial Plant</option>
                  <option value="bank">Commercial Bank Regional Headquarters</option>
                  <option value="telecom">Telecommunications Switch / Data Centre</option>
                  <option value="hospital">Hospital / Medical Facility (Critical Power)</option>
                  <option value="estate">Commercial Real Estate / Residential Estate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Geolocation Mapping */}
          <div>
            <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cas-slate text-white text-xs flex items-center justify-center font-mono">2</span>
              <span>Discharge Gate Pin & GPS Coordinates (Mandatory)</span>
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-bold text-cas-slate uppercase tracking-wider block">Automatic Geolocation</span>
                  <span className="text-xs text-cas-muted">Click below to detect your current browser location for the discharge gate.</span>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerGeolocation}
                  disabled={geolocating}
                  className="px-4 py-2.5 bg-cas-blue hover:bg-sky-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{geolocating ? 'Detecting GPS...' : 'Allow Location & Pinpoint Gate'}</span>
                </button>
              </div>

              {/* Coordinate Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="coord-lat" className="block text-xs font-bold text-cas-slate mb-1">
                    Latitude (WGS84)
                  </label>
                  <input
                    id="coord-lat"
                    type="text"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded font-mono text-sm text-cas-slate"
                  />
                </div>
                <div>
                  <label htmlFor="coord-lng" className="block text-xs font-bold text-cas-slate mb-1">
                    Longitude (WGS84)
                  </label>
                  <input
                    id="coord-lng"
                    type="text"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded font-mono text-sm text-cas-slate"
                  />
                </div>
              </div>
            </div>

            {/* Visual Simulated Map Display */}
            <div className="relative w-full h-56 bg-slate-200 rounded-xl overflow-hidden border-2 border-slate-300 flex items-center justify-center">
              {/* Visual Map Grid Pattern */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Road lines simulation */}
              <div className="absolute w-full h-3 bg-slate-300 top-1/2 -translate-y-1/2"></div>
              <div className="absolute h-full w-3 bg-slate-300 left-1/2 -translate-x-1/2"></div>

              {/* Center Pin Drop */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-2.5 bg-cas-amber text-slate-900 rounded-full shadow-lg border-2 border-white animate-bounce">
                  <MapPin className="w-6 h-6 fill-current" aria-hidden="true" />
                </div>
                <div className="mt-1 px-3 py-1 bg-cas-slate text-white text-[11px] font-bold rounded shadow font-mono">
                  {latitude} N, {longitude} E
                </div>
                <span className="text-[10px] text-cas-slate font-bold bg-white/90 px-2 py-0.5 rounded mt-0.5">
                  Discharge Inlet Perimeter (Radius: 100m)
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Tanker Access Clearance */}
          <div>
            <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cas-slate text-white text-xs flex items-center justify-center font-mono">3</span>
              <span>Tank Farm Access & Clearance Restrictions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="clearance" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Maximum Allowable Tanker Size
                </label>
                <select
                  id="clearance"
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
                <label htmlFor="hose" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Discharge Connection Type
                </label>
                <select
                  id="hose"
                  value={dischargeHose}
                  onChange={(e) => setDischargeHose(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                >
                  <option value="camlock-3">Standard 3-Inch Male Camlock Fitting</option>
                  <option value="camlock-4">Heavy Duty 4-Inch Flanged Coupling</option>
                  <option value="gravity">Direct Gravity Underground Fill Pipe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Receiving Officer Contact & NDPR Form Consent */}
          <div>
            <h3 className="text-lg font-bold text-cas-slate pb-2 border-b border-slate-200 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cas-slate text-white text-xs flex items-center justify-center font-mono">4</span>
              <span>Receiving Officer Verification</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label htmlFor="off-name" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Receiving Facility Officer Name
                </label>
                <input
                  id="off-name"
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber"
                />
              </div>

              <div>
                <label htmlFor="off-phone" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Direct Contact Telephone (For Driver Upon Arrival)
                </label>
                <input
                  id="off-phone"
                  type="tel"
                  required
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-cas-slate focus:border-cas-amber font-mono"
                />
              </div>
            </div>

            {/* Mandatory NDPR Legal Consent Checkbox */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="w-5 h-5 text-cas-green rounded mt-0.5"
                />
                <span className="text-xs text-cas-slate leading-relaxed">
                  <strong>NDPR Location Consent:</strong> I confirm that I am authorized to register this facility. I agree that GPS coordinates and receiving contact numbers will be transmitted exclusively to the licensed marketer and assigned tanker driver once an order is locked in escrow.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={!consentChecked}
              className="w-full py-4 px-6 bg-cas-slate hover:bg-black text-white font-extrabold text-base rounded-lg transition-all shadow-md flex items-center justify-center gap-2 border-2 border-transparent hover:border-cas-amber disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5 text-cas-green" aria-hidden="true" />
              <span>Save & Verify Facility Discharge Profile</span>
            </button>
            <p className="text-xs text-center text-cas-muted mt-2">
              Profile data is saved to your account and automatically populated on future purchase orders.
            </p>
          </div>

        </form>

      </div>
    </section>
  );
}
