import { StatusCodes } from 'http-status-codes'
import { successResponse } from '../utils/response.js'
import { createRecord, getRecords, getRecordById, updateRecord, softDeleteRecord } from '../services/recordService.js'

export const createRecordHandler = async (req, res, next) => {
  try {
    const { amount, type, category, date, note, userId } = req.body
    const record = await createRecord({
      userId: userId || req.user.id,
      amount,
      type,
      category,
      date,
      note
    })
    return successResponse(res, { record }, StatusCodes.CREATED)
  } catch (error) {
    next(error)
  }
}

export const getRecordsHandler = async (req, res, next) => {
  try {
    const data = await getRecords(req.query)
    return successResponse(res, data)
  } catch (error) {
    next(error)
  }
}

export const getRecordHandler = async (req, res, next) => {
  try {
    const record = await getRecordById(req.params.id)
    return successResponse(res, { record })
  } catch (error) {
    next(error)
  }
}

export const updateRecordHandler = async (req, res, next) => {
  try {
    const record = await updateRecord(req.params.id, req.body)
    return successResponse(res, { record })
  } catch (error) {
    next(error)
  }
}

export const deleteRecordHandler = async (req, res, next) => {
  try {
    await softDeleteRecord(req.params.id)
    return successResponse(res, { message: 'Record deleted' })
  } catch (error) {
    next(error)
  }
}
