import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  BarChart, Users, AlertTriangle, ShieldCheck, 
  CheckCircle, XCircle, ArrowRight 
} from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [disputesList, setDisputesList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleVerify = async (userId, currentState) => {
    try {
      await api.admin.verifyUser(userId, !currentState);
      const res = await api.admin.getUsers();
      setUsersList(res);
    } catch (err) {
      alert('Failed to update verification');
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
      <div className="flex gap-4 border-b border-slate-200 mb-8">
        {[
          { id: 'overview', label: 'System Overview', icon: BarChart },
          { id: 'users', label: 'User Verification', icon: Users },
          { id: 'disputes', label: 'Dispute Resolution', icon: AlertTriangle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-cas-amber text-cas-slate' 
                : 'border-transparent text-cas-muted hover:text-cas-slate hover:border-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-cas-muted font-bold text-sm">Loading data...</div>
      ) : (
        <div>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-cas-muted text-sm font-bold uppercase tracking-wider mb-2">Total Users</div>
                <div className="text-4xl font-extrabold text-cas-slate">{stats.totalUsers}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-cas-muted text-sm font-bold uppercase tracking-wider mb-2">Total Orders</div>
                <div className="text-4xl font-extrabold text-cas-slate">{stats.totalOrders}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-cas-muted text-sm font-bold uppercase tracking-wider mb-2">Total Escrow Volume</div>
                <div className="text-4xl font-extrabold text-cas-green">
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
                              onClick={() => handleVerify(u.id, isVerified)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 inline-flex ${
                                isVerified 
                                  ? 'bg-emerald-50 text-cas-green border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-cas-amberDark border border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              {isVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {isVerified ? 'Verified' : 'Unverified'}
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
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase px-2 py-1 rounded">Disputed Order</span>
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
    </div>
  );
}
