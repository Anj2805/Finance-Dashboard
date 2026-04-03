import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../utils/constants'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: [ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN] },
  { to: '/records', label: 'Records', roles: [ROLES.ANALYST, ROLES.ADMIN] },
  { to: '/records/new', label: 'Add Record', roles: [ROLES.ADMIN] },
  { to: '/users', label: 'User Management', roles: [ROLES.ADMIN] }
]

const Sidebar = () => {
  const { hasRole } = useAuth()

  return (
    <aside className="hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-slate-100 bg-white/80 p-6 text-sm font-medium text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 md:flex">
      <div className="mb-8 text-xl font-semibold text-slate-900 dark:text-white">FinanceFlow</div>
      <nav className="flex flex-col gap-2">
        {navItems
          .filter((item) => hasRole(item.roles))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  )
}

export default Sidebar
