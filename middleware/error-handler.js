import { Api500Error } from "../errors/errors.js";
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            name: err.name,
            statusCode: err.statusCode,
            message: err.description
        });
    }

    // For unexpected errors
    const unexpectedError = new Api500Error('UnexpectedError', undefined, err.message);
    res.status(unexpectedError.statusCode).json({
        name: unexpectedError.name,
        statusCode: unexpectedError.statusCode,
        message: unexpectedError.description
    });
}

export default errorHandlerMiddleware