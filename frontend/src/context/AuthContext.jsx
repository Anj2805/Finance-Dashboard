import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../services/authService'
import { clearStorage, getStoredToken, getStoredUser, storeToken, storeUser } from '../utils/storage'
import { ROLES } from '../utils/constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    storeToken(token)
  }, [token])

  useEffect(() => {
    storeUser(user)
  }, [user])

  const extractPayload = (response) => {
    if (!response) return {}
    if (response.token) return response
    if (response.data) return response.data
    return response
  }

  const handleAuthResponse = (response) => {
    const payload = extractPayload(response)
    setToken(payload?.token)
    setUser(payload?.user)
  }

  const login = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { data } = await loginRequest(payload)
      handleAuthResponse(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { data } = await registerRequest(payload)
      handleAuthResponse(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    clearStorage()
  }, [])

  const hasRole = useCallback((allowedRoles = []) => {
    if (!allowedRoles?.length) return true
    return allowedRoles.includes(user?.role)
  }, [user])

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
    hasRole,
    isAdmin: user?.role === ROLES.ADMIN
  }), [token, user, loading, login, register, logout, hasRole])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
