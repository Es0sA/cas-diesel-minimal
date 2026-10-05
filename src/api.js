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
    dispute: (id, data) => request(`/orders/${id}/dispute`, { method: 'POST', body: JSON.stringify(data) }),
  },
  admin: {
    getStats: () => request('/admin/stats'),
    getUsers: () => request('/admin/users'),
    getDisputes: () => request('/admin/disputes'),
    verifyUser: (id, isVerified) => request(`/admin/users/${id}/verify`, { method: 'PUT', body: JSON.stringify({ isVerified }) }),
    resolveDispute: (id, resolution) => request(`/admin/disputes/${id}/resolve`, { method: 'POST', body: JSON.stringify({ resolution }) }),
  },
  chat: {
    getMessages: (orderId, cursor) => request(`/chat/${orderId}${cursor ? `?cursor=${cursor}` : ''}`),
    sendMessage: (orderId, data) => request(`/chat/${orderId}/send`, { method: 'POST', body: JSON.stringify(data) }),
  },
  telemetry: {
    ping: (orderId, data) => request(`/telemetry/ping/${orderId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  compliance: {
    upload: (orderId, data) => request(`/compliance/upload/${orderId}`, { method: 'POST', body: JSON.stringify(data) }),
    getDocuments: (orderId) => request(`/compliance/${orderId}`),
  },
};
