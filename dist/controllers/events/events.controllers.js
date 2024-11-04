"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allEvents = exports.createEvent = void 0;
const users_models_1 = __importDefault(require("../../models/users/users.models"));
const convertNames_services_1 = require("../../services/convertNa/convertNames.services");
const events_models_1 = __importDefault(require("../../models/events/events.models"));
const checkAttendees_services_1 = require("../../services/checkAttendees/checkAttendees.services");
const attendeesList_services_1 = require("../../services/attendeesList/attendeesList.services");
// import { eventQuery } from '../../services/interfaces/fetchEvents.interfaces';
const searchQuery_services_1 = require("../../services/searchQuery/searchQuery.services");
const createEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if the user is authenticated
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({
                status: 'failure',
                message: 'Unauthorized. User must be logged in to create an event.'
            });
        }
        // Destructure the validated values
        const { title, description, date, location, capacity, attendees } = req.body;
        const createdBy = req.user._id;
        // Fetch the user to ensure they exist
        const user = yield users_models_1.default.findById(createdBy);
        if (!user) {
            return res.status(404).json({
                status: 'failure',
                message: "User doesn't exist"
            });
        }
        // Convert the title to a unique format if needed
        const eventTitle = yield (0, convertNames_services_1.convertNames)(title);
        // Check if the user has already registered an event with the same title
        const existingEvent = yield events_models_1.default.findOne({
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
        const { validAttendees, adjustedCapacity } = yield (0, checkAttendees_services_1.checkAttendeesAndCapacity)(attendees, capacity);
        // Create and save the event
        const newEvent = yield events_models_1.default.create({
            title: eventTitle,
            description,
            date: eventDate,
            location,
            capacity: adjustedCapacity,
            createdBy: user._id
        });
        // Cast _id to string if needed
        const eventId = newEvent._id.toString();
        // Save valid attendees to the Attendee model
        yield (0, attendeesList_services_1.insertAttendees)(validAttendees, eventId);
        // Retrieve the attendees for the created event
        const attendeesList = yield (0, attendeesList_services_1.attendeeList)(eventId);
        // Respond with the created event and attendees
        res.status(201).json({
            status: 'success',
            message: 'Event created successfully',
            event: newEvent,
            attendees: attendeesList.map((att) => att.user_id) // Return attendee user IDs
        });
    }
    catch (err) {
        console.error('Error creating event:', err);
        // Handle known error types
        return res.status(500).json({
            status: 'failure',
            message: err instanceof Error ? err.message : 'An unknown error occurred'
        });
    }
});
exports.createEvent = createEvent;
const allEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get query parameters for pagination and search
        const { page = '1', limit = '2', title, date, location, capacity } = req.query;
        // Convert pagination parameters to numbers
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        // Build the query object for search
        const searchQuery = yield (0, searchQuery_services_1.query)(title, date, location, capacity);
        // Find the events with pagination and search
        const events = yield events_models_1.default.find(searchQuery)
            .skip((pageNumber - 1) * pageSize) // Skip the number of documents based on the page
            .limit(pageSize); // Limit the number of documents per page
        // Return the response with pagination and events
        res.status(200).json({
            status: 'success',
            page: pageNumber,
            events
        });
    }
    catch (err) {
        console.error('Error retrieving events:', err);
        // Handle known error types
        return res.status(500).json({
            status: 'failure',
            message: err instanceof Error ? err.message : 'An unknown error occurred'
        });
    }
});
exports.allEvents = allEvents;
