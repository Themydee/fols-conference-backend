import express from 'express'
import { verifyAdmin } from '../middleware/auth.middleware.js'

import { createAdmin, loginAdmin, getUsers } from '../controllers/admin.controller.js'

const router = express.Router()

router.post('/create', createAdmin)
router.post('/login', loginAdmin) 
router.post('/get-users', verifyAdmin, getUsers)

export default router;