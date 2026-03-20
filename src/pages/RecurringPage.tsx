import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { RecurringPayment } from '../types/api'

export function RecurringPage() {
  const { data = [] } = useQuery({
    queryKey: ['recurring-payments'],
    queryFn: async () => (await api.get<RecurringPayment[]>('/recurring-payments')).data,
  })

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Recurring</p>
          <h1>Subscriptions, salary cycles, and repeat obligations.</h1>
          <p>Payments are ordered by next due date so the most immediate commitments surface first.</p>
        </div>
      </section>

      <section className="content-card">
        <div className="stack-list">
          {data.map((item) => (
            <article key={item.id} className="list-row">
              <div>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </div>
              <div className="row-meta">
                <strong>₹{Number(item.amount).toLocaleString()}</strong>
                <span>{item.frequency} • {item.nextPaymentDate}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
