import User from "../models/User.model.js"
import bcrypt from "bcrypt";
import { Api401Error } from "../errors/errors.js";
export default {
    signupUser: async (body) => {
        try {
            let user = new User(body)
            await user.save()
            const token = createToken(user)
            return token
        } catch (error) {
            throw error
        }
    },
    loginUser: async (body) => {
        try {
            const { email, phone, password } = body
            let user = null
            if (email) {
                user = await User.find({ email })
            } else {
                user = await User.find({ phone })
            }
            if (!user) throw new Api401Error('user-login-error', 'Invalid credentials');
            let passwordCheck = await bcrypt.compare(password, user.password)
            if (!passwordCheck) throw new Api401Error('user-login-error', 'Invalid credentials');
            return createToken(user)
        } catch (error) {
            throw error
        }
    },
    // otpVerification: async (otpId, otp) => {

    // }
}