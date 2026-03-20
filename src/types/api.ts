export type AuthResponse = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresInSeconds: number
  email: string
  displayName: string
}

export type CurrentUser = {
  email: string
  displayName: string
}

export type DashboardSummary = {
  month: string
  totalIncome: number
  totalExpenses: number
  netBalance: number
  transactionCount: number
  activeSavingsGoals: number
  activeRecurringPayments: number
  budgets: BudgetOverview[]
  savingsGoals: SavingsGoal[]
  upcomingRecurringPayments: RecurringPayment[]
}

export type BudgetOverview = {
  category: string
  limitAmount: number
  spentAmount: number
  remainingAmount: number
}

export type Transaction = {
  id: number
  description: string
  amount: number
  transactionDate: string
  type: string
  accountId: number
  categoryId: number
  merchant?: string | null
  note?: string | null
  tags?: string | null
}

export type Budget = {
  id: number
  category: string
  monthStart: string
  amountLimit: number
  spentAmount: number
  remainingAmount: number
}

export type SavingsGoal = {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  completionPercentage: number
  targetDate?: string | null
  status: string
  description?: string | null
}

export type RecurringPayment = {
  id: number
  title: string
  amount: number
  frequency: string
  category: string
  nextPaymentDate: string
  active: boolean
}

export type Account = {
  id: number
  name: string
  type: string
  openingBalance: number
  currentBalance: number
  institutionName?: string | null
  createdAt: string
}

export type Category = {
  id: number
  name: string
  type: 'INCOME' | 'EXPENSE'
  color?: string | null
  icon?: string | null
  archived: boolean
}

export type ApiMessage = {
  message: string
}
