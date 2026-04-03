import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'

const Topbar = () => {
  const { user, logout } = useAuth()
  const { toggleTheme, theme } = useUI()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
      <div>
        <p className="text-xs uppercase text-slate-500">Welcome back</p>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Topbar
