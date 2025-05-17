import express from 'express'

import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { addToy, addToyMsg, getToyById, getToys, removeToy, removeToyMsg, updateToy } from './toy.controller.js'
import { log } from '../../middlewares/logger.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:toyId', getToyById)
toyRoutes.post('/', requireAuth, requireAdmin, addToy)
toyRoutes.put('/:toyId', requireAuth, requireAdmin, updateToy)
toyRoutes.delete('/:toyId', requireAuth, requireAdmin, removeToy)

toyRoutes.post('/:toyId/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:toyId/msg/:msgId', requireAuth, removeToyMsg)
