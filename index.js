import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import './db/connectdb.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use(errorHandlerMiddleware)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

