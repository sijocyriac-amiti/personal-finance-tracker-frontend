import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { CurrentUser } from '../types/api'

export function SettingsPage() {
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get<CurrentUser>('/auth/me')).data,
  })

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Profile and preference home for the next backend milestone.</h1>
          <p>Profile identity is live; password-change and preference endpoints are still future work.</p>
        </div>
      </section>

      <section className="content-card">
        <div className="stack-list">
          <article className="list-row">
            <div>
              <strong>Display name</strong>
              <span>Profile identity</span>
            </div>
            <div className="row-meta">
              <span>{data?.displayName ?? '—'}</span>
            </div>
          </article>
          <article className="list-row">
            <div>
              <strong>Email</strong>
              <span>Sign-in credential</span>
            </div>
            <div className="row-meta">
              <span>{data?.email ?? '—'}</span>
            </div>
          </article>
          <article className="list-row">
            <div>
              <strong>Notification preferences</strong>
              <span>Planned backend support</span>
            </div>
            <div className="row-meta">
              <span>Client-side alerts for now</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
