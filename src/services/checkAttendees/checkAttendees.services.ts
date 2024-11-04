import { Response } from 'express';
import User, { IUser } from '../../models/users/users.models';

export interface CheckAttendeesResult {
  validAttendees: string[];
  adjustedCapacity: number;
}

export const checkAttendeesAndCapacity = async (
  attendees: string[],
  capacity: number
): Promise<CheckAttendeesResult> => {
  let validAttendees: string[] = [];
  let adjustedCapacity = capacity;

  if (attendees && attendees.length > 0) {
    const validAttendeesList = await User.find({ _id: { $in: attendees } });

    validAttendees = validAttendeesList.map((user: IUser) => user._id.toString());

    if (validAttendees.length > capacity) {
      throw new Error(
        `Number of valid attendees (${validAttendees.length}) exceeds the event capacity (${capacity})`
      );
    }

    adjustedCapacity = capacity - validAttendees.length;
  }

  return { validAttendees, adjustedCapacity };
};

// export const checkAttendeesAndCapacity = async (
//   attendees: string[] | undefined,
//   capacity: number,
//   res: Response
// ): Promise<CheckAttendeesResult | Response> => {
//   let validAttendees: string[] = [];
//   let adjustedCapacity: number = capacity;

//   if (attendees && attendees.length > 0) {
//     // Find valid attendees from the User model
//     const validAttendeesList: IUser[] = await User.find({
//       _id: { $in: attendees }
//     });

//     // Map valid users to their ids
//     validAttendees = validAttendeesList.map((user: IUser) => user._id.toString());

//     // Check if the number of valid attendees exceeds the event capacity
//     if (validAttendees.length > capacity) {
//       return res.status(400).json({
//         status: 'failure',
//         message: `Number of valid attendees (${validAttendees.length}) exceeds the event capacity (${capacity})`
//       });
//     }

//     // Adjust the capacity by subtracting the number of valid attendees
//     adjustedCapacity = capacity - validAttendees.length;
//   }

//   return { validAttendees, adjustedCapacity };
// };
