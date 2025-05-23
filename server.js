import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'
import { toyService } from './api/toy/toy.service.js'

import { loggerService } from './services/logger.service.js'

const app = express()

// App Configuration
app.use(cookieParser()) 
app.use(express.json()) 
app.set('query parser', 'extended') 

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'
import { userRoutes } from './api/user/user.routes.js'

app.use('/api/toy', toyRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.get('/*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
app.listen(port, async () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)

    try {
        const toys = await toyService.query({ fetchAll: true }) // 👈 הבאת כל הצעצועים
        console.log('📦 Toys in DB on startup:', toys) // 👈 הדפסה לקונסול
    } catch (err) {
        console.error('❌ Failed to fetch toys on startup:', err)
    }
})