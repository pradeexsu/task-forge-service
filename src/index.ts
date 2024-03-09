import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { apiRouts, authRouts } from './routes/routes.js'
import { logger } from '@utils/logger-config.js'

configDotenv()
const port = process.env.PORT || 3001

const app = express()
app.use(express.json())
    .use(cors())
    .use('/auth', authRouts)
    .use('/api', apiRouts)
    .listen(port, () => {
        logger.info({ message: `Task manager up and running at port: ${port}` })
    })
