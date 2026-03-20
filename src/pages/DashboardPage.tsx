import { useQuery } from '@tanstack/react-query'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { api } from '../lib/api'
import { useShellContext } from '../hooks/useShellContext'
import type { DashboardSummary } from '../types/api'

const chartColors = ['#0f766e', '#1d4ed8', '#f59e0b', '#dc2626', '#7c3aed']

export function DashboardPage() {
  const { selectedMonth, openAddTransaction } = useShellContext()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', selectedMonth],
    queryFn: async () =>
      (await api.get<DashboardSummary>(`/dashboard/summary?month=${selectedMonth}`)).data,
  })

  if (isLoading || !data) {
    return <div className="page-state">Loading dashboard...</div>
  }

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>One-screen control for your monthly money flow.</h1>
          <p>
            Review income, expenses, budgets, recurring bills, and goals without leaving the page.
          </p>
        </div>
        <button className="primary-action" onClick={openAddTransaction}>
          Add transaction
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Income</span>
          <strong>₹{Number(data.totalIncome).toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Expenses</span>
          <strong>₹{Number(data.totalExpenses).toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Net Balance</span>
          <strong>₹{Number(data.netBalance).toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Transactions</span>
          <strong>{data.transactionCount}</strong>
        </div>
      </section>

      <section className="content-card chart-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Budget distribution</p>
            <h2>Spending by category</h2>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.budgets} dataKey="spentAmount" nameKey="category" innerRadius={68} outerRadius={104}>
              {data.budgets.map((entry, index) => (
                <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="content-card chart-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Budget summary</p>
            <h2>Budget vs remaining</h2>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.budgets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="spentAmount" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
            <Bar dataKey="remainingAmount" fill="#0f766e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="content-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Upcoming</p>
            <h2>Recurring payments</h2>
          </div>
        </div>
        <div className="stack-list">
          {data.upcomingRecurringPayments.map((payment) => (
            <article key={payment.id} className="list-row">
              <div>
                <strong>{payment.title}</strong>
                <span>{payment.frequency}</span>
              </div>
              <div className="row-meta">
                <strong>₹{Number(payment.amount).toLocaleString()}</strong>
                <span>{payment.nextPaymentDate}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Goals</p>
            <h2>Savings progress</h2>
          </div>
        </div>
        <div className="stack-list">
          {data.savingsGoals.map((goal) => (
            <article key={goal.id} className="goal-item">
              <div className="goal-item-head">
                <strong>{goal.name}</strong>
                <span>{goal.completionPercentage}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(goal.completionPercentage, 100)}%` }} />
              </div>
              <small>
                ₹{Number(goal.currentAmount).toLocaleString()} of ₹{Number(goal.targetAmount).toLocaleString()}
              </small>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
