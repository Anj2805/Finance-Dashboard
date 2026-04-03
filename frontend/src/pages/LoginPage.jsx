import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { DEFAULT_ERROR } from '../utils/constants'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const { showToast } = useUI()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}
    if (!form.email) nextErrors.email = 'Email is required'
    if (!form.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await login(form)
      showToast('Login successful', 'success')
      navigate('/dashboard')
    } catch (error) {
      showToast(error?.response?.data?.message || DEFAULT_ERROR, 'error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-800">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-500">Sign in to continue</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          No account?{' '}
          <Link to="/register" className="font-semibold text-blue-600">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
