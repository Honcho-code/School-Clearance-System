import { io } from 'socket.io-client'

let socket = null

export function connectSocket(token) {
  // already connected with same token — do nothing
  if (socket && socket.connected) return socket

  // clean up old socket first
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }

  const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')

  socket = io(BASE, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 3000,
  })

  return socket
}

export function getSocket() { return socket }

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}