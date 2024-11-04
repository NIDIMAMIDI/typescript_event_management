"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const validations_services_1 = require("../../services/validations/validations.services");
// Middleware function for validating event creation input
const createEventValidation = (req, res, next) => {
    try {
        // Define a Joi validation schema for event input
        const schema = joi_1.default.object({
            title: joi_1.default.string().required().messages({
                'string.empty': 'Title is a required field.'
            }),
            description: joi_1.default.string().optional(),
            date: joi_1.default.date().iso().min('now').required().messages({
                'date.base': 'Date must be a valid date.',
                'date.format': 'Date must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).',
                'date.min': 'Date must be in the future.'
            }),
            location: joi_1.default.string().required().messages({
                'string.empty': 'Location is a required field.'
            }),
            capacity: joi_1.default.number().min(1).required().messages({
                'number.base': 'Capacity must be a valid number.',
                'number.min': 'Capacity must be at least 1.'
            }),
            attendees: joi_1.default.array().items(joi_1.default.string().optional()) // Attendees as an array of user IDs
        });
        // Validate the request body against the defined schema
        const { error } = (0, validations_services_1.validateSchema)(schema, req.body);
        // If there are validation errors, send a response with status 400 (Bad Request)
        if (error) {
            return res.status(400).json({
                status: 'failure',
                message: error.details[0].message
            });
        }
        // Proceed to the next middleware if validation is successful
        next();
    }
    catch (err) {
        // Handle unexpected errors
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during validation',
            error: err instanceof Error ? err.message : 'Unknown error' // Ensure err is of type Error
        });
    }
};
exports.createEventValidation = createEventValidation;
