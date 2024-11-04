import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../../models/users/users.models';
import mongoose from 'mongoose';
import { convertNames } from '../../services/convertNa/convertNames.services';
import Event, { IEvent } from '../../models/events/events.models';
import {
  checkAttendeesAndCapacity,
  CheckAttendeesResult
} from '../../services/checkAttendees/checkAttendees.services';
import {
  attendeeList,
  insertAttendees
} from '../../services/attendeesList/attendeesList.services';
import { CreateEventBody } from '../../services/interfaces/user.signup.interfaces';
import { query } from '../../services/searchQuery/searchQuery.services';
import { eventQueryString } from '../../services/interfaces/query.interfaces';

export const createEvent = async (
  req: Request<{}, {}, CreateEventBody> & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({
        status: 'failure',
        message: 'Unauthorized. User must be logged in to create an event.'
      });
    }

    // Destructure the validated values
    const { title, description, date, location, capacity, attendees } = req.body;
    const createdBy: mongoose.Types.ObjectId = req.user._id;

    // Fetch the user to ensure they exist
    const user: IUser | null = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({
        status: 'failure',
        message: "User doesn't exist"
      });
    }

    // Convert the title to a unique format if needed
    const eventTitle: string = await convertNames(title);

    // Check if the user has already registered an event with the same title
    const existingEvent: IEvent | null = await Event.findOne({
      title: eventTitle,
      createdBy: user._id
    });

    if (existingEvent) {
      return res.status(400).json({
        status: 'failure',
        message: 'You have already registered an event with this title'
      });
    }

    // Convert the string date to a JavaScript Date object
    const eventDate = new Date(date);

    // Initialize variables for attendees validation
    const { validAttendees, adjustedCapacity }: CheckAttendeesResult =
      await checkAttendeesAndCapacity(attendees, capacity);

    // Create and save the event
    const newEvent: IEvent = await Event.create({
      title: eventTitle,
      description,
      date: eventDate,
      location,
      capacity: adjustedCapacity,
      createdBy: user._id
    });

    // Cast _id to string if needed
    const eventId: string = newEvent._id.toString();

    // Save valid attendees to the Attendee model
    await insertAttendees(validAttendees, eventId);

    // Retrieve the attendees for the created event
    const attendeesList = await attendeeList(eventId);

    // Respond with the created event and attendees
    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      event: newEvent,
      attendees: attendeesList.map((att) => att.user_id) // Return attendee user IDs
    });
  } catch (err: unknown) {
    console.error('Error creating event:', err);

    // Handle known error types
    return res.status(500).json({
      status: 'failure',
      message: err instanceof Error ? err.message : 'An unknown error occurred'
    });
  }
};

export const allEvents = async (
  req: Request<{}, {}, {}, eventQueryString>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get query parameters for pagination and search
    const { page = '1', limit = '2', title, date, location, capacity } = req.query;

    // Convert pagination parameters to numbers
    const pageNumber: number = parseInt(page, 10);
    const pageSize: number = parseInt(limit, 10);

    // Build the query object for search
    const searchQuery = await query(title, date, location, capacity);

    // Find the events with pagination and search
    const events = await Event.find(searchQuery)
      .skip((pageNumber - 1) * pageSize) // Skip the number of documents based on the page
      .limit(pageSize); // Limit the number of documents per page

    // Return the response with pagination and events
    res.status(200).json({
      status: 'success',
      page: pageNumber,
      events
    });
  } catch (err: unknown) {
    console.error('Error retrieving events:', err);

    // Handle known error types
    return res.status(500).json({
      status: 'failure',
      message: err instanceof Error ? err.message : 'An unknown error occurred'
    });
  }
};
