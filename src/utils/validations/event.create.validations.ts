import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../../services/validations/validations.services';

// Middleware function for validating event creation input
export const createEventValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Define a Joi validation schema for event input
    const schema = Joi.object({
      title: Joi.string().required().messages({
        'string.empty': 'Title is a required field.'
      }),
      description: Joi.string().optional(),
      date: Joi.date().iso().min('now').required().messages({
        'date.base': 'Date must be a valid date.',
        'date.format': 'Date must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).',
        'date.min': 'Date must be in the future.'
      }),
      location: Joi.string().required().messages({
        'string.empty': 'Location is a required field.'
      }),
      capacity: Joi.number().min(1).required().messages({
        'number.base': 'Capacity must be a valid number.',
        'number.min': 'Capacity must be at least 1.'
      }),
      attendees: Joi.array().items(Joi.string().optional()) // Attendees as an array of user IDs
    });

    // Validate the request body against the defined schema
    const { error } = validateSchema(schema, req.body);

    // If there are validation errors, send a response with status 400 (Bad Request)
    if (error) {
      return res.status(400).json({
        status: 'failure',
        message: error.details[0].message
      });
    }

    // Proceed to the next middleware if validation is successful
    next();
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred during validation',
      error: err instanceof Error ? err.message : 'Unknown error' // Ensure err is of type Error
    });
  }
};
