const API_URL = import.meta.env.VITE_API_URL || 'https://api.casdiesel.com/api';

export const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // P1: Send cookies automatically (HttpOnly JWT cookie) instead of reading from localStorage
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (cause) {
    // fetch only rejects when the request never got an answer (offline, DNS, CORS, server down)
    if (cause instanceof TypeError) {
      const err = new Error('Network error: Please check your internet connection or try again later.');
      err.isNetworkError = true;
      throw err;
    }
    throw cause;
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { error: text || 'An unexpected error occurred.' };
  }

  if (!response.ok) {
    const err = new Error(data.error || 'API request failed');
    err.data = data;
    err.status = response.status;
    throw err;
  }

  return data;
};

export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
    resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
    verifyEmail: (data) => request('/auth/verify-email', { method: 'POST', body: JSON.stringify(data) }),
    resendCode: (data) => request('/auth/resend-code', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/auth/me'),
    deleteCheck: () => request('/auth/me/delete-check'),
    sendDeleteCode: () => request('/auth/me/delete-code', { method: 'POST' }),
    deleteAccount: (code) => request('/auth/me', { method: 'DELETE', body: JSON.stringify({ code }) }),
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
  },
  drivers: {
    list: () => request('/drivers'),
    getProfile: () => request('/drivers/profile'),
    updateProfile: (data) => request('/drivers/profile', { method: 'POST', body: JSON.stringify(data) }),
    editProfile: (data) => request('/drivers/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  orders: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/orders/${id}`),
    create: (data) => request('/orders/create', { method: 'POST', body: JSON.stringify(data) }),
    dispatch: (id, data) => request(`/orders/${id}/dispatch`, { method: 'POST', body: JSON.stringify(data) }),
    cancel: (id, data) => request(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify(data) }),
    checklist: (id) => request(`/orders/${id}/checklist`),
    ledger: (id) => request(`/orders/${id}/ledger`),
    verification: (id) => request(`/orders/${id}/verification`),
    verify: (id, data) => request(`/orders/${id}/verification`, { method: 'POST', body: JSON.stringify(data) }),
    acceptVerification: (id) => request(`/orders/${id}/verification/accept`, { method: 'POST' }),
    proposeSplit: (id, releaseAmount, note) => request(`/orders/${id}/dispute/propose`, { method: 'POST', body: JSON.stringify({ releaseAmount, note }) }),
    acceptSplit: (id, releaseAmount) => request(`/orders/${id}/dispute/accept-proposal`, { method: 'POST', body: JSON.stringify({ releaseAmount }) }),
    contestVerification: (id, reason) => request(`/orders/${id}/verification/dispute`, { method: 'POST', body: JSON.stringify({ reason }) }),
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
    resolveDispute: (id, resolution, releaseAmount) => request(`/admin/disputes/${id}/resolve`, { method: 'POST', body: JSON.stringify({ resolution, releaseAmount }) }),
    runSweep: () => request('/admin/sweep', { method: 'POST' }),
  },
  rfqs: {
    list: () => request('/rfqs'),
    get: (id) => request(`/rfqs/${id}`),
    create: (data) => request('/rfqs', { method: 'POST', body: JSON.stringify(data) }),
    cancel: (id) => request(`/rfqs/${id}/cancel`, { method: 'POST' }),
    accept: (id, quoteId, acceptDeviations) => request(`/rfqs/${id}/accept`, { method: 'POST', body: JSON.stringify({ quoteId, acceptDeviations }) }),
    quote: (id, data) => request(`/rfqs/${id}/quotes`, { method: 'POST', body: JSON.stringify(data) }),
    myQuotes: () => request('/rfqs/quotes/mine/all'),
    samples: (id) => request(`/rfqs/${id}/samples`),
    uploadSample: async (id, file) => {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_URL}/rfqs/${id}/samples`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data;
    },
    uploadCertificate: async (file) => {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_URL}/rfqs/upload-certificate`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data;
    },
    downloadCertificate: async (rfqId, certId, fileName) => {
      const response = await fetch(`${API_URL}/rfqs/${rfqId}/certificates/${certId}`, { credentials: 'include' });
      if (!response.ok) {
        let message = 'Could not download the certificate.';
        try { message = (await response.json()).error || message; } catch { /* non-JSON error body */ }
        throw new Error(message);
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `certificate-${certId.slice(0, 8)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    },
    confirmQuote: (quoteId, data = {}) => request(`/rfqs/quotes/${quoteId}/confirm`, { method: 'POST', body: JSON.stringify(data) }),
  },
  depots: {
    prices: () => request('/depots/prices'),
    setPrice: (data) => request('/depots/prices', { method: 'PUT', body: JSON.stringify(data) }),
  },
  commission: {
    tiers: () => request('/commission/tiers'),
    saveTiers: (tiers) => request('/commission/tiers', { method: 'PUT', body: JSON.stringify({ tiers }) }),
  },
  standingRates: {
    list: () => request('/standing-rates'),
    create: (data) => request('/standing-rates', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id) => request(`/standing-rates/${id}`, { method: 'DELETE' }),
  },
  chat: {
    getMessages: (orderId, after) => request(`/chat/${orderId}${after ? `?after=${encodeURIComponent(after)}` : ''}`),
    sendMessage: (orderId, data) => request(`/chat/${orderId}/send`, { method: 'POST', body: JSON.stringify(data) }),
  },
  telemetry: {
    ping: (orderId, data) => request(`/telemetry/ping/${orderId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  kyc: {
    mine: () => request('/kyc/mine'),
    status: () => request('/kyc/status'),
    upload: async (documentType, file, expiresAt) => {
      const form = new FormData();
      form.append('documentType', documentType);
      if (expiresAt) form.append('expiresAt', expiresAt);
      form.append('file', file);
      const res = await fetch(`${API_URL}/kyc/upload`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data;
    },
  },
  compliance: {
    getDocuments: (orderId) => request(`/compliance/${orderId}`),
    uploadFile: async (orderId, documentType, file) => {
      const form = new FormData();
      form.append('documentType', documentType);
      form.append('file', file);
      const res = await fetch(`${API_URL}/compliance/upload-file/${orderId}`, { method: 'POST', body: form, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data;
    },
    documentUrl: (orderId, docId) => request(`/compliance/${orderId}/${docId}/url`),
  },
};
