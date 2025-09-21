import express from 'express'
import AuthController from '../controller/Auth.controller.js'
import asyncWrapper from '../middleware/asyncHandler.js'
const authRoute = express.Router()


authRoute.post('/signup', asyncWrapper(AuthController.signupUser))
authRoute.post('/login', asyncWrapper(AuthController.loginUser))

export default authRoute