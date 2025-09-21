import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import './db/connectdb.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import router from './routes/index.routes.js'
import nodemailer from 'nodemailer';
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Route 
app.use('/api/v1', router);
// app.use('*', (req, res) => res.status(404).json({
//     description: 'URL does not exist'
// }))
let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, // use SSL
    auth: {
        user: 'abhayparja90@gmail.com',
        pass: 'vmsajvchgkadrxja'
    },
});
transporter.verify((error, success) => {
    if (error) console.log("SMTP Error:", error);
    else console.log("Server ready to send emails");
});
app.use(errorHandlerMiddleware)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

