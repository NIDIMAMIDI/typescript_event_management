import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../../models/users/users.models';
import { verifyToken } from '../../services/jwt/jwt.services';

// Define the structure of the request with user property
interface AuthenticatedRequest extends Request {
  user?: IUser | undefined; // You can replace 'any' with your User type if available
}

// Authorization Middleware
export const authorization = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Initialize token
    let token: string | undefined;

    // Extract token from the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token is provided
    if (!token) {
      return res.status(400).json({
        status: 'failure',
        message:
          'You are not logged in (or) Bearer Token is not provided. Please check it.'
      });
    }

    // Verify the token using the helper function
    const decoded = await verifyToken(token, process.env.JWT_SECRET_KEY as string);
    // console.log(decoded);

    // Check if user exists based on the decoded token id
    const user = await User.findById(decoded.id);

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
  } catch (err) {
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
};
