import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Attendee document
export interface IAttendee extends Document {
  event_id: mongoose.Types.ObjectId; // Reference to the Event
  user_id: mongoose.Types.ObjectId; // Reference to the User
}

// Create the schema for the Attendee model
const attendeeSchema: Schema = new Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the Attendee model
export const Attendee = mongoose.model<IAttendee>('Attendee', attendeeSchema);
