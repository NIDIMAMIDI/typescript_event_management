"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const users_models_1 = __importDefault(require("../../models/users/users.models"));
const jwt_services_1 = require("../../services/jwt/jwt.services");
// Authorization Middleware
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize token
        let token;
        // Extract token from the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check if token is provided
        if (!token) {
            return res.status(400).json({
                status: 'failure',
                message: 'You are not logged in (or) Bearer Token is not provided. Please check it.'
            });
        }
        // Verify the token using the helper function
        const decoded = yield (0, jwt_services_1.verifyToken)(token, process.env.JWT_SECRET_KEY);
        // console.log(decoded);
        // Check if user exists based on the decoded token id
        const user = yield users_models_1.default.findById(decoded.id);
        // If user does not exist, throw an error response
        if (!user) {
            return res.status(401).json({
                status: 'failure',
                message: 'The user associated with this token no longer exists.'
            });
        }
        // Assign the authenticated user to the request object
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (err) {
        // Handle token expiration error
        if (err instanceof Error && err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'failure',
                message: 'Token expired! Please log in again to get access.'
            });
        }
        // Handle other verification errors
        return res.status(500).json({
            status: 'failure',
            message: 'Failed to authenticate token.'
        });
    }
});
exports.authorization = authorization;
