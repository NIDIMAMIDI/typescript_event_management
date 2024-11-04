import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateSchema } from '../../services/validations/validations.services';

// Middleware function for validating user registration input
export const userRegistrationValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Define a Joi validation schema for user input
    const schema = Joi.object({
      // Username field: must be a string between 3 and 30 characters long and is required
      username: Joi.string().min(3).max(30).required(),

      // Email field: must be a valid email address and is required
      email: Joi.string().email().required(),

      // Password field: must be a string that matches the specified regex pattern and is required
      password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#%])[A-Za-z\d@#%]{8,50}$/)
        .required()
        .messages({
          'string.pattern.base':
            'Password must be of length 8 - 15, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, %)'
        }),

      // Confirm password field: must match the password field
      confirmPassword: Joi.string()
        .valid(Joi.ref('password')) // Ensures that confirmPassword matches the password field
        .required()
        .messages({ 'any.only': 'Passwords do not match' }),

      // Token field: optional, can be a string if provided
      token: Joi.string().optional()
    });

    // Validate the request body against the defined schema
    const { error } = await validateSchema(schema, req.body);

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
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred during validation'
    });
  }
};
