import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../lib/api'
import type { Account, Category } from '../types/api'

const schema = z.object({
  description: z.string().min(2),
  amount: z.coerce.number().positive(),
  transactionDate: z.string().min(1),
  type: z.enum(['INCOME', 'EXPENSE']),
  accountId: z.coerce.number(),
  categoryId: z.coerce.number(),
  merchant: z.string().optional(),
  note: z.string().optional(),
  tags: z.string().optional(),
})

type FormValues = z.infer<typeof schema>
type FormInput = z.input<typeof schema>

type Props = {
  open: boolean
  onClose: () => void
  selectedMonth: string
}

export function GlobalTransactionModal({ open, onClose, selectedMonth }: Props) {
  const queryClient = useQueryClient()
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => (await api.get<Account[]>('/accounts')).data,
    enabled: open,
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data,
    enabled: open,
  })

  const form = useForm<FormInput, undefined, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      amount: 0,
      transactionDate: `${selectedMonth}-01`,
      type: 'EXPENSE',
      merchant: '',
      note: '',
      tags: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        description: '',
        amount: 0,
        transactionDate: `${selectedMonth}-01`,
        type: 'EXPENSE',
        accountId: accounts[0]?.id,
        categoryId: categories[0]?.id,
        merchant: '',
        note: '',
        tags: '',
      })
    }
  }, [open, selectedMonth, accounts, categories, form])

  const selectedType = form.watch('type')
  const visibleCategories = categories.filter((category) => category.type === selectedType)

  const createTransaction = useMutation({
    mutationFn: async (values: FormValues) => api.post('/transactions', values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      ])
      onClose()
    },
  })

  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Global Action</p>
            <h3>Add Transaction</h3>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <form
          className="form-grid"
          onSubmit={form.handleSubmit(async (values) => {
            await createTransaction.mutateAsync(values)
          })}
        >
          <label>
            <span>Type</span>
            <select {...form.register('type')}>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </label>
          <label>
            <span>Amount</span>
            <input type="number" step="0.01" {...form.register('amount')} />
          </label>
          <label>
            <span>Description</span>
            <input {...form.register('description')} />
          </label>
          <label>
            <span>Date</span>
            <input type="date" {...form.register('transactionDate')} />
          </label>
          <label>
            <span>Account</span>
            <select {...form.register('accountId')}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Category</span>
            <select {...form.register('categoryId')}>
              {visibleCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Merchant</span>
            <input {...form.register('merchant')} />
          </label>
          <label>
            <span>Tags</span>
            <input placeholder="comma,separated" {...form.register('tags')} />
          </label>
          <label className="form-grid full">
            <span>Note</span>
            <textarea rows={4} {...form.register('note')} />
          </label>

          <div className="form-actions">
            <p className="form-error">
              {Object.values(form.formState.errors)[0]?.message?.toString() ??
                (createTransaction.isError ? 'Unable to save transaction.' : '')}
            </p>
            <button type="submit" className="primary-action" disabled={createTransaction.isPending}>
              {createTransaction.isPending ? 'Saving...' : 'Save transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
