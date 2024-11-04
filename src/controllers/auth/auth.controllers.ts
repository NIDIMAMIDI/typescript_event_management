import { Request, Response, NextFunction } from 'express';
import { hashPassword, passwordChecking } from '../../services/bcrypt/bcrypt.services';
import User, { IUser } from '../../models/users/users.models';
import {
  createNewUser,
  UserWithoutPassword
} from '../../services/userCreate/userCreate.services';
import { createToken } from '../../services/jwt/jwt.services';

//  SignUp Functionality

export const userSignUp = async (
  req: Request<{ username: string; email: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extracting registration fields from the request body
    const { username, email, password } = req.body;

    // Convert email to lowercase for case-insensitive comparison
    const loweredEmail: string = email.toLowerCase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: loweredEmail });

    if (existingUser) {
      return res.status(400).json({
        status: 'failure',
        message: `User with email ${loweredEmail} already exists`
      });
    }

    // Hash the password before saving the user
    const hashedPassword = await hashPassword(password, 12);

    // Use the service to create a new user, generate a token, and set a cookie
    const user: UserWithoutPassword | null = await createNewUser(
      loweredEmail,
      username,
      hashedPassword,
      res
    );

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
  } catch (err: unknown) {
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
};

// SignIn Functionality

// SignIn Functionality
export const userSignIn = async (
  req: Request<{ email: string; password: string }>, // Define the expected request body shape
  res: Response, // Define the expected response shape
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Convert email to lowercase for case-insensitive comparison
    const loweredEmail: string = email.toLowerCase();

    // Check if the user exists
    const existingUser: IUser | null = await User.findOne({ email: loweredEmail });
    if (!existingUser) {
      return res.status(404).json({
        status: 'failure',
        message: `User with ${loweredEmail} doesn't exist`
      });
    }

    // Check if the password is correct
    const isPasswordCorrect: boolean = await passwordChecking(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'failure',
        message: 'Invalid Password'
      });
    }

    // Fetching JWT token and cookie options
    const { token, cookieOptions } = await createToken(existingUser);

    // Store the generated token in the User model
    await User.findByIdAndUpdate(existingUser._id, { token });

    // Setting token as a cookie
    res.cookie('jwt', token, cookieOptions);

    // Fetch the user document from the database
    const user: IUser | null = await User.findById(existingUser._id);

    // Ensure user is not null before attempting to destructure
    if (user) {
      // Destructure the user object to exclude sensitive data
      const { password: pwd, createdAt, updatedAt, ...other } = user.toObject(); // Use toObject() here

      // Success response
      res.status(200).json({
        status: 'success',
        message: `User ${existingUser.username}'s Login Successful`,
        userDetails: other
      });
    } else {
      // Handle the case where the user is not found (shouldn't happen here, but for safety)
      return res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }
  } catch (err: unknown) {
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
};

// User SignOut Functionality

export const userLogOut = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUser = req.user as IUser;

    // Find the user by ID in the database
    const userDetails: IUser | null = await User.findById(user._id); // Using _id for MongoDB

    if (!userDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }

    // Clear the token in the database
    userDetails.token = null;
    await userDetails.save();

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
  } catch (err: unknown) {
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
};
