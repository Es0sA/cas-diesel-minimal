const API_URL = import.meta.env.VITE_API_URL || 'https://cas-diesel-backend.onrender.com/api';

export const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // P1: Send cookies automatically (HttpOnly JWT cookie) instead of reading from localStorage
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me'),
  },
  companies: {
    getProfile: () => request('/companies/profile'),
    updateProfile: (data) => request('/companies/profile', { method: 'POST', body: JSON.stringify(data) }),
    listSuppliers: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/companies/suppliers${query ? `?${query}` : ''}`);
    },
    editProfile: (data) => request('/companies/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  reviews: {
    create: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    forSupplier: (companyId) => request(`/reviews/supplier/${companyId}`),
  },
  drivers: {
    list: () => request('/drivers'),
    updateProfile: (data) => request('/drivers/profile', { method: 'POST', body: JSON.stringify(data) }),
    editProfile: (data) => request('/drivers/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  orders: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ''}`);
    },
    create: (data) => request('/orders/create', { method: 'POST', body: JSON.stringify(data) }),
    fundWebhook: (id, data) => request(`/orders/${id}/fund-webhook`, { method: 'POST', body: JSON.stringify(data) }),
    dispatch: (id, data) => request(`/orders/${id}/dispatch`, { method: 'POST', body: JSON.stringify(data) }),
    cancel: (id, data) => request(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify(data) }),
    confirmDelivery: (id) => request(`/orders/${id}/confirm-delivery`, { method: 'POST' }),
    downloadWaybill: async (id) => {
      const response = await fetch(`${API_URL}/orders/${id}/waybill`, { credentials: 'include' });
      if (!response.ok) {
        let message = 'Could not download the waybill.';
        try { message = (await response.json()).error || message; } catch { /* non-JSON error body */ }
        throw new Error(message);
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = `waybill-${id.slice(0, 8)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    },
    dispute: (id, data) => request(`/orders/${id}/dispute`, { method: 'POST', body: JSON.stringify(data) }),
  },
  admin: {
    getStats: () => request('/admin/stats'),
    getUsers: () => request('/admin/users'),
    getDisputes: () => request('/admin/disputes'),
    getOrders: (params = {}) => request(`/admin/orders?${new URLSearchParams(params)}`),
    exportOrdersCsv: async (params = {}) => {
      const response = await fetch(`${API_URL}/admin/orders/export?${new URLSearchParams(params)}`, { credentials: 'include' });
      if (!response.ok) {
        let message = 'Could not export orders.';
        try { message = (await response.json()).error || message; } catch { /* non-JSON error body */ }
        throw new Error(message);
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = 'orders.csv';
      link.click();
      URL.revokeObjectURL(url);
    },
    reviewKycDoc: (docId, status, reason) => request(`/admin/kyc/${docId}/review`, { method: 'PUT', body: JSON.stringify({ status, reason }) }),
    getKycUrl: (docId) => request(`/admin/kyc/${docId}/url`),
    verifyUser: (id, isVerified) => request(`/admin/users/${id}/verify`, { method: 'PUT', body: JSON.stringify({ isVerified }) }),
    resolveDispute: (id, resolution) => request(`/admin/disputes/${id}/resolve`, { method: 'POST', body: JSON.stringify({ resolution }) }),
  },
  chat: {
    getMessages: (orderId, after) => request(`/chat/${orderId}${after ? `?after=${encodeURIComponent(after)}` : ''}`),
    unread: () => request('/chat/unread/summary'),
    sendMessage: (orderId, data) => request(`/chat/${orderId}/send`, { method: 'POST', body: JSON.stringify(data) }),
  },
  telemetry: {
    ping: (orderId, data) => request(`/telemetry/ping/${orderId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  kyc: {
    mine: () => request('/kyc/mine'),
    status: () => request('/kyc/status'),
    upload: async (documentType, file) => {
      const form = new FormData();
      form.append('documentType', documentType);
      form.append('file', file);
      const res = await fetch(`${API_URL}/kyc/upload`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data;
    },
  },
  compliance: {
    upload: (orderId, data) => request(`/compliance/upload/${orderId}`, { method: 'POST', body: JSON.stringify(data) }),
    getDocuments: (orderId) => request(`/compliance/${orderId}`),
  },
};
