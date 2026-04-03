import { successResponse } from '../utils/response.js'
import { getSummary, getCategoryBreakdown, getMonthlyTrends } from '../services/dashboardService.js'

export const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await getSummary()
    return successResponse(res, data)
  } catch (error) {
    next(error)
  }
}

export const getDashboardCategories = async (req, res, next) => {
  try {
    const data = await getCategoryBreakdown()
    return successResponse(res, data)
  } catch (error) {
    next(error)
  }
}

export const getDashboardTrends = async (req, res, next) => {
  try {
    const data = await getMonthlyTrends()
    return successResponse(res, data)
  } catch (error) {
    next(error)
  }
}
