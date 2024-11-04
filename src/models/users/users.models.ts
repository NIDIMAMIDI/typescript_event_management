import mongoose, { Schema, Document } from 'mongoose';

// Define the IUser interface which extends Mongoose's Document interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  token?: string | null; // Token field is optional, indicated by '?'
}

// Define the schema for the User model
const userSchema: Schema = new Schema(
  {
    // Username field: must be a string, required, and trimmed of whitespace
    username: {
      type: String,
      required: true,
      trim: true
    },
    // Email field: must be a string, required, unique, and trimmed of whitespace
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    // Password field: must be a string and is required
    password: {
      type: String,
      required: true
    },
    // Token field: must be a string, but is optional (not required)
    token: {
      type: String,
      default: null // Default value set to null to indicate that token can be absent
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

// Export the model using the IUser interface
export default mongoose.model<IUser>('User', userSchema);
