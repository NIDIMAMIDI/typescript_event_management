import Joi, { ValidationResult, Schema } from 'joi';

interface ValidationResponse<T> {
  value: T;
  error?: Joi.ValidationError;
}

export const validateSchema = <T>(schema: Schema, data: T): ValidationResponse<T> => {
  // Validate the data against the provided schema
  const { value, error }: ValidationResult<T> = schema.validate(data, {
    // Options to handle validation errors
    abortEarly: false, // Collect all errors rather than stopping at the first error
    allowUnknown: true // Allow properties not defined in the schema
  });

  // Return both the validated value and the error object (if any)
  return { value, error };
};
