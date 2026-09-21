import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Truck, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Lock, 
  Plus, 
  AlertCircle, 
  Link as LinkIcon, 
  Copy, 
  KeyRound 
} from 'lucide-react';
import { api } from '../api';

export default function SupplierPortal() {
  const [dailySpotPrice, setDailySpotPrice] = useState(1175);
  const [availableLitres, setAvailableLitres] = useState(450000);
  const [minOrderVolume, setMinOrderVolume] = useState(11000);
  const [saveAlert, setSaveAlert] = useState(false);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (localStorage.getItem('cas_token')) {
          const data = await api.orders.list();
          setOrders(data.orders.map(ord => ({
            id: ord.id,
            buyerCompany: ord.buyer?.companyName || 'Unknown Buyer',
            volume: ord.volumeLiters,
            totalEscrowSum: ord.totalEscrowAmount,
            assignedDriver: ord.driver ? `${ord.driver.firstName} ${ord.driver.lastName}` : 'Unassigned',
            tankerPlate: ord.driver?.truckPlateNumber || 'Pending Allocation',
            status: ord.status,
            escrowState: 'Guaranteed by CAS',
            destination: `${ord.targetLatitude}, ${ord.targetLongitude}`
          })));
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };
    fetchOrders();
  }, []);

  const [selectedDriverForOrder, setSelectedDriverForOrder] = useState('Emeka Okonkwo (KJA-112-XC)');

  const handleUpdatePricing = (e) => {
    e.preventDefault();
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 4000);
  };

  const handleAssignDriver = (orderId) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          assignedDriver: selectedDriverForOrder.split(' (')[0],
          tankerPlate: selectedDriverForOrder.split('(')[1].replace(')', ''),
          status: 'Dispatched from Depot Gantry'
        };
      }
      return o;
    }));
  };


  return (
    <section id="supplier-desk" className="bg-cas-canvas py-12 md:py-20 border-b border-cas-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cas-greenLight text-cas-green text-xs font-bold uppercase tracking-wider mb-3">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Downstream Marketer Operations Desk</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-cas-slate tracking-tight">
            Matrix Downstream Operations Desk
          </h2>
          <p className="text-base text-cas-muted mt-2">
            Set your daily spot price per litre and review confirmed escrow allocations.
          </p>
        </div>

        {saveAlert && (
          <div className="p-4 mb-6 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-900 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cas-green shrink-0" aria-hidden="true" />
            <span>Market rates successfully broadcast to CAS Energy Marketplace.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Daily Price & Stock Management */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border-2 border-cas-border shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="font-extrabold text-base text-cas-slate">Daily Spot Management</h3>
                <span className="text-xs text-cas-muted">Depot: Ijegun Egba Cluster</span>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-cas-green px-2 py-1 rounded border border-emerald-200">
                NMDPRA Active
              </span>
            </div>

            <form onSubmit={handleUpdatePricing} className="space-y-5">
              <div>
                <label htmlFor="spot-price" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Your Spot Price Per Litre (Ex-Depot)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-cas-slate font-bold font-mono">₦</span>
                  <input
                    id="spot-price"
                    type="number"
                    min="1000"
                    max="2000"
                    value={dailySpotPrice}
                    onChange={(e) => setDailySpotPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-lg font-bold font-mono text-cas-slate focus:border-cas-amber"
                  />
                </div>
                <span className="text-xs text-cas-muted mt-1 block">
                  Today's competitive benchmark: ₦1,175 to ₦1,185/L
                </span>
              </div>

              <div>
                <label htmlFor="stock-vol" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Available Gantry Volume (Litres)
                </label>
                <input
                  id="stock-vol"
                  type="number"
                  step="10000"
                  value={availableLitres}
                  onChange={(e) => setAvailableLitres(Number(e.target.value))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg font-mono font-bold text-sm text-cas-slate focus:border-cas-amber"
                />
              </div>

              <div>
                <label htmlFor="moq" className="block text-xs font-bold uppercase tracking-wider text-cas-slate mb-1.5">
                  Minimum Order Quantity (MOQ)
                </label>
                <select
                  id="moq"
                  value={minOrderVolume}
                  onChange={(e) => setMinOrderVolume(Number(e.target.value))}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg font-bold text-sm text-cas-slate focus:border-cas-amber"
                >
                  <option value="11000">11,000 Litres (Bobtail)</option>
                  <option value="22000">22,000 Litres (Medium Tanker)</option>
                  <option value="33000">33,000 Litres (Standard Semi)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-cas-slate hover:bg-black text-white font-extrabold text-sm rounded-lg transition-all shadow border-2 border-transparent hover:border-cas-amber"
                >
                  Publish Updated Rates to Marketplace
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 text-xs text-cas-muted space-y-2">
              <div className="flex justify-between">
                <span>Total Escrow In Settlement:</span>
                <strong className="font-mono text-cas-slate">₦66,759,000</strong>
              </div>
              <div className="flex justify-between">
                <span>Settlement Custodian:</span>
                <span className="font-bold text-cas-slate">Stanbic Nominees Custodial Account</span>
              </div>
            </div>
          </div>

          {/* Column 2: Order Queue & Driver Management */}
          <div className="lg:col-span-8 space-y-6">
            


            {/* Confirmed Escrow Orders */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-cas-border shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <h3 className="font-extrabold text-lg text-cas-slate">Confirmed Inbound Escrow Orders</h3>
                  <span className="text-xs text-cas-muted">Funds guaranteed in CAS Escrow prior to dispatch</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-cas-amberLight text-cas-amberDark rounded-full border border-cas-amber/50">
                  {orders.length} Active Orders
                </span>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-cas-amberDark">{ord.id}</span>
                        <h4 className="font-extrabold text-base text-cas-slate">{ord.buyerCompany}</h4>
                        <span className="text-xs text-cas-muted">Destination: {ord.destination}</span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs font-bold text-cas-muted block">Escrow Capital Locked</span>
                        <span className="text-xl font-extrabold font-mono text-cas-green">
                          ₦{ord.totalEscrowSum.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 block">({ord.volume.toLocaleString()} Litres)</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-cas-muted block">Current Status:</span>
                        <span className="font-bold text-cas-slate flex items-center gap-1.5 mt-0.5">
                          <Lock className="w-3.5 h-3.5 text-cas-amberDark" aria-hidden="true" />
                          <span>{ord.status}</span>
                        </span>
                      </div>

                      {ord.assignedDriver === 'Unassigned' ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedDriverForOrder}
                            onChange={(e) => setSelectedDriverForOrder(e.target.value)}
                            className="p-2 bg-white border border-slate-300 rounded font-semibold text-xs text-cas-slate"
                            aria-label="Select registered driver"
                          >
                            <option value="Emeka Okonkwo (KJA-112-XC)">Emeka Okonkwo (KJA-112-XC) - 33,000L</option>
                            <option value="Murtala Bello (KTU-884-YD)">Murtala Bello (KTU-884-YD) - 22,000L</option>
                            <option value="Tunde Fashanu (APP-029-ZA)">Tunde Fashanu (APP-029-ZA) - 45,000L</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAssignDriver(ord.id)}
                            className="px-4 py-2 bg-cas-slate hover:bg-black text-white font-bold rounded text-xs transition-colors shrink-0"
                          >
                            Assign & Dispatch
                          </button>
                        </div>
                      ) : (
                        <div className="text-left sm:text-right">
                          <span className="text-cas-muted block">Dispatched Tanker Driver:</span>
                          <span className="font-bold text-cas-slate">
                            {ord.assignedDriver} ({ord.tankerPlate})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
