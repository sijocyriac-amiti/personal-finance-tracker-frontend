import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useShellContext } from '../hooks/useShellContext'
import type { Budget } from '../types/api'

export function BudgetsPage() {
  const { selectedMonth } = useShellContext()
  const { data = [] } = useQuery({
    queryKey: ['budgets', selectedMonth],
    queryFn: async () => (await api.get<Budget[]>(`/budgets?month=${selectedMonth}`)).data,
  })

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Budgets</p>
          <h1>Monthly category pacing and threshold awareness.</h1>
          <p>This page is month-driven from the shared date picker in the top bar.</p>
        </div>
      </section>

      <section className="content-card budget-grid">
        {data.map((budget) => {
          const used = Math.max(0, Number(budget.spentAmount))
          const limit = Math.max(1, Number(budget.amountLimit))
          const progress = Math.min((used / limit) * 100, 100)
          return (
            <article className="budget-card" key={budget.id}>
              <div className="goal-item-head">
                <strong>{budget.category}</strong>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <small>
                ₹{used.toLocaleString()} spent of ₹{limit.toLocaleString()}
              </small>
              <p>Remaining: ₹{Number(budget.remainingAmount).toLocaleString()}</p>
            </article>
          )
        })}
      </section>
    </div>
  )
}
