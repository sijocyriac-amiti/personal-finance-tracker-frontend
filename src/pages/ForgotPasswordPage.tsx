import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { api } from '../lib/api'

const schema = z.object({ email: z.email() })

export function ForgotPasswordPage() {
  const [message, setMessage] = useState('')
  const [tokenHint, setTokenHint] = useState('')
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  return (
    <div className="auth-card">
      <div>
        <p className="eyebrow">Recovery</p>
        <h2>Forgot Password</h2>
        <p>Enter your email to generate a reset token. This demo backend returns the token directly.</p>
      </div>
      <form
        className="form-grid"
        onSubmit={form.handleSubmit(async (values) => {
          const response = await api.post<{ message: string; resetToken?: string | null }>('/auth/forgot-password', values)
          setMessage(response.data.message)
          setTokenHint(response.data.resetToken ?? '')
        })}
      >
        <label>
          <span>Email</span>
          <input {...form.register('email')} />
        </label>
        <p className="form-error">{form.formState.errors.email?.message}</p>
        <button className="primary-action" type="submit">
          Send reset instructions
        </button>
      </form>
      {message ? <div className="callout success">{message}</div> : null}
      {tokenHint ? <div className="callout">Use this reset token on the reset screen: <code>{tokenHint}</code></div> : null}
      <div className="auth-links">
        <Link to="/login">Back to login</Link>
        <Link to="/reset-password">Go to reset form</Link>
      </div>
    </div>
  )
}
