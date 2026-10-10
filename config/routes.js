import express from 'express'
import messagesRouter from '../routes/messages.js'

const router = express.Router()

router.use('/api/v1/messages', messagesRouter)

export default router