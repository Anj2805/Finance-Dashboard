import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { getDashboardSummary, getDashboardCategories, getDashboardTrends } from '../controllers/dashboardController.js'

const router = Router()

router.use(authenticate, authorize('admin', 'analyst', 'viewer'))

router.get('/summary', getDashboardSummary)
router.get('/categories', getDashboardCategories)
router.get('/trends', getDashboardTrends)

export default router
