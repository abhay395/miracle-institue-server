import jwt from "jsonwebtoken";
import ApiError from "../utils/BaseError.js";
import User from "../models/User.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "Your Secret Secret Key";

const authenticationMiddleware = async (req, res, next) => {
  try {
    // Accept both lowercase and uppercase header keys
    const authorization = req.headers["authorization"] || req.headers["Authorization"];
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new ApiError(401, "Authorization header missing or malformed"));
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return next(new ApiError(401, "Token not provided"));
    }

    let verified;
    try {
      verified = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return next(new ApiError(401, "Invalid or expired token"));
    }

    if (!verified?._id) {
      return next(new ApiError(401, "Token payload invalid"));
    }

    const user = await User.findById(verified._id);
    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    // Optionally check if user is active
    if (user.isActive === false) {
      return next(new ApiError(403, "User is not active"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(500, "Authentication error"));
  }
};

export const authorizedRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied"));
    }
    next();
  };
};

export default authenticationMiddleware;
