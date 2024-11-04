import { Response } from 'express';
import User, { IUser } from '../../models/users/users.models';
import { createToken } from '../../services/jwt/jwt.services';
import { Document } from 'mongoose';

// Define a type for the return value, which excludes the password
export type UserWithoutPassword = Omit<IUser & Document, 'password'>;

export const createNewUser = async (
  email: string,
  username: string,
  hashedPassword: string,
  res: Response
): Promise<UserWithoutPassword | null> => {
  // Create a new user document in the database
  const newUser = await User.create({
    email,
    password: hashedPassword,
    username
  });

  // Generate JWT token and cookie options for the newly registered user
  const { token, cookieOptions } = await createToken(newUser);

  // Store the generated token in the user document
  await User.findByIdAndUpdate(newUser._id, { token });

  // Fetch the user details (excluding password)
  const user = (await User.findById(newUser._id).select(
    '-password'
  )) as UserWithoutPassword | null;

  // Set the JWT token as a cookie in the response
  res.cookie('jwt', token, cookieOptions);

  return user;
};
