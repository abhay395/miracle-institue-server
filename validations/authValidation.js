// middlewares/validators/userValidator.js
import Joi from 'joi';
import User from '../../models/user.js';
import { Api400Error } from '../errors/errors.js'
// Signup validation schema
const signupSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().optional().allow(null, ''),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow(''),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid("admin", "student", "superadmin").optional(),
}).custom(async (value, helpers) => {
    // Either email or phone must be provided
    if (!value.email && !value.phone) {
        return helpers.message('Either email or phone is required.');
    }

    // Check if email is taken
    if (value.email) {
        const emailTaken = await User.isEmailTaken(value.email);
        if (emailTaken) return helpers.message('Email already exists.');
    }

    // Check if phone is taken
    if (value.phone) {
        const phoneTaken = await User.isPhoneTaken(value.phone);
        if (phoneTaken) return helpers.message('Phone number already exists.');
    }

    // If signup with email, password is required
    if (value.email && !value.password) {
        return helpers.message('Password is required for email signup.');
    }

    return value;
});

// Login validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().optional().allow(null, ''),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow(''),
    password: Joi.string().required(),
}).custom((value, helpers) => {
    if (!value.email && !value.phone) {
        return helpers.message('Email or phone is required.');
    }
    return value;
});

// Phone login (OTP) validation schema
const phoneLoginSchema = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
});

// Middleware factory
export const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const errors = err.details.map(detail => detail.message).join(', ');
        next(new Api400Error('ValidationError', errors));
    }
};

// Export validators
export const validateSignup = validateBody(signupSchema);
export const validateLogin = validateBody(loginSchema);
export const validatePhoneLogin = validateBody(phoneLoginSchema);
