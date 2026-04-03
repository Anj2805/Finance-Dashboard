import { successResponse } from '../utils/response.js'
import { listUsers, updateUserRole, updateUserStatus } from '../services/userService.js'

export const getUsers = async (req, res, next) => {
  try {
    const users = await listUsers()
    return successResponse(res, { users })
  } catch (error) {
    next(error)
  }
}

export const patchUserRole = async (req, res, next) => {
  try {
    const user = await updateUserRole(req.params.id, req.body.role)
    return successResponse(res, { user })
  } catch (error) {
    next(error)
  }
}

export const patchUserStatus = async (req, res, next) => {
  try {
    const user = await updateUserStatus(req.params.id, req.body.status, req.user?.id?.toString())
    return successResponse(res, { user })
  } catch (error) {
    next(error)
  }
}
