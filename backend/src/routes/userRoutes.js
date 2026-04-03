import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { getUsers, patchUserRole, patchUserStatus } from '../controllers/userController.js'
import { validateRoleUpdate, validateStatusUpdate } from '../middleware/validate.js'

const router = Router()

router.use(authenticate, authorize('admin'))

router.get('/', getUsers)
router.patch('/:id/role', validateRoleUpdate, patchUserRole)
router.patch('/:id/status', validateStatusUpdate, patchUserStatus)

export default router
