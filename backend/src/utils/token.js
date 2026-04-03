import jwt from 'jsonwebtoken'

const signToken = (payload, options = {}) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing')
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    ...options
  })
}

const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing')
  }
  return jwt.verify(token, process.env.JWT_SECRET)
}

export { signToken, verifyToken }
