import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { api } from '../lib/api'

const schema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
})

export function ResetPasswordPage() {
  const [message, setMessage] = useState('')
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { token: '', newPassword: '' } })

  return (
    <div className="auth-card">
      <div>
        <p className="eyebrow">Password reset</p>
        <h2>Reset Password</h2>
        <p>Paste the reset token and set a new password that matches the backend validation rules.</p>
      </div>
      <form
        className="form-grid"
        onSubmit={form.handleSubmit(async (values) => {
          const response = await api.post<{ message: string }>('/auth/reset-password', values)
          setMessage(response.data.message)
        })}
      >
        <label>
          <span>Reset Token</span>
          <input {...form.register('token')} />
        </label>
        <label>
          <span>New Password</span>
          <input type="password" {...form.register('newPassword')} />
        </label>
        <p className="form-error">
          {form.formState.errors.token?.message || form.formState.errors.newPassword?.message}
        </p>
        <button className="primary-action" type="submit">
          Update password
        </button>
      </form>
      {message ? <div className="callout success">{message}</div> : null}
      <div className="auth-links">
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  )
}
