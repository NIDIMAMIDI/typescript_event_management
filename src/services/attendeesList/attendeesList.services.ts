import { Response } from 'express';
import { Types } from 'mongoose';
import { Attendee } from '../../models/attendee/attendee.models';

// Define a type for the attendee
interface IAttendee {
  event_id: Types.ObjectId;
  user_id: Types.ObjectId;
}

export const insertAttendees = async (
  validAttendees: string[],
  id: string
): Promise<void> => {
  if (validAttendees.length > 0) {
    await Attendee.insertMany(
      validAttendees.map((attendeeId) => ({
        event_id: id,
        user_id: attendeeId
      }))
    );
  }
};

export const attendeeList = async (id: string): Promise<IAttendee[]> => {
  const attendeesList = await Attendee.find({ event_id: id }).populate(
    'user_id',
    'username'
  );

  return attendeesList as IAttendee[];
};
