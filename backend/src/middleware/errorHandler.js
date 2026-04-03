import { StatusCodes } from 'http-status-codes'

export const notFoundHandler = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Route ${req.originalUrl} not found` })
}

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'
  const errors = err.errors
  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }
  res.status(status).json({ success: false, message, errors })
}
