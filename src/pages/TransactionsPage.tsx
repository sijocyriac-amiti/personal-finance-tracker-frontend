import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useShellContext } from '../hooks/useShellContext'
import type { Transaction } from '../types/api'

export function TransactionsPage() {
  const { selectedMonth, searchTerm, openAddTransaction } = useShellContext()
  const { data = [], isLoading } = useQuery({
    queryKey: ['transactions', selectedMonth],
    queryFn: async () => (await api.get<Transaction[]>(`/transactions?month=${selectedMonth}`)).data,
  })

  const filteredTransactions = data.filter((transaction) => {
    const haystack = `${transaction.description} ${transaction.merchant ?? ''} ${transaction.note ?? ''}`.toLowerCase()
    return haystack.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Transactions</p>
          <h1>Ledger view for income and expenses.</h1>
          <p>Search is route-aware here and filters by description, merchant, and note.</p>
        </div>
        <button className="primary-action" onClick={openAddTransaction}>
          Add transaction
        </button>
      </section>

      <section className="content-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Merchant</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.transactionDate}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.merchant || '—'}</td>
                    <td>{transaction.type}</td>
                    <td>₹{Number(transaction.amount).toLocaleString()}</td>
                    <td>{transaction.tags || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>No transactions match this month and search filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
