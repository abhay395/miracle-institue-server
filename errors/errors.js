import BaseError from "./BaseError.js";
import httpStatusCodes from "./httpStatusCodes.js";

class Api400Error extends BaseError {
    constructor(
        name = 'Api400Error',
        description = 'Bad request.',
        isOperational = true
    ) {
        super(name, httpStatusCodes.BAD_REQUEST, isOperational, description);
    }
}

class Api401Error extends BaseError {
    constructor(
        name = 'Api401Error',
        description = 'Unauthorized.',
        isOperational = true
    ) {
        super(name, httpStatusCodes.UNAUTHORIZED, isOperational, description);
    }
}
class Api403Error extends BaseError {
    constructor(
        name = 'Api403Error',
        description = 'Forbidden.',
        isOperational = true
    ) {
        super(name, httpStatusCodes.FORBIDDEN, isOperational, description);
    }
}

class Api404Error extends BaseError {
    constructor(
        name = 'Api404Error',
        description = 'Not found.',
        isOperational = true
    ) {
        super(name, httpStatusCodes.NOT_FOUND, isOperational, description);
    }
}

class Api500Error extends BaseError {
    constructor(
        name = 'Api500Error',
        description = 'Internal server error.',
        isOperational = true
    ) {
        super(name, httpStatusCodes.INTERNAL_SERVER_ERROR, isOperational, description);
    }
}
export { Api400Error, Api401Error, Api403Error, Api404Error, Api500Error };
