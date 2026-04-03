const TOKEN_KEY = 'fd_token'
const USER_KEY = 'fd_user'

const isBrowser = typeof window !== 'undefined'

export const getStoredToken = () => (isBrowser ? window.localStorage.getItem(TOKEN_KEY) : null)
export const getStoredUser = () => {
  if (!isBrowser) return null
  const raw = window.localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export const storeToken = (token) => {
  if (!isBrowser) return
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(TOKEN_KEY)
  }
}

export const storeUser = (user) => {
  if (!isBrowser) return
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(USER_KEY)
  }
}

export const clearStorage = () => {
  if (!isBrowser) return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
}
