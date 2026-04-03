import { StatusCodes } from 'http-status-codes'
import { ROLES, STATUS } from '../utils/constants.js'

export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Name, email and password are required' })
  }
  if (password.length < 6) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Password must be at least 6 characters' })
  }
  if (role && !['viewer', 'analyst', 'admin'].includes(role)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid role' })
  }
  next()
}

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Email and password are required' })
  }
  next()
}

const isValidRecordType = (type) => ['income', 'expense'].includes(type)
const isISODateString = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
const isValidDateValue = (value) => !Number.isNaN(new Date(value).getTime())
const isFutureDate = (value) => {
  const dateValue = new Date(value)
  const today = new Date()
  // normalize to ignore time-of-day differences
  dateValue.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return dateValue > today
}

export const validateRecordCreate = (req, res, next) => {
  const { amount, type, category, date } = req.body
  if (amount === undefined || Number(amount) <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Amount must be greater than zero' })
  }
  if (!isValidRecordType(type)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid record type' })
  }
  if (!category) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Category is required' })
  }
  if (!date) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Date is required' })
  }
  if (!isISODateString(date) || !isValidDateValue(date)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Date must be in YYYY-MM-DD format' })
  }
  if (isFutureDate(date)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Date cannot be in the future' })
  }
  next()
}

export const validateRecordUpdate = (req, res, next) => {
  const { amount, type, date } = req.body
  if (amount !== undefined && Number(amount) <= 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Amount must be greater than zero' })
  }
  if (type && !isValidRecordType(type)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid record type' })
  }
  if (date !== undefined) {
    if (!isISODateString(date) || !isValidDateValue(date)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Date must be in YYYY-MM-DD format' })
    }
    if (isFutureDate(date)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Date cannot be in the future' })
    }
  }
  next()
}

export const validateRoleUpdate = (req, res, next) => {
  const { role } = req.body
  if (!role || !Object.values(ROLES).includes(role)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid role' })
  }
  next()
}

export const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body
  if (!status || !Object.values(STATUS).includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid status' })
  }
  next()
}
