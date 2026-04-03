import AppRoutes from './routes/AppRoutes'
import Toast from './components/common/Toast'
import { useUI } from './context/UIContext'

const App = () => {
  const { theme } = useUI()

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
        <AppRoutes />
        <Toast />
      </div>
    </div>
  )
}

export default App
