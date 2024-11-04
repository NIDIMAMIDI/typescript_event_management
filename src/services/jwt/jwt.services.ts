import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../../models/users/users.models';

// Create the JWT token using payload, secret key, and expiry date
const signToken = (user: IUser): string => {
  // Payload with user data
  const payload = { id: user._id, email: user.email, username: user.username };

  // JWT secret key
  const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
  if (!jwtSecretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
  }

  // Expiry time for JWT
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // Default to 1 hour if not specified

  // Return the signed token
  return jwt.sign(payload, jwtSecretKey, { expiresIn });
};

// Create and return token along with cookie options
export const createToken = async (
  user: IUser
): Promise<{ token: string; cookieOptions: Record<string, unknown> }> => {
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
};

// import { JwtPayload } from 'jsonwebtoken';

export const verifyToken = async (
  token: string,
  secretKey: string
): Promise<JwtPayload> => {
  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err || !decoded) {
        return reject(new Error('Token verification failed'));
      }
      resolve(decoded as JwtPayload);
    });
  });
};

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
