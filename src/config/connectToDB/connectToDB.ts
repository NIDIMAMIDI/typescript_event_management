import mongoose from 'mongoose';

export const connectToDB = async (): Promise<void> => {
  try {
    const mongodb_url: string | undefined = process.env.DATABASE;

    if (!mongodb_url) {
      throw new Error(
        'MongoDB connection string is not defined in environment variables'
      );
    }

    await mongoose.connect(mongodb_url);
    console.log('Connected to MongoDB successfully!');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error connecting to MongoDB:', err.message);
    } else {
      console.error('Unknown error occurred during MongoDB connection:', err);
    }
  }
};
