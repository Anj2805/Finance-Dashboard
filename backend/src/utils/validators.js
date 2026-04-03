import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

export const assertObjectId = (id, label = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${label}`)
    error.statusCode = StatusCodes.BAD_REQUEST
    throw error
  }
}
