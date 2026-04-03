import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLES, STATUS } from '../utils/constants.js'

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VIEWER
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status
  }
}

const User = mongoose.model('User', userSchema)

export default User
