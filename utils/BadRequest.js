// const httpStatusCodes = require('./httpStatusCodes')
import httpStatusCodes from "./httpStatusCodes.js"
import BaseError from "./BaseError.js"

class BadRequestError extends BaseError {
    constructor(
        name,
        statusCode = httpStatusCodes.BAD_REQUEST,
        description = 'Bad request',
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}
export default Api404Error