import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../lib/api'
import type { SavingsGoal } from '../types/api'

export function GoalsPage() {
  const queryClient = useQueryClient()
  const [contribution, setContribution] = useState<Record<number, string>>({})
  const { data = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => (await api.get<SavingsGoal[]>('/savings-goals')).data,
  })

  const contributeMutation = useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: number; amount: number }) =>
      api.patch(`/savings-goals/${goalId}/contributions`, { amount }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['goals'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Goals</p>
          <h1>Track target amounts and top up progress without friction.</h1>
          <p>Each goal card includes a contribution action aligned with the IA goal flow.</p>
        </div>
      </section>

      <section className="content-card budget-grid">
        {data.map((goal) => (
          <article className="budget-card" key={goal.id}>
            <div className="goal-item-head">
              <strong>{goal.name}</strong>
              <span>{goal.status}</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(Number(goal.completionPercentage), 100)}%` }}
              />
            </div>
            <small>
              ₹{Number(goal.currentAmount).toLocaleString()} / ₹{Number(goal.targetAmount).toLocaleString()}
            </small>
            <p>Target date: {goal.targetDate ?? 'Flexible'}</p>
            <div className="inline-form">
              <input
                type="number"
                step="0.01"
                placeholder="Contribution"
                value={contribution[goal.id] ?? ''}
                onChange={(event) =>
                  setContribution((current) => ({ ...current, [goal.id]: event.target.value }))
                }
              />
              <button
                type="button"
                className="ghost-button"
                onClick={async () => {
                  const amount = Number(contribution[goal.id] ?? 0)
                  if (amount > 0) {
                    await contributeMutation.mutateAsync({ goalId: goal.id, amount })
                    setContribution((current) => ({ ...current, [goal.id]: '' }))
                  }
                }}
              >
                Add
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
