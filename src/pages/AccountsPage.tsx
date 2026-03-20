import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../lib/api'
import type { Account, Category } from '../types/api'

export function AccountsPage() {
  const queryClient = useQueryClient()
  const [transfer, setTransfer] = useState({ fromAccountId: '', toAccountId: '', amount: '' })

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => (await api.get<Account[]>('/accounts')).data,
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data,
  })

  const transferMutation = useMutation({
    mutationFn: async () =>
      api.post('/accounts/transfer', {
        fromAccountId: Number(transfer.fromAccountId),
        toAccountId: Number(transfer.toAccountId),
        amount: Number(transfer.amount),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['accounts'] })
      setTransfer({ fromAccountId: '', toAccountId: '', amount: '' })
    },
  })

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Accounts</p>
          <h1>Financial containers, balances, and a light transfer flow.</h1>
          <p>This page also shows category setup since categories are foundational but not top-level nav.</p>
        </div>
      </section>

      <section className="content-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Account balances</p>
            <h2>Accounts</h2>
          </div>
        </div>
        <div className="stats-grid">
          {accounts.map((account) => (
            <article className="stat-card" key={account.id}>
              <span>{account.type}</span>
              <strong>{account.name}</strong>
              <small>₹{Number(account.currentBalance).toLocaleString()}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Transfer funds</p>
            <h2>Account transfer</h2>
          </div>
        </div>
        <div className="inline-form">
          <select value={transfer.fromAccountId} onChange={(event) => setTransfer({ ...transfer, fromAccountId: event.target.value })}>
            <option value="">From account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
          <select value={transfer.toAccountId} onChange={(event) => setTransfer({ ...transfer, toAccountId: event.target.value })}>
            <option value="">To account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            value={transfer.amount}
            onChange={(event) => setTransfer({ ...transfer, amount: event.target.value })}
            placeholder="Amount"
          />
          <button className="ghost-button" type="button" onClick={() => transferMutation.mutate()}>
            Transfer
          </button>
        </div>
      </section>

      <section className="content-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Categories</p>
            <h2>Income and expense buckets</h2>
          </div>
        </div>
        <div className="stack-list">
          {categories.map((category) => (
            <article className="list-row" key={category.id}>
              <div>
                <strong>{category.name}</strong>
                <span>{category.type}</span>
              </div>
              <div className="row-meta">
                <span>{category.color || 'Default color'}</span>
                <span>{category.icon || 'No icon'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
