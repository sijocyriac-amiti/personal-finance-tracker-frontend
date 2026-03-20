import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { api } from '../lib/api'
import { clearSession, getAccessToken, getStoredUser, storeSession } from '../lib/storage'
import type { AuthResponse, CurrentUser } from '../types/api'

type LoginInput = {
  email: string
  password: string
}

type RegisterInput = {
  email: string
  password: string
  displayName: string
}

type AuthContextValue = {
  user: CurrentUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function hydrateUser() {
  const response = await api.get<CurrentUser>('/auth/me')
  return response.data
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<CurrentUser | null>(() => getStoredUser())
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(getAccessToken()))

  useEffect(() => {
    if (!getAccessToken()) {
      setIsBootstrapping(false)
      return
    }

    hydrateUser()
      .then((nextUser) => {
        startTransition(() => setUser(nextUser))
      })
      .catch(() => {
        clearSession()
        startTransition(() => setUser(null))
      })
      .finally(() => setIsBootstrapping(false))
  }, [])

  async function applyAuth(promise: Promise<{ data: AuthResponse }>) {
    const response = await promise
    storeSession(response.data)
    startTransition(() => {
      setUser({
        email: response.data.email,
        displayName: response.data.displayName,
      })
    })
  }

  async function login(input: LoginInput) {
    await applyAuth(api.post<AuthResponse>('/auth/login', input))
  }

  async function register(input: RegisterInput) {
    await applyAuth(api.post<AuthResponse>('/auth/register', input))
  }

  async function logout() {
    try {
      const refreshToken = localStorage.getItem('pft.refreshToken')
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } finally {
      clearSession()
      startTransition(() => setUser(null))
    }
  }

  async function refreshProfile() {
    const nextUser = await hydrateUser()
    startTransition(() => setUser(nextUser))
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && getAccessToken()),
      isBootstrapping,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, isBootstrapping],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
