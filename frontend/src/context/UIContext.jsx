import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const UIContext = createContext(null)

export const UIProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem('fd_theme') || 'light'
  })
  const [toast, setToast] = useState(null)

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('fd_theme', nextTheme)
      }
      return nextTheme
    })
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  const value = useMemo(() => ({ theme, toggleTheme, toast, showToast, hideToast }), [theme, toggleTheme, toast, showToast, hideToast])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within UIProvider')
  }
  return context
}
