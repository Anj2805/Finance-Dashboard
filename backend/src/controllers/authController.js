import { StatusCodes } from 'http-status-codes'
import { registerUser, loginUser } from '../services/authService.js'
import { successResponse } from '../utils/response.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    const data = await registerUser({ name, email, password, role })
    return successResponse(res, data, StatusCodes.CREATED)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const data = await loginUser({ email, password })
    return successResponse(res, data, StatusCodes.OK)
  } catch (error) {
    next(error)
  }
}
