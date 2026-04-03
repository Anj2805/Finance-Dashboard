import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import { RECORD_TYPES } from '../utils/constants'
import { createRecord, getRecord, updateRecord } from '../services/recordsService'
import { useUI } from '../context/UIContext'

const initialForm = {
  amount: '',
  type: RECORD_TYPES[0].value,
  category: '',
  date: '',
  note: ''
}

const RecordFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useUI()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [initializing, setInitializing] = useState(isEdit)

  useEffect(() => {
    const fetchRecord = async () => {
      if (!isEdit) return
      setInitializing(true)
      try {
        const response = await getRecord(id)
        const recordData = response.data?.data?.record || response.data?.record || response.data || {}
        setForm({
          amount: recordData.amount || '',
          type: recordData.type || RECORD_TYPES[0].value,
          category: recordData.category || '',
          date: recordData.date?.slice(0, 10) || '',
          note: recordData.note || ''
        })
      } catch (error) {
        showToast('Unable to load record', 'error')
      } finally {
        setInitializing(false)
      }
    }
    fetchRecord()
  }, [id, isEdit, showToast])

  const isValidDateFormat = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value)
  const isFutureDate = (value) => {
    const candidate = new Date(value)
    const today = new Date()
    candidate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return candidate > today
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.amount) nextErrors.amount = 'Amount is required'
    if (!form.category) nextErrors.category = 'Category is required'
    if (!form.date) {
      nextErrors.date = 'Date is required'
    } else if (!isValidDateFormat(form.date)) {
      nextErrors.date = 'Date must be in YYYY-MM-DD format'
    } else if (isFutureDate(form.date)) {
      nextErrors.date = 'Date cannot be in the future'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form, amount: Number(form.amount) }
      if (isEdit) {
        await updateRecord(id, payload)
        showToast('Record updated', 'success')
      } else {
        await createRecord(payload)
        showToast('Record created', 'success')
      }
      navigate('/records')
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to save record'
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (initializing) {
    return <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">Loading record...</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{isEdit ? 'Edit' : 'Add'} Record</h1>
        <p className="text-sm text-slate-500">Manage your transaction details.</p>
      </div>
      <form className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800" onSubmit={handleSubmit}>
        <Input
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          error={errors.amount}
        />
        <Select label="Type" name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          {RECORD_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          error={errors.category}
        />
        <Input
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          error={errors.date}
        />
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-100">
          Notes
          <textarea name="note" rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </label>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RecordFormPage
