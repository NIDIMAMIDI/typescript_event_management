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
exports.userLoginValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const validations_services_1 = require("../../services/validations/validations.services");
// Middleware function for validating user registration input
const userLoginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define a Joi validation schema for user input
        const schema = joi_1.default.object({
            // Email field: must be a valid email address and is required
            email: joi_1.default.string().email().required(),
            // Password field: must be a string that matches the specified regex pattern and is required
            password: joi_1.default.string()
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%])[A-Za-z\d@#%]{8,50}$/)
                .required()
                .messages({
                'string.pattern.base': 'Password must be of length 8 - 15, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, %)'
            })
        });
        // Validate the request body against the defined schema
        const { error } = yield (0, validations_services_1.validateSchema)(schema, req.body);
        // If there are validation errors, send a response with status 400 (Bad Request)
        if (error) {
            res.status(400).json({
                status: 'failure',
                message: error.details[0].message
            });
            return;
        }
        // Proceed to the next middleware if validation is successful
        next();
    }
    catch (err) {
        // Handle unexpected errors
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during validation'
        });
    }
});
exports.userLoginValidation = userLoginValidation;
