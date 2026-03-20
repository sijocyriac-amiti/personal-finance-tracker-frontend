import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <section className="auth-brand-panel">
        <p className="eyebrow">Personal Finance Tracker</p>
        <h1>Make every rupee easier to understand.</h1>
        <p className="auth-copy">
          A calm finance workspace for budgets, recurring bills, goals, and the daily
          transaction flow that keeps everything accurate.
        </p>
        <div className="auth-stats">
          <div>
            <strong>8</strong>
            <span>Primary workspaces</span>
          </div>
          <div>
            <strong>1</strong>
            <span>Global add flow</span>
          </div>
          <div>
            <strong>JWT</strong>
            <span>Secure session model</span>
          </div>
        </div>
      </section>
      <section className="auth-form-panel">
        <Outlet />
      </section>
    </div>
  )
}
