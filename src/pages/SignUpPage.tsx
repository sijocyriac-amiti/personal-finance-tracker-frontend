import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  displayName: z.string().min(2),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number'),
})

export function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { displayName: '', email: '', password: '' } })

  return (
    <div className="auth-card">
      <div>
        <p className="eyebrow">New account</p>
        <h2>Sign Up</h2>
        <p>Create your finance workspace with a unique email, strong password, and display name.</p>
      </div>
      <form
        className="form-grid"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            setError('')
            await register(values)
            navigate('/dashboard', { replace: true })
          } catch {
            setError('Registration failed. That email may already be in use.')
          }
        })}
      >
        <label>
          <span>Display Name</span>
          <input {...form.register('displayName')} />
        </label>
        <label>
          <span>Email</span>
          <input {...form.register('email')} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" {...form.register('password')} />
        </label>
        <p className="form-error">
          {error ||
            form.formState.errors.displayName?.message ||
            form.formState.errors.email?.message ||
            form.formState.errors.password?.message}
        </p>
        <button className="primary-action" type="submit">
          Create Account
        </button>
      </form>
      <div className="auth-links">
        <span>Already have an account?</span>
        <Link to="/login">Log in</Link>
      </div>
    </div>
  )
}
