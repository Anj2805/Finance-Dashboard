import dotenv from 'dotenv'
import app from '../backend/src/app.js'
import connectDB from '../backend/src/config/db.js'

dotenv.config()

let cachedConnection = null

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    await connectDB()
    cachedConnection = true
    return cachedConnection
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    await connectToDatabase()
    app(req, res)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}