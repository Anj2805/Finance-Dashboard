import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { DEFAULT_ERROR, ROLES } from '../utils/constants'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const { showToast } = useUI()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: ROLES.VIEWER })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}
    if (!form.name) nextErrors.name = 'Name is required'
    if (!form.email) nextErrors.email = 'Email is required'
    if (!form.password || form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    if (!form.role) nextErrors.role = 'Role is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await register(form)
      showToast('Registration successful', 'success')
      navigate('/dashboard')
    } catch (error) {
      showToast(error?.response?.data?.message || DEFAULT_ERROR, 'error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-800">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">Create account</h1>
        <p className="mb-6 text-sm text-slate-500">Set up access for the finance dashboard</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
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
          <Select
            label="Role"
            name="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            error={errors.role}
          >
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </Select>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
