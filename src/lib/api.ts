import axios from 'axios'
import { clearSession, getAccessToken, getRefreshToken, storeSession } from './storage'
import type { AuthResponse } from '../types/api'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

const api = axios.create({
  baseURL: apiBaseUrl,
})

let isRefreshing = false
let queuedResolvers: Array<(token: string | null) => void> = []

function notifyQueue(token: string | null) {
  queuedResolvers.forEach((resolve) => resolve(token))
  queuedResolvers = []
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status !== 401 || originalRequest?._retry || originalRequest?.url?.includes('/auth/')) {
      throw error
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queuedResolvers.push((token) => {
          if (!token) {
            reject(error)
            return
          }

          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true
    originalRequest._retry = true

    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearSession()
        notifyQueue(null)
        throw error
      }

      const response = await axios.post<AuthResponse>(`${apiBaseUrl}/auth/refresh`, { refreshToken })
      storeSession(response.data)
      notifyQueue(response.data.accessToken)
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      clearSession()
      notifyQueue(null)
      throw refreshError
    } finally {
      isRefreshing = false
    }
  },
)

export { api }
