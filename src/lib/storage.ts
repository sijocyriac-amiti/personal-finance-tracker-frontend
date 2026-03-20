import type { AuthResponse, CurrentUser } from '../types/api'

const ACCESS_TOKEN_KEY = 'pft.accessToken'
const REFRESH_TOKEN_KEY = 'pft.refreshToken'
const USER_KEY = 'pft.user'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getStoredUser(): CurrentUser | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as CurrentUser) : null
}

export function storeSession(auth: AuthResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken)
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ email: auth.email, displayName: auth.displayName } satisfies CurrentUser),
  )
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
