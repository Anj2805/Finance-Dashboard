import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { signToken } from '../utils/token.js'

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email })
  if (existing) {
    const error = new Error('User already exists')
    error.statusCode = StatusCodes.CONFLICT
    throw error
  }
  const user = await User.create({ name, email, password, role })
  const token = signToken({ id: user._id, role: user.role })
  return { user: user.toSafeObject(), token }
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('Invalid credentials')
    error.statusCode = StatusCodes.UNAUTHORIZED
    throw error
  }
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    const error = new Error('Invalid credentials')
    error.statusCode = StatusCodes.UNAUTHORIZED
    throw error
  }
  const token = signToken({ id: user._id, role: user.role })
  return { user: user.toSafeObject(), token }
}
