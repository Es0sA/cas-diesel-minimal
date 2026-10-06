import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  BarChart, Users, AlertTriangle, ShieldCheck, 
  CheckCircle, XCircle, ArrowRight, X 
} from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [disputesList, setDisputesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [checks, setChecks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'overview') {
          const res = await api.admin.getStats();
          setStats(res);
        } else if (activeTab === 'users') {
          const res = await api.admin.getUsers();
          setUsersList(res);
        } else if (activeTab === 'disputes') {
          const res = await api.admin.getDisputes();
          setDisputesList(res.orders || []);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [activeTab, user]);

  const openDoc = async (docId) => {
    try {
      const { url } = await api.admin.getKycUrl(docId);
      window.open(url, '_blank', 'noopener');
    } catch (err) {
      alert('Could not open document');
    }
  };

  const openReview = (u) => {
    setChecks({});
    setReviewing(u);
  };

  const handleVerify = async (userId, currentState) => {
    try {
      setSaving(true);
      await api.admin.verifyUser(userId, !currentState);
      const res = await api.admin.getUsers();
      setUsersList(res);
      setReviewing(null);
    } catch (err) {
      alert('Failed to update verification');
    } finally {
      setSaving(false);
    }
  };

  const handleResolve = async (orderId, resolution) => {
    try {
      await api.admin.resolveDispute(orderId, resolution);
      const res = await api.admin.getDisputes();
      setDisputesList(res.orders || []);
    } catch (err) {
      alert('Failed to resolve dispute');
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="p-10 text-center font-bold text-red-500">Access Denied. Admin only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-cas-amber" />
        <h1 className="text-2xl font-extrabold text-cas-slate">CAS Admin Operations Console</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-4 border-b border-slate-200 mb-8">
        {[
          { id: 'overview', label: 'System Overview', short: 'Overview', icon: BarChart },
          { id: 'users', label: 'User Verification', short: 'Users', icon: Users },
          { id: 'disputes', label: 'Dispute Resolution', short: 'Disputes', icon: AlertTriangle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-cas-amber text-cas-slate' 
                : 'border-transparent text-cas-muted hover:text-cas-slate hover:border-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" aria-hidden="true" />
            <span className="sm:hidden">{tab.short}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-cas-muted font-bold text-sm">Loading data...</div>
      ) : (
        <div>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-[repeat(3,minmax(0,1fr))] gap-6">
              <div className="bg-white p-5 lg:p-6 min-w-0 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-cas-muted text-sm font-bold uppercase tracking-wider mb-2">Total Users</div>
                <div className="text-3xl lg:text-4xl break-words font-extrabold text-cas-slate">{stats.totalUsers}</div>
              </div>
              <div className="bg-white p-5 lg:p-6 min-w-0 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-cas-muted text-sm font-bold uppercase tracking-wider mb-2">Total Orders</div>
                <div className="text-3xl lg:text-4xl break-words font-extrabold text-cas-slate">{stats.totalOrders}</div>
              </div>
              <div className="bg-white p-5 lg:p-6 min-w-0 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-cas-muted text-sm font-bold uppercase tracking-wider mb-2">Total Escrow Volume</div>
                <div className="text-3xl lg:text-4xl break-words font-extrabold text-cas-green">
                  ₦{(stats.totalEscrowVolume).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-bold text-cas-muted uppercase">User Email</th>
                    <th className="p-4 text-xs font-bold text-cas-muted uppercase">Role</th>
                    <th className="p-4 text-xs font-bold text-cas-muted uppercase">Entity Name</th>
                    <th className="p-4 text-xs font-bold text-cas-muted uppercase text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map(u => {
                    const isVerified = u.companies?.[0]?.isVerified || u.driverProfile?.isVerified || false;
                    const entityName = u.companies?.[0]?.companyName || (u.driverProfile ? `${u.driverProfile.firstName} ${u.driverProfile.lastName}` : 'N/A');
                    
                    return (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-4 text-sm font-medium text-slate-800">{u.email}</td>
                        <td className="p-4 text-sm font-bold text-cas-slate">{u.role}</td>
                        <td className="p-4 text-sm text-slate-600">{entityName}</td>
                        <td className="p-4 text-right">
                          {u.role === 'ADMIN' || u.role === 'BUYER' ? (
                            <span className="text-xs text-cas-muted">N/A</span>
                          ) : (
                            <button
                              onClick={() => openReview(u)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 inline-flex ${
                                isVerified 
                                  ? 'bg-emerald-50 text-cas-green border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-cas-amberDark border border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              {isVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {isVerified ? 'Verified' : 'Review'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* DISPUTES TAB */}
          {activeTab === 'disputes' && (
            <div className="space-y-4">
              {disputesList.length === 0 ? (
                <div className="p-8 text-center text-cas-muted text-sm font-bold bg-white rounded-2xl border border-slate-200">
                  No active disputes.
                </div>
              ) : (
                disputesList.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-rose-100 text-rose-700 text-xs font-extrabold uppercase px-2 py-1 rounded">Disputed Order</span>
                        <span className="text-xs font-bold text-cas-muted">Order #{order.id}</span>
                      </div>
                      <div className="font-extrabold text-lg text-cas-slate mb-1">
                        {order.volumeLiters.toLocaleString()}L AGO
                      </div>
                      <div className="text-sm text-cas-muted space-y-1">
                        <div><strong>Buyer:</strong> {order.buyer?.companyName || `User ${order.buyerId}`}</div>
                        <div><strong>Supplier:</strong> {order.supplier?.companyName || `User ${order.supplierId}`}</div>
                        {order.disputeReason && <div><strong>Reason:</strong> {order.disputeReason}</div>}
                        <div className="text-cas-green font-bold">Escrow: ₦{(order.totalEscrowAmount || 0).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <button 
                        onClick={() => handleResolve(order.id, 'REFUND_BUYER')}
                        className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-sm rounded-lg border border-rose-200 transition-colors"
                      >
                        Refund Buyer (Cancel)
                      </button>
                      <button 
                        onClick={() => handleResolve(order.id, 'RELEASE_TO_SUPPLIER')}
                        className="px-4 py-2 bg-emerald-50 text-cas-green hover:bg-emerald-100 font-bold text-sm rounded-lg border border-emerald-200 transition-colors"
                      >
                        Release to Supplier (Delivered)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
          {reviewing && (() => {
        const u = reviewing;
        const c = u.companies?.[0];
        const d = u.driverProfile;
        const isVerified = c?.isVerified || d?.isVerified || false;
        const rows = c ? [
          ['Company name', c.companyName],
          ['CAC registration no.', c.registrationNumber],
          ['Business address', c.businessAddress],
          ['Contact phone', c.contactPhone],
          ['Login email', u.email],
          ['Signed up', new Date(u.createdAt).toLocaleDateString()]
        ] : [
          ['Name', d ? `${d.firstName} ${d.lastName}` : null],
          ['Licence number', d?.licenseNumber],
          ['Truck plate', d?.truckPlateNumber],
          ['Truck capacity (L)', d?.truckCapacityLiters],
          ['Login email', u.email],
          ['Signed up', new Date(u.createdAt).toLocaleDateString()]
        ];
        const items = c
          ? ['CAC number matches the registered company name on the CAC public search', 'NMDPRA depot or marketer licence confirmed with the issuer', 'Phone number called and the business confirmed', 'Address checked and matches the registration']
          : ['Driving licence checked against the FRSC record', 'Truck plate matches the registered vehicle', 'Phone number called and identity confirmed'];
        const docs = u.kycDocuments || [];
        const docLabels = { CAC_CERT: 'CAC certificate', NMDPRA_LICENCE: 'NMDPRA licence', DRIVER_LICENCE: 'Driver licence' };
        const required = c ? ['CAC_CERT', 'NMDPRA_LICENCE'] : ['DRIVER_LICENCE'];
        const missing = required.filter((t) => !docs.some((d) => d.documentType === t));
        const allChecked = items.every((_, i) => checks[i]);
        return (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-cas-slate">{isVerified ? 'Verified account' : 'Review submitted details'}</h2>
                  <p className="text-xs text-cas-muted">{u.role}</p>
                </div>
                <button onClick={() => setReviewing(null)} aria-label="Close" className="p-1 text-cas-muted hover:text-cas-slate"><X className="w-5 h-5" /></button>
              </div>
              <dl className="divide-y divide-slate-100 border border-slate-200 rounded-xl mb-4">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 p-3 text-sm">
                    <dt className="text-cas-muted font-bold">{k}</dt>
                    <dd className={`text-right break-words ${v ? 'text-slate-800' : 'text-rose-600 font-bold'}`}>{v || 'Not provided'}</dd>
                  </div>
                ))}
              </dl>
              <div className="mb-4">
                <div className="text-xs font-bold text-cas-muted uppercase mb-2">Uploaded documents</div>
                {docs.length === 0 && <div className="text-sm font-bold text-rose-600">No documents uploaded</div>}
                {docs.map((d) => (
                  <button key={d.id} onClick={() => openDoc(d.id)} className="block text-sm font-bold text-cas-green underline mb-1 text-left">
                    View {docLabels[d.documentType] || d.documentType} ({d.fileName})
                  </button>
                ))}
                {missing.length > 0 && <div className="text-xs font-bold text-rose-600 mt-1">Missing: {missing.map((t) => docLabels[t]).join(', ')}</div>}
              </div>
              {c?.registrationNumber && (
                <a href="https://search.cac.gov.ng/home" target="_blank" rel="noreferrer" className="text-xs font-bold text-cas-green underline block mb-4">Open CAC public search</a>
              )}
              {!isVerified && (
                <div className="space-y-2 mb-5">
                  <div className="text-xs font-bold text-cas-muted uppercase">Confirm you have checked</div>
                  {items.map((t, i) => (
                    <label key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <input type="checkbox" className="mt-1" checked={!!checks[i]} onChange={e => setChecks({ ...checks, [i]: e.target.checked })} />
                      {t}
                    </label>
                  ))}
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button onClick={() => setReviewing(null)} className="px-4 py-2 rounded-full text-sm font-bold border border-slate-200 text-slate-700">Cancel</button>
                {isVerified ? (
                  <button disabled={saving} onClick={() => handleVerify(u.id, true)} className="px-4 py-2 rounded-full text-sm font-bold bg-rose-600 text-white disabled:opacity-50">Revoke verification</button>
                ) : (
                  <button disabled={!allChecked || missing.length > 0 || saving} onClick={() => handleVerify(u.id, false)} className="px-4 py-2 rounded-full text-sm font-bold bg-cas-green text-white disabled:opacity-40">Approve and verify</button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
</div>
  );
}
