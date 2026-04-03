import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { assertObjectId } from '../utils/validators.js'
import { ROLES, STATUS } from '../utils/constants.js'

export const listUsers = async () => {
  return User.find({}, 'name email role status createdAt').sort({ createdAt: -1 })
}

export const updateUserRole = async (id, role) => {
  assertObjectId(id, 'user id')
  if (!Object.values(ROLES).includes(role)) {
    const error = new Error('Invalid role')
    error.statusCode = StatusCodes.BAD_REQUEST
    throw error
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true })
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = StatusCodes.NOT_FOUND
    throw error
  }
  return user
}

export const updateUserStatus = async (id, status, actingUserId) => {
  assertObjectId(id, 'user id')
  if (!Object.values(STATUS).includes(status)) {
    const error = new Error('Invalid status')
    error.statusCode = StatusCodes.BAD_REQUEST
    throw error
  }
  if (status === STATUS.INACTIVE && actingUserId && id === actingUserId) {
    const error = new Error('You cannot deactivate your own account')
    error.statusCode = StatusCodes.BAD_REQUEST
    throw error
  }
  const user = await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = StatusCodes.NOT_FOUND
    throw error
  }
  return user
}
