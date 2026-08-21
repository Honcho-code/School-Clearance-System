import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { authAPI, clearanceAPI, notifAPI } from '../services/api'
import { connectSocket, disconnectSocket } from '../services/socket'
import toast from 'react-hot-toast'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [dark,    setDark]    = useState(() => localStorage.getItem('oui_theme') === 'dark')
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('oui_user')) } catch { return null } })
  const [token,   setToken]   = useState(() => localStorage.getItem('oui_token') || null)
  const [app,     setApp]     = useState(null)
  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(false)
  const socketConnected = useRef(false)

  // apply dark class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('oui_theme', dark ? 'dark' : 'light')
  }, [dark])

  // connect socket ONCE when we have both token + user
  useEffect(() => {
    if (!token || !user || socketConnected.current) return

    const s = connectSocket(token)
    socketConnected.current = true

    s.on('connect', () => {
      console.log('Socket ready:', s.id)
    })

    s.on('connect_error', (err) => {
      // auth errors — don't spam reconnects
      if (err.message === 'No token' || err.message === 'Invalid token') {
        console.warn('Socket auth failed — skipping reconnect')
        s.io.reconnection(false)
      }
    })

    s.on('clearance_update', (updated) => {
      setApp(updated)
    })

    s.on('notification', (notif) => {
      setNotifs(prev => [notif, ...prev])
      const icon = notif.type === 'success' ? '✅'
        : notif.type === 'cleared' ? '🎓'
        : notif.type === 'warning' ? '⚠️' : 'ℹ️'
      toast(notif.message, { icon })
    })

    s.on('cleared', ({ letterId }) => {
      toast.success(`Fully cleared! Certificate: ${letterId}`, { duration: 8000 })
    })

    s.on('new_review_request', () => {
      toast('New application in your review queue.', { icon: '📋' })
      fetchNotifs()
    })

    // no cleanup disconnect here — socket lives for the whole session
  }, [token, user])

  // load data on mount if already logged in
  useEffect(() => {
    if (user && token) {
      if (user.role === 'student') fetchMyApp()
      fetchNotifs()
    }
  }, []) // only on mount

  const fetchMyApp = async () => {
    try {
      const res = await clearanceAPI.getMine()
      setApp(res.data.app)
    } catch (err) {
      console.error('fetchMyApp:', err.message)
    }
  }

  const fetchNotifs = async () => {
    try {
      const res = await notifAPI.getAll()
      setNotifs(res.data.notifications || [])
    } catch (err) {
      console.error('fetchNotifs:', err.message)
    }
  }

  // ── Auth ──
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      const res = await authAPI.login({ email, password })
      const { token: t, user: u } = res.data
      localStorage.setItem('oui_token', t)
      localStorage.setItem('oui_user', JSON.stringify(u))
      setToken(t)
      setUser(u)
      return { ok: true, user: u }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your email and password.'
      return { ok: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    try {
      setLoading(true)
      const res = await authAPI.register(data)
      const { token: t, user: u } = res.data
      localStorage.setItem('oui_token', t)
      localStorage.setItem('oui_user', JSON.stringify(u))
      setToken(t)
      setUser(u)
      return { ok: true, user: u }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      return { ok: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('oui_token')
    localStorage.removeItem('oui_user')
    setUser(null)
    setToken(null)
    setApp(null)
    setNotifs([])
    socketConnected.current = false
    disconnectSocket()
  }, [])

  // ── Clearance ──
  const submitClearance = useCallback(async (receipts) => {
    try {
      const res = await clearanceAPI.submit({ receipts })
      setApp(res.data.app)
      return { ok: true, app: res.data.app }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || 'Submission failed.' }
    }
  }, [])

  const refreshApp = useCallback(async () => {
    if (user?.role === 'student') await fetchMyApp()
  }, [user])

  // ── Notifications ──
  const markNotifRead = useCallback(async (id) => {
    try {
      await notifAPI.markRead(id)
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch {}
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await notifAPI.markAllRead()
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch {}
  }, [])

  const unreadCount = notifs.filter(n => !n.is_read).length

  // helpers for staff pages that need full app list
  const getMyApp    = useCallback(() => app, [app])
  const getAllApps  = useCallback(async () => {
    try {
      const res = await clearanceAPI.getAll()
      return res.data.apps || []
    } catch { return [] }
  }, [])

  return (
    <AppContext.Provider value={{
      dark, setDark,
      user, token, loading,
      login, register, logout,
      app, setApp, fetchMyApp, refreshApp, getMyApp,
      getAllApps, submitClearance,
      notifs, unreadCount, markNotifRead, markAllRead, fetchNotifs,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)