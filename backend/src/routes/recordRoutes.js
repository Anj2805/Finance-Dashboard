import { Router } from 'express'
import {
  createRecordHandler,
  getRecordsHandler,
  getRecordHandler,
  updateRecordHandler,
  deleteRecordHandler
} from '../controllers/recordController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateRecordCreate, validateRecordUpdate } from '../middleware/validate.js'

const router = Router()

router.use(authenticate)

router
  .route('/')
  .post(authorize('admin'), validateRecordCreate, createRecordHandler)
  .get(authorize('admin', 'analyst'), getRecordsHandler)

router
  .route('/:id')
  .get(authorize('admin', 'analyst'), getRecordHandler)
  .put(authorize('admin'), validateRecordUpdate, updateRecordHandler)
  .delete(authorize('admin'), deleteRecordHandler)

export default router
