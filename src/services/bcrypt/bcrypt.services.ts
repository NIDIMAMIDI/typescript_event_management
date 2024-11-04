import * as bcrypt from 'bcrypt';

// Converting the plain password into a hashed password by hashing
export const hashPassword = async (password: string, saltRounds: number): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

// Checking or comparing whether the plainTextPassword and hashedPassword are the same
export const passwordChecking = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
