import mongoose from 'mongoose'

let connection = null

const connectDB = async () => {
  // Return existing connection if already established
  if (connection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection')
    return connection
  }

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGO_URI/MONGODB_URI is not defined in environment variables')
  }

  try {
    console.log('Establishing new MongoDB connection...')
    
    connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1, // Vercel serverless: single connection pool
      minPoolSize: 0, // Important for serverless
      family: 4 // Use IPv4 (some MongoDB Atlas issues with IPv6)
    })

    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected successfully')
    }

    return connection
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    connection = null
    throw error
  }
}

export default connectDB
