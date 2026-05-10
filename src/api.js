const BASE = import.meta.env.VITE_API_URL + '/api';

function getToken() {
  return localStorage.getItem('ramba_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  resendOtp: (body) => request('/auth/resend-otp', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Health logs
  getLogs: () => request('/health/logs'),
  addLog: (body) => request('/health/logs', { method: 'POST', body: JSON.stringify(body) }),
  deleteLog: (id) => request(`/health/logs/${id}`, { method: 'DELETE' }),

  // Wellbeing / emotions
  getEmotions: () => request('/emotions').then(d => ({ emotions: d.checkIns })),
  addEmotion: (body) => request('/emotions', { method: 'POST', body: JSON.stringify(body) }).then(d => ({ emotion: d.checkIn })),

  // Invites
  sendInvite: (body) => request('/invites/send', { method: 'POST', body: JSON.stringify(body) }),
  redeemInvite: (body) => request('/invites/redeem', { method: 'POST', body: JSON.stringify(body) }),
  revokeInvite: (code) => request(`/invites/${code}`, { method: 'DELETE' }),
  getMyInvites: () => request('/invites/mine'),
  getMyPatients: () => request('/invites/patients'),

  // Consent
  getConsent: (patientId) => request(patientId ? `/consent/${patientId}` : '/consent'),
  updateConsent: (body) => request('/consent', { method: 'PATCH', body: JSON.stringify(body) }),

  // Community
  listCommunities: () => request('/community'),
  joinCommunity: (id) => request(`/community/${id}/join`, { method: 'POST' }),
  leaveCommunity: (id) => request(`/community/${id}/leave`, { method: 'DELETE' }),
  getPosts: (id) => request(`/community/${id}/posts`),
  createPost: (id, body) => request(`/community/${id}/posts`, { method: 'POST', body: JSON.stringify(body) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),

  // Content / Education
  getContent: (conditionId) => request(`/content${conditionId ? `?conditionId=${conditionId}` : ''}`),

  // Reminders
  getReminders: () => request('/reminders'),
  createReminder: (body) => request('/reminders', { method: 'POST', body: JSON.stringify(body) }),
  toggleReminder: (id) => request(`/reminders/${id}/toggle`, { method: 'PATCH' }),
  deleteReminder: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),

  // Conditions
  getConditions: () => request('/conditions'),
  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  getAdminReports: () => request('/admin/reports'),
};
