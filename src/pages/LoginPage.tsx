import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  return (
    <div className="auth-card">
      <div>
        <p className="eyebrow">Welcome back</p>
        <h2>Log in</h2>
        <p>Use your email and password to continue securely into the finance workspace.</p>
      </div>
      <form
        className="form-grid"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            setError('')
            await login(values)
            navigate(location.state?.from ?? '/dashboard', { replace: true })
          } catch {
            setError('Login failed. Check your email and password.')
          }
        })}
      >
        <label>
          <span>Email</span>
          <input {...form.register('email')} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" {...form.register('password')} />
        </label>
        <p className="form-error">{error || form.formState.errors.email?.message || form.formState.errors.password?.message}</p>
        <button className="primary-action" type="submit">
          Log In
        </button>
      </form>
      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
        <span />
        <Link to="/sign-up">Create an account</Link>
      </div>
    </div>
  )
}
