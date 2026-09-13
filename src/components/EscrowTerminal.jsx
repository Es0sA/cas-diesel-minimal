import React, { useState } from 'react';
import { DEPOT_PRICES, TANKER_CAPACITIES, DESTINATIONS } from '../data/depots';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Truck, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  ArrowRight,
  Gauge,
  FileText
} from 'lucide-react';

export default function EscrowTerminal() {
  // Configuration states
  const [selectedDepot, setSelectedDepot] = useState(DEPOT_PRICES[1]); // Default Ijegun
  const [selectedVolume, setSelectedVolume] = useState(TANKER_CAPACITIES[2]); // Default 33,000L
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]); // Default Ikeja

  // Simulation steps:
  // 1 = Configure Order
  // 2 = Escrow Deposited & Marketer Dispatched
  // 3 = In Transit (Non-Cancellable Route Lock Active)
  // 4 = Truck Arrived at Gate (Geofence Unlocked)
  // 5 = Delivery Verified & Escrow Released
  const [currentStep, setCurrentStep] = useState(1);

  // Simulated truck distance from buyer site
  const [distanceKm, setDistanceKm] = useState(18.5);

  // Computed Financials
  const productCost = selectedDepot.spotPrice * selectedVolume.volume;
  const haulageCost = selectedDest.haulageRatePerLitre * selectedVolume.volume;
  const totalLandedCost = productCost + haulageCost;
  const landedPricePerLitre = Math.round(totalLandedCost / selectedVolume.volume);

  const handleDepositEscrow = () => {
    setCurrentStep(2);
    setDistanceKm(18.5);
  };

  const handleDepartDepot = () => {
    setCurrentStep(3);
    setDistanceKm(12.4);
  };

  const handleSimulateGateArrival = () => {
    setCurrentStep(4);
    setDistanceKm(0.08); // 80 meters away: inside geofence perimeter (< 100m)
  };

  const handleConfirmDischarge = () => {
    setCurrentStep(5);
  };

  const handleResetSimulation = () => {
    setCurrentStep(1);
    setDistanceKm(18.5);
  };

  return (
    <section id="escrow-simulator" className="bg-cas-canvas py-12 md:py-20 border-b border-cas-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-200 text-cas-slate text-xs font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
            <span>Interactive Signature Element</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
            The Geofenced Escrow Terminal
          </h2>
          <p className="text-base sm:text-lg text-cas-muted mt-2">
            Experience how CAS Energy protects both buyer capital and supplier inventory.
            Once delivery begins, the route cannot be cancelled; payment can never be released until the driver is physically confirmed at your delivery gate.
          </p>
        </div>

        {/* The Main Terminal Console */}
        <div className="bg-white rounded-xl border-2 border-cas-border shadow-md overflow-hidden">
          {/* Top Status Banner */}
          <div className="bg-cas-slate text-white p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-cas-slate">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cas-amber font-bold">
                Live Transaction Simulation Environment
              </div>
              <div className="text-xl sm:text-2xl font-bold flex items-center gap-2 mt-0.5">
                <span>Contract Reference: CAS-AGO-2026-9941</span>
              </div>
            </div>

            {/* Step Progression Badges */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
              <span className={`px-2.5 py-1 rounded ${currentStep >= 1 ? 'bg-cas-amber text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                1. Quote
              </span>
              <span className="text-slate-500">&gt;</span>
              <span className={`px-2.5 py-1 rounded ${currentStep >= 2 ? 'bg-cas-amber text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                2. Escrow Locked
              </span>
              <span className="text-slate-500">&gt;</span>
              <span className={`px-2.5 py-1 rounded ${currentStep >= 3 ? 'bg-cas-amber text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                3. Dispatch (Route Lock)
              </span>
              <span className="text-slate-500">&gt;</span>
              <span className={`px-2.5 py-1 rounded ${currentStep >= 4 ? 'bg-cas-amber text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                4. Geofence Gate
              </span>
              <span className="text-slate-500">&gt;</span>
              <span className={`px-2.5 py-1 rounded ${currentStep === 5 ? 'bg-cas-green text-white' : 'bg-slate-800 text-slate-400'}`}>
                5. Settle
              </span>
            </div>
          </div>

          {/* Grid Layout: Configurator on Left, Live Escrow & Radar Radar on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Order Parameters */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-cas-border">
              <h3 className="text-lg font-bold text-cas-slate mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cas-amberDark" aria-hidden="true" />
                <span>1. Configure Order Parameters</span>
              </h3>

              {/* Depot Selection */}
              <div className="mb-5">
                <label htmlFor="depot-select" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-2">
                  Select Loading Depot (Source)
                </label>
                <select
                  id="depot-select"
                  value={selectedDepot.id}
                  disabled={currentStep > 1}
                  onChange={(e) => {
                    const dep = DEPOT_PRICES.find(d => d.id === e.target.value);
                    if (dep) setSelectedDepot(dep);
                  }}
                  className="w-full bg-white border-2 border-cas-border rounded-lg p-3 text-sm font-semibold text-cas-slate focus:border-cas-amber focus:ring-0 disabled:bg-slate-100 disabled:text-cas-muted"
                >
                  {DEPOT_PRICES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (₦{d.spotPrice}/L) | {d.state}
                    </option>
                  ))}
                </select>
                <div className="flex justify-between text-xs text-cas-muted mt-1.5 px-1">
                  <span>Certified Flash Point: {selectedDepot.flashPoint}</span>
                  <span>Density: {selectedDepot.densitySpec}</span>
                </div>
              </div>

              {/* Volume Selection */}
              <div className="mb-5">
                <label htmlFor="volume-select" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-2">
                  Tanker Capacity / Volume
                </label>
                <select
                  id="volume-select"
                  value={selectedVolume.volume}
                  disabled={currentStep > 1}
                  onChange={(e) => {
                    const vol = TANKER_CAPACITIES.find(v => v.volume === Number(e.target.value));
                    if (vol) setSelectedVolume(vol);
                  }}
                  className="w-full bg-white border-2 border-cas-border rounded-lg p-3 text-sm font-semibold text-cas-slate focus:border-cas-amber focus:ring-0 disabled:bg-slate-100 disabled:text-cas-muted"
                >
                  {TANKER_CAPACITIES.map((v) => (
                    <option key={v.volume} value={v.volume}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-cas-muted mt-1.5 px-1 font-medium">
                  {selectedVolume.recommendedFor}
                </p>
              </div>

              {/* Delivery Destination LGA */}
              <div className="mb-6">
                <label htmlFor="destination-select" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-2">
                  Delivery Destination (Facility Location)
                </label>
                <select
                  id="destination-select"
                  value={selectedDest.id}
                  disabled={currentStep > 1}
                  onChange={(e) => {
                    const dst = DESTINATIONS.find(d => d.id === e.target.value);
                    if (dst) setSelectedDest(dst);
                  }}
                  className="w-full bg-white border-2 border-cas-border rounded-lg p-3 text-sm font-semibold text-cas-slate focus:border-cas-amber focus:ring-0 disabled:bg-slate-100 disabled:text-cas-muted"
                >
                  {DESTINATIONS.map((dst) => (
                    <option key={dst.id} value={dst.id}>
                      {dst.name} (+₦{dst.haulageRatePerLitre}/L Haulage)
                    </option>
                  ))}
                </select>
              </div>

              {/* Financial Calculation Breakdown Card */}
              <div className="bg-white rounded-lg p-5 border-2 border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-cas-muted mb-3">
                  Guaranteed Landed Quotation
                </div>
                
                <div className="space-y-2 text-sm text-cas-slate pb-3 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span>Base Depot Fuel ({selectedVolume.volume.toLocaleString()}L x ₦{selectedDepot.spotPrice})</span>
                    <span className="font-mono font-bold">₦{productCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Regulated Haulage Logistics (+₦{selectedDest.haulageRatePerLitre}/L)</span>
                    <span className="font-mono font-bold">₦{haulageCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-cas-muted text-xs">
                    <span>CAS Escrow Protection Fee (0.00%)</span>
                    <span className="font-mono text-cas-green font-bold">Complimentary</span>
                  </div>
                </div>

                <div className="pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-cas-muted block">TOTAL ESCROW DEPOSIT</span>
                    <span className="text-xs text-cas-amberDark font-bold font-mono">
                      ₦{landedPricePerLitre} per landed litre
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-cas-slate">
                    ₦{totalLandedCost.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Step 1 Action Button */}
              {currentStep === 1 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleDepositEscrow}
                    className="w-full py-4 px-6 bg-cas-amber hover:bg-cas-amberDark text-slate-900 hover:text-white font-extrabold text-base rounded-lg transition-all shadow-md flex items-center justify-center gap-2 border-2 border-cas-amber"
                  >
                    <Lock className="w-5 h-5" aria-hidden="true" />
                    <span>Lock ₦{totalLandedCost.toLocaleString()} Into CAS Escrow</span>
                  </button>
                  <p className="text-xs text-center text-cas-muted mt-2">
                    Funds remain in CAS Escrow. Supplier is notified that payment is guaranteed.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Live Escrow Lifecycle & Geofence Verification */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-cas-slate flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-cas-blue" aria-hidden="true" />
                    <span>2. Real-Time Escrow & Geofenced Route Execution</span>
                  </h3>
                  
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleResetSimulation}
                      className="text-xs text-cas-muted hover:text-cas-slate flex items-center gap-1 font-semibold underline underline-offset-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Reset Demo</span>
                    </button>
                  )}
                </div>

                {/* State Card: Initial / Idle State */}
                {currentStep === 1 && (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-cas-amberLight text-cas-amberDark rounded-full flex items-center justify-center mx-auto mb-4 border border-cas-amber/40">
                      <Lock className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <h4 className="text-lg font-bold text-cas-slate mb-2">Escrow Awaiting Contract Activation</h4>
                    <p className="text-sm text-cas-muted max-w-md mx-auto mb-6">
                      Click the gold button on the left to simulate locking the purchase amount into CAS Escrow.
                      This guarantees funds for the marketer before the truck leaves the loading gantry.
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-cas-slate bg-white px-3 py-2 rounded border border-cas-border">
                      <ShieldCheck className="w-4 h-4 text-cas-green" aria-hidden="true" />
                      <span>No debit occurs until order is confirmed by buyer</span>
                    </div>
                  </div>
                )}

                {/* State Card: Step 2 - Escrow Locked, Tanker Loading */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-cas-green shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <div className="font-bold text-cas-green text-base">Payment Held in CAS Escrow</div>
                          <div className="text-sm text-slate-700 mt-1">
                            <strong>₦{totalLandedCost.toLocaleString()}</strong> is locked in custody. Marketer <strong>Matrix Downstream</strong> has received authorization to load calibrated tanker at {selectedDepot.name}.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-cas-border rounded-xl">
                      <h4 className="text-sm font-bold text-cas-slate uppercase tracking-wider mb-3">
                        Depot Loading & Seal Documentation
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                          <span className="text-cas-muted block">Assigned Driver</span>
                          <span className="font-bold text-cas-slate">Suleiman Tanko</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                          <span className="text-cas-muted block">Tanker Plate</span>
                          <span className="font-bold font-mono text-cas-slate">LSR-492-XA</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                          <span className="text-cas-muted block">Security Seals</span>
                          <span className="font-bold font-mono text-cas-slate">SEAL-8821 / 8822</span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={handleDepartDepot}
                          className="w-full py-3.5 px-5 bg-cas-slate hover:bg-black text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Truck className="w-4 h-4 text-cas-amber" aria-hidden="true" />
                          <span>Simulate Tanker Gantry Exit (Activate Route Lock)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* State Card: Step 3 - In Transit with Non-Cancellable Route Lock */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    {/* Important Supplier Protection Banner */}
                    <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-cas-amberDark shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <div className="font-bold text-cas-amberDark text-sm">
                            Supplier Protection Active: Route Locked (Non-Cancellable)
                          </div>
                          <div className="text-xs text-slate-700 mt-1">
                            Because the loaded fuel tanker has departed {selectedDepot.name}, cancellation is blocked to protect the marketer. The buyer cannot recall escrow funds while product is on the road.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Geofence Radar Box */}
                    <div className="p-5 bg-white border-2 border-cas-border rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-cas-blue" aria-hidden="true" />
                          <span className="font-bold text-cas-slate text-sm">Live GPS Geofence Radar</span>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-1 bg-cas-blueLight text-cas-blue rounded">
                          Truck Distance: {distanceKm} km away
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
                        <div className="bg-cas-blue h-3 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                      </div>

                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" aria-hidden="true" />
                        <div>
                          <strong>Discharge Verification Inactive:</strong> The button to verify receipt and release funds is disabled because the truck is outside your 100-meter facility geofence. Nobody can compel you to sign off early.
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={handleSimulateGateArrival}
                          className="w-full py-3.5 px-5 bg-cas-amber hover:bg-cas-amberDark text-slate-900 hover:text-white font-extrabold text-sm rounded-lg transition-all flex items-center justify-center gap-2 border-2 border-cas-amber"
                        >
                          <MapPin className="w-4 h-4" aria-hidden="true" />
                          <span>Simulate Truck Crossing Facility Gate (Inside 100m Perimeter)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* State Card: Step 4 - Inside Geofence (Discharge Unlocked) */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Unlock className="w-6 h-6 text-cas-green shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <div className="font-bold text-cas-green text-base">
                            Geofence Cleared: Tanker Inside Facility Perimeter ({distanceKm * 1000}m from inlet)
                          </div>
                          <div className="text-xs text-slate-700 mt-1">
                            Driver Suleiman Tanko is at your discharge gate. Seals verified intact. You can now perform your hydrometer density dip test and confirm the meter reading.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-white border-2 border-cas-slate rounded-xl">
                      <h4 className="text-sm font-bold text-cas-slate mb-3 uppercase tracking-wider">
                        Receiving Inspection Checklist
                      </h4>
                      <div className="space-y-2 mb-5 text-xs text-cas-slate">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-cas-green rounded" />
                          <span>Security seals matched against waybill: SEAL-8821 / 8822</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-cas-green rounded" />
                          <span>Discharge temperature and density verified within NMDPRA spec (0.840 kg/L)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-cas-green rounded" />
                          <span>Discharged volume confirmed: {selectedVolume.volume.toLocaleString()} Litres</span>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmDischarge}
                        className="w-full py-4 px-6 bg-cas-green hover:bg-emerald-700 text-white font-extrabold text-base rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                        <span>Confirm Receipt & Release ₦{totalLandedCost.toLocaleString()} to Supplier</span>
                      </button>
                      <p className="text-xs text-center text-cas-muted mt-2">
                        Clicking this transfers payment directly from CAS Escrow to the marketer.
                      </p>
                    </div>
                  </div>
                )}

                {/* State Card: Step 5 - Settle & Finished */}
                {currentStep === 5 && (
                  <div className="p-8 text-center bg-emerald-50 rounded-xl border-2 border-emerald-400">
                    <div className="w-16 h-16 bg-emerald-100 text-cas-green rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                      <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <h4 className="text-xl font-extrabold text-cas-slate mb-2">Transaction Completed & Settled</h4>
                    <p className="text-sm text-slate-700 max-w-md mx-auto mb-6">
                      ₦{totalLandedCost.toLocaleString()} has been released to Matrix Downstream. 
                      Digital certificate of delivery, NMDPRA waybill, and VAT invoice generated.
                    </p>

                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-xs text-left mb-6">
                      <div className="p-3 bg-white rounded border border-emerald-200">
                        <span className="text-slate-500 block">Settlement Duration</span>
                        <span className="font-bold text-slate-800">Instant (Within 60 secs)</span>
                      </div>
                      <div className="p-3 bg-white rounded border border-emerald-200">
                        <span className="text-slate-500 block">Waybill Audit Key</span>
                        <span className="font-mono font-bold text-slate-800">WB-LAG-9042-OK</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetSimulation}
                      className="px-6 py-3 bg-cas-slate hover:bg-black text-white font-bold text-sm rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                      <span>Run Another Simulation</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Escrow Policy Assurance Note */}
              <div className="mt-8 pt-4 border-t border-cas-border flex flex-col sm:flex-row items-center justify-between text-xs text-cas-muted gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-cas-green" aria-hidden="true" />
                  <span>Licensed Trustee: FCMB Trustees / Stanbic Nominees Escrow Account</span>
                </span>
                <span>Audit trail stored permanently under NDPR compliance</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
