import { StatusCodes } from 'http-status-codes'
import { verifyToken } from '../utils/token.js'
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Authentication required' })
    }

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id)
    if (!user || user.status !== 'active') {
      return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Invalid or expired token' })
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.length) return next()
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Forbidden' })
  }
  next()
}
