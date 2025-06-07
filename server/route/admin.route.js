import express from 'express'
import { verifyAdmin } from '../middleware/auth.middleware.js'

import { createAdmin, loginAdmin, getUsers, verifyUserCode } from '../controllers/admin.controller.js'

const router = express.Router()

router.post('/create', createAdmin)
router.post('/login', loginAdmin) 
router.get('/get-users', verifyAdmin, getUsers)
router.post('/verify-code', verifyAdmin, verifyUserCode)

export default router;