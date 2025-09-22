import User from "../models/User.model.js"
import bcrypt from "bcrypt";
import { Api401Error } from "../errors/errors.js";
import Otp from "../models/Otp.model.js";
import sendMail from '../utils/sendMail.js'
import { CONSTANTS } from "../utils/constants.js";
import { createToken } from "../utils/helper.js";
export default {
    signupUser: async (body) => {
        try {
            let user = new User(body)
            await user.save()
            let RandomOtp = Math.random() * (9999 - 1000) + 1000
            RandomOtp = parseInt(RandomOtp)
            let otp = new Otp({ userId: user._id, otp: RandomOtp, expiredAt: new Date(Date.now() + 10 * 60 * 1000) })
            await otp.save()
            if (body.email) {
                let emailRequest = {
                    template: CONSTANTS.USERS.VERIFYOTP,
                    to: body.email,
                    data: {
                        otp: RandomOtp,
                        name: body.name,
                        email: body.email
                    }
                };
                await sendMail.mailSend(emailRequest)
            } else {
                throw new Api401Error('user-signup-error', 'Email is required for signup');
            }
            return { OtpId: otp._id }
        } catch (error) {
            throw error
        }
    },
    loginUser: async (body) => {
        try {
            const { email, phone, password } = body
            let user = null
            if (email) {
                user = await User.findOne({ email })
            } else {
                user = await User.findOne({ phone })
            }
            console.log(password, user.password)
            if (!user) throw new Api401Error('user-login-error', 'Invalid credentials');
            let passwordCheck = await bcrypt.compare(password, user.password)
            if (!passwordCheck) throw new Api401Error('user-login-error', 'Invalid credentials');
            let emailRequest = {
                template: CONSTANTS.USERS.WELCOME,
                to: user.email,
                data: {
                    name: user.name,
                    email: user.email,
                    studentId: user._id
                }
            };
            sendMail.mailSend(emailRequest)
            return createToken(user)
        } catch (error) {
            throw error
        }
    },
    sendOtp: async (userId) => {
        try {
            const user = await User.findById(userId)
            let RandomOtp = Math.random() * (9999 - 1000) + 1000
            RandomOtp = parseInt(RandomOtp)
            let otp = new Otp({ userId: user._id, otp: RandomOtp, expiredAt: new Date(Date.now() + 10 * 60 * 1000) })
            await otp.save()
            if (user.email) {
                let emailRequest = {
                    template: CONSTANTS.USERS.VERIFYOTP,
                    to: user.email,
                    data: {
                        otp: otp.otp,
                        name: user.name,
                        email: user.email
                    }
                };
                await sendMail.mailSend(emailRequest)
            } else {
                throw new Api401Error('user-signup-error', 'Email is required for signup');
            }
            return { OtpId: otp._id }
        } catch (error) {
            throw error
        }
    },
    otpVerification: async ({ OtpId, otp }) => {
        try {
            const otpRecord = await Otp.findById(OtpId)
            if (!otpRecord) throw new Api401Error('otp-verification-error', 'Invalid Otp');
            if (otpRecord.expiredAt < new Date()) throw new Api401Error('otp-verification-error', 'Otp expired');
            if (otpRecord.otp !== otp) throw new Api401Error('otp-verification-error', 'Invalid Otp');
            await Otp.findByIdAndDelete(OtpId)
            let user = await User.findById(otpRecord.userId)
            if (user.verified === false) {
                user.verified = true
                await user.save()
            }
            let emailRequest = {
                template: CONSTANTS.USERS.WELCOME,
                to: user.email,
                data: {
                    name: user.name,
                    email: user.email
                }
            };
            sendMail.mailSend(emailRequest)
            return { token: createToken(user) }
        } catch (error) {
            throw error
        }
    }
}