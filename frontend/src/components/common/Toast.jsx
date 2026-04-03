import { useEffect } from 'react'
import { useUI } from '../../context/UIContext'

const colors = {
  info: 'bg-blue-600',
  success: 'bg-green-600',
  error: 'bg-red-600'
}

const Toast = () => {
  const { toast, hideToast } = useUI()

  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => hideToast(), 4000)
    return () => clearTimeout(timeout)
  }, [toast, hideToast])

  if (!toast) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`rounded-xl px-5 py-3 text-white shadow-lg ${colors[toast.type] || colors.info}`}>
        {toast.message}
      </div>
    </div>
  )
}

export default Toast
