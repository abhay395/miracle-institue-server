import mongoose from 'mongoose'
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false, default: null },
    isActive: { type: Boolean, default: false },
    password: { type: String, required: false },
    phone: { type: String, default: "" },
    platform: { type: String, default: "" },
    role: {
        type: String,
        enum: ["admin", "student", "superadmin"],
        default: "student"
    },
    isDeleted: { type: Boolean, default: false },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.statics.isEmailTaken = async function (email) {
    const user = await this.findOne({ email }).select('_id');
    return !!user;
};
userSchema.statics.isPhoneTaken = async function (phone) {
    const user = await this.findOne({ phone }).select('_id');
    return !!user;
};
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next();
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        return next();
    } catch (error) {
        return next(error);
    }
})
userSchema.pre('find', async function (next) {
    this.select('-password');
    next();
})
userSchema.pre('aggregate', async function (next) {
    this.pipeline().unshift({ $project: { password: 0 } });
    next();
})
const User = mongoose.model('User', userSchema);

export default User