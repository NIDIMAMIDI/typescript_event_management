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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogOut = exports.userSignIn = exports.userSignUp = void 0;
const bcrypt_services_1 = require("../../services/bcrypt/bcrypt.services");
const users_models_1 = __importDefault(require("../../models/users/users.models"));
const userCreate_services_1 = require("../../services/userCreate/userCreate.services");
const jwt_services_1 = require("../../services/jwt/jwt.services");
//  SignUp Functionality
const userSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extracting registration fields from the request body
        const { username, email, password } = req.body;
        // Convert email to lowercase for case-insensitive comparison
        const loweredEmail = email.toLowerCase();
        // Check if the user already exists
        const existingUser = yield users_models_1.default.findOne({ email: loweredEmail });
        if (existingUser) {
            return res.status(400).json({
                status: 'failure',
                message: `User with email ${loweredEmail} already exists`
            });
        }
        // Hash the password before saving the user
        const hashedPassword = yield (0, bcrypt_services_1.hashPassword)(password, 12);
        // Use the service to create a new user, generate a token, and set a cookie
        const user = yield (0, userCreate_services_1.createNewUser)(loweredEmail, username, hashedPassword, res);
        if (!user) {
            return res.status(500).json({
                status: 'failure',
                message: 'Failed to create user'
            });
        }
        // Send a success response with user details
        return res.status(201).json({
            status: 'success',
            message: `${username}'s registration successful`,
            userDetails: user
        });
    }
    catch (err) {
        // Handle any unexpected errors
        if (err instanceof Error) {
            return res.status(500).json({
                status: 'failure',
                message: err.message
            });
        }
        return res.status(500).json({
            status: 'failure',
            message: 'An unknown error occurred'
        });
    }
});
exports.userSignUp = userSignUp;
// SignIn Functionality
// SignIn Functionality
const userSignIn = (req, // Define the expected request body shape
res, // Define the expected response shape
next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Convert email to lowercase for case-insensitive comparison
        const loweredEmail = email.toLowerCase();
        // Check if the user exists
        const existingUser = yield users_models_1.default.findOne({ email: loweredEmail });
        if (!existingUser) {
            return res.status(404).json({
                status: 'failure',
                message: `User with ${loweredEmail} doesn't exist`
            });
        }
        // Check if the password is correct
        const isPasswordCorrect = yield (0, bcrypt_services_1.passwordChecking)(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'failure',
                message: 'Invalid Password'
            });
        }
        // Fetching JWT token and cookie options
        const { token, cookieOptions } = yield (0, jwt_services_1.createToken)(existingUser);
        // Store the generated token in the User model
        yield users_models_1.default.findByIdAndUpdate(existingUser._id, { token });
        // Setting token as a cookie
        res.cookie('jwt', token, cookieOptions);
        // Fetch the user document from the database
        const user = yield users_models_1.default.findById(existingUser._id);
        // Ensure user is not null before attempting to destructure
        if (user) {
            // Destructure the user object to exclude sensitive data
            const _a = user.toObject(), { password: pwd, createdAt, updatedAt } = _a, other = __rest(_a, ["password", "createdAt", "updatedAt"]); // Use toObject() here
            // Success response
            res.status(200).json({
                status: 'success',
                message: `User ${existingUser.username}'s Login Successful`,
                userDetails: other
            });
        }
        else {
            // Handle the case where the user is not found (shouldn't happen here, but for safety)
            return res.status(404).json({
                status: 'failure',
                message: 'User not found'
            });
        }
    }
    catch (err) {
        // Handle errors
        if (err instanceof Error) {
            return res.status(500).json({
                status: 'failure',
                message: err.message
            });
        }
        return res.status(500).json({
            status: 'failure',
            message: 'An unknown error occurred'
        });
    }
});
exports.userSignIn = userSignIn;
// User SignOut Functionality
const userLogOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // Find the user by ID in the database
        const userDetails = yield users_models_1.default.findById(user._id); // Using _id for MongoDB
        if (!userDetails) {
            return res.status(404).json({
                status: 'failure',
                message: 'User not found'
            });
        }
        // Clear the token in the database
        userDetails.token = null;
        yield userDetails.save();
        // Clear the JWT cookie by setting it to an expired date
        res.cookie('jwt', '', {
            expires: new Date(0), // Expire the cookie
            httpOnly: true // Ensures the cookie is accessible only by the web server
        });
        // Send a successful response
        res.status(200).json({
            status: 'success',
            message: `${userDetails.username} logged out successfully`
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                status: 'failure',
                message: err.message
            });
        }
        return res.status(500).json({
            status: 'failure',
            message: 'An unknown error occurred'
        });
    }
});
exports.userLogOut = userLogOut;
