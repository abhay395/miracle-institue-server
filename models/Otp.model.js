import mongoose from "mongoose";

const optSchema = new mongoose.Schema({
    otp: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    expiredAt: {
        type: Date,
        required:true
    }

})

const Otp = mongoose.model('otps', optSchema)

export default Otp