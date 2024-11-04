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
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create the JWT token using payload, secret key, and expiry date
const signToken = (user) => {
    // Payload with user data
    const payload = { id: user._id, email: user.email, username: user.username };
    // JWT secret key
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
        throw new Error('JWT_SECRET_KEY is not defined in environment variables');
    }
    // Expiry time for JWT
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // Default to 1 hour if not specified
    // Return the signed token
    return jsonwebtoken_1.default.sign(payload, jwtSecretKey, { expiresIn });
};
// Create and return token along with cookie options
const createToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Creating the token
    const token = signToken(user);
    // Expiry for the cookie (convert JWT_COOKIE_EXPIRES_IN hours to milliseconds)
    const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 1; // Default to 1 hour if not specified
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresIn * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
    // Returning token and cookie options
    return { token, cookieOptions };
});
exports.createToken = createToken;
// import { JwtPayload } from 'jsonwebtoken';
const verifyToken = (token, secretKey) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
            if (err || !decoded) {
                return reject(new Error('Token verification failed'));
            }
            resolve(decoded);
        });
    });
});
exports.verifyToken = verifyToken;
// Verify token using the provided secret key
// export const verifyToken = async (
//   token: string,
//   secretKey: string
// ): Promise<JwtPayload | string> => {
//   return new Promise<JwtPayload | string>((resolve, reject) => {
//     jwt.verify(token, secretKey, (err, decoded) => {
//       if (err || !decoded) {
//         return reject(new Error('Token verification failed'));
//       }
//       resolve(decoded as JwtPayload | string);
//     });
//   });
// };
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { promisify } from 'util';
// import { IUser } from '../../models/users/users.models';
// // Create the JWT token using payload, secret key, and expiry date
// const signToken = (user: IUser): string => {
//   // Payload with user data
//   const payload = { id: user._id, email: user.email, username: user.username };
//   // JWT secret key
//   const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
//   if (!jwtSecretKey) {
//     throw new Error('JWT_SECRET_KEY is not defined in environment variables');
//   }
//   // Expiry time for JWT
//   const expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // Default to 1 hour if not specified
//   // Return the signed token
//   return jwt.sign(payload, jwtSecretKey, { expiresIn });
// };
// // Create and return token along with cookie options
// export const createToken = async (
//   user: IUser
// ): Promise<{ token: string; cookieOptions: Record<string, unknown> }> => {
//   // Creating the token
//   const token = signToken(user);
//   // Expiry for the cookie (convert JWT_COOKIE_EXPIRES_IN hours to milliseconds)
//   const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 1; // Default to 1 hour if not specified
//   const cookieOptions = {
//     expires: new Date(Date.now() + cookieExpiresIn * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production'
//   };
//   // Returning token and cookie options
//   return { token, cookieOptions };
// };
// // Verify token using the provided secret key
// export const verifyToken = async (
//   token: string,
//   secretKey: string
// ): Promise<JwtPayload | string> => {
//   try {
//     // Verifying JWT token with the secret key by wrapping jwt.verify in a Promise
//     const decoded = await new Promise<JwtPayload | string>((resolve, reject) => {
//       jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(decoded as JwtPayload | string);
//       });
//     });
//     return decoded;
//   } catch (err) {
//     throw new Error('Token verification failed');
//   }
// };
