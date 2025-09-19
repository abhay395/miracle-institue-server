import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import './db/connectdb.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// app.use('/api/users', userRoutes)
app.get('/', (req, res) => {
    res.send('API is running...')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

