import { StatusCodes } from 'http-status-codes'
import Record from '../models/Record.js'
import { assertObjectId } from '../utils/validators.js'

const buildFilters = ({ type, category, startDate, endDate, search }) => {
  const filters = { isDeleted: false }
  if (type && ['income', 'expense'].includes(type)) {
    filters.type = type
  }
  if (category) {
    filters.category = { $regex: new RegExp(category, 'i') }
  }
  if (search) {
    const regex = new RegExp(search, 'i')
    filters.$or = [{ category: regex }, { note: regex }]
  }
  if (startDate || endDate) {
    filters.date = {}
    if (startDate) {
      filters.date.$gte = new Date(startDate)
    }
    if (endDate) {
      filters.date.$lte = new Date(endDate)
    }
  }
  return filters
}

export const createRecord = async ({ userId, amount, type, category, date, note }) => {
  if (!amount || amount <= 0) {
    const error = new Error('Amount must be greater than zero')
    error.statusCode = StatusCodes.BAD_REQUEST
    throw error
  }
  const record = await Record.create({ userId, amount, type, category, date, note })
  return record
}

export const getRecords = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100)
  const skip = (page - 1) * limit
  const sortableFields = {
    date: 'date',
    amount: 'amount',
    createdAt: 'createdAt'
  }
  const sortField = sortableFields[query.sortBy] || 'date'
  const sortOrder = query.order === 'asc' ? 1 : -1

  const filters = buildFilters({
    type: query.type,
    category: query.category,
    startDate: query.startDate,
    endDate: query.endDate,
    search: query.search
  })

  const [records, total] = await Promise.all([
    Record.find(filters)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit),
    Record.countDocuments(filters)
  ])

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  }
}

export const getRecordById = async (id) => {
  assertObjectId(id, 'record id')
  const record = await Record.findOne({ _id: id, isDeleted: false })
  if (!record) {
    const error = new Error('Record not found')
    error.statusCode = StatusCodes.NOT_FOUND
    throw error
  }
  return record
}

export const updateRecord = async (id, payload) => {
  assertObjectId(id, 'record id')
  if (payload.amount !== undefined && payload.amount <= 0) {
    const error = new Error('Amount must be greater than zero')
    error.statusCode = StatusCodes.BAD_REQUEST
    throw error
  }
  const record = await Record.findOneAndUpdate({ _id: id, isDeleted: false }, payload, { new: true, runValidators: true })
  if (!record) {
    const error = new Error('Record not found')
    error.statusCode = StatusCodes.NOT_FOUND
    throw error
  }
  return record
}

export const softDeleteRecord = async (id) => {
  assertObjectId(id, 'record id')
  const record = await Record.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true })
  if (!record) {
    const error = new Error('Record not found')
    error.statusCode = StatusCodes.NOT_FOUND
    throw error
  }
  return record
}
