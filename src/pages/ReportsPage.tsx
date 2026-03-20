import { useQuery } from '@tanstack/react-query'
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { api } from '../lib/api'
import { useShellContext } from '../hooks/useShellContext'
import type { Budget, Transaction } from '../types/api'

export function ReportsPage() {
  const { selectedMonth } = useShellContext()
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', 'reports', selectedMonth],
    queryFn: async () => (await api.get<Transaction[]>(`/transactions?month=${selectedMonth}`)).data,
  })
  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets', 'reports', selectedMonth],
    queryFn: async () => (await api.get<Budget[]>(`/budgets?month=${selectedMonth}`)).data,
  })

  const incomeVsExpense = transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === 'INCOME') {
        accumulator.income += Number(transaction.amount)
      } else {
        accumulator.expense += Number(transaction.amount)
      }
      return accumulator
    },
    { name: selectedMonth, income: 0, expense: 0 },
  )

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Reports</p>
          <h1>Composed reporting while dedicated aggregation APIs are still pending.</h1>
          <p>This first version follows the IA note and derives insights from dashboard, budget, and transaction data.</p>
        </div>
      </section>

      <section className="content-card chart-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Income vs expense</p>
            <h2>Current month summary</h2>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={[incomeVsExpense]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area dataKey="income" fill="#0f766e" stroke="#0f766e" />
            <Area dataKey="expense" fill="#dc2626" stroke="#dc2626" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="content-card chart-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Category spend</p>
            <h2>Budget consumption</h2>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={budgets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="spentAmount" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
