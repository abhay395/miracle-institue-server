import AuthService from "../service/Auth.service.js"
import { sendSuccessMessage } from '../utils/helper.js'
export default {
    signupUser: async (req, res) => {
        const result = await AuthService.signupUser(req.body)
        sendSuccessMessage(res, 201, "Otp sent successfully", result)
    },
    loginUser: async (req, res) => {
        const result = await AuthService.loginUser(req.body)
        sendSuccessMessage(res, 200, "Login successful", result)
    },
    sendOtp: async (req, res) => {
        const result = await AuthService.sendOtp(req.body.userId)
        sendSuccessMessage(res, 200, "Otp sent successfully", result)
    },
    otpVerification: async (req, res) => {
        const result = await AuthService.otpVerification(req.body)
        sendSuccessMessage(res, 200, 'Otp Verified successfully', result)
    }
}