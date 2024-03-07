import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import { authRout, unAuthRout } from './router.js'

configDotenv()
const port = process.env.PORT || 3001

const app = express()
app.use(express.json()).use(cors())
app.use('/auth', unAuthRout)
app.use('/api', authRout)

app.listen(port, () => {
    console.log(`Task manager up and running at port: ${port}`)
})
