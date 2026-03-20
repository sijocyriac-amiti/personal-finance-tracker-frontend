import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GlobalTransactionModal } from './GlobalTransactionModal'

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Budgets', to: '/budgets' },
  { label: 'Goals', to: '/goals' },
  { label: 'Reports', to: '/reports' },
  { label: 'Recurring', to: '/recurring' },
  { label: 'Accounts', to: '/accounts' },
  { label: 'Settings', to: '/settings' },
]

export type ShellOutletContext = {
  searchTerm: string
  selectedMonth: string
  openAddTransaction: () => void
}

export function AppShell() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const notifications = useMemo(() => {
    const items = []
    if (location.pathname === '/budgets') {
      items.push('Budget watch is active for this month.')
    }
    if (location.pathname === '/recurring') {
      items.push('Recurring payments are sorted by next due date.')
    }
    return items
  }, [location.pathname])

  const outletContext = useMemo<ShellOutletContext>(
    () => ({
      searchTerm,
      selectedMonth,
      openAddTransaction: () => setShowTransactionModal(true),
    }),
    [searchTerm, selectedMonth],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">PF</div>
          <div>
            <p className="eyebrow">Finance OS</p>
            <h2>Personal Finance Tracker</h2>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="primary-action" onClick={() => setShowTransactionModal(true)}>
          + Add Transaction
        </button>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <label className="search-field">
              <span>Search</span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search page content"
              />
            </label>
            <label className="month-picker">
              <span>Date Range</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              />
            </label>
          </div>

          <div className="topbar-right">
            <button className="notification-pill" type="button">
              Notifications
              <strong>{notifications.length}</strong>
            </button>
            <div className="profile-menu-wrap">
              <button
                className="profile-button"
                type="button"
                onClick={() => setShowProfileMenu((value) => !value)}
              >
                <span>{user?.displayName ?? 'User'}</span>
                <small>{user?.email}</small>
              </button>
              {showProfileMenu ? (
                <div className="profile-menu">
                  <button type="button" onClick={() => navigate('/settings')}>
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout()
                      navigate('/login')
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet context={outletContext} />
        </main>
      </div>

      <button className="mobile-fab" type="button" onClick={() => setShowTransactionModal(true)}>
        +
      </button>

      <GlobalTransactionModal
        open={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        selectedMonth={selectedMonth}
      />
    </div>
  )
}
