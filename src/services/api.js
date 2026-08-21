import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('oui_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// global error handler
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('oui_token')
      localStorage.removeItem('oui_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── auth ──
export const authAPI = {
  register:       (data)  => api.post('/auth/register', data),
  login:          (data)  => api.post('/auth/login', data),
  me:             ()      => api.get('/auth/me'),
  verifyEmail:    (token) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
}

// ── clearance ──
export const clearanceAPI = {
  submit:   (data)  => api.post('/clearance', data),
  getMine:  ()      => api.get('/clearance/mine'),
  getAll:   ()      => api.get('/clearance'),
  getOne:   (id)    => api.get(`/clearance/${id}`),
}

// ── stages ──
export const stagesAPI = {
  review:  (appId, data) => api.post(`/stages/${appId}/review`, data),
  grant:   (appId, data) => api.post(`/stages/${appId}/grant`, data),
  queue:   (stage)       => api.get(`/stages/queue?stage=${stage}`),
}

// ── notifications ──
export const notifAPI = {
  getAll:      ()   => api.get('/notifications'),
  markRead:    (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: ()   => api.patch('/notifications/read-all'),
  unreadCount: ()   => api.get('/notifications/unread-count'),
}

// ── admin ──
export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
  audit: () => api.get('/admin/audit'),
}

// ── upload ──
export const uploadFiles = (files) => {
  const form = new FormData()
  files.forEach(f => form.append('files', f))
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}