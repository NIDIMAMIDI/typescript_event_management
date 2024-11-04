"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for the Event model
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true, // The title is required for each event
        trim: true, // Removes leading and trailing spaces
        lowercase: true, // Converts the title to lowercase
        unique: true // Ensures that the title is unique (no duplicate titles)
    },
    description: {
        type: String // An optional description for the event
    },
    date: {
        type: Date,
        required: true // Automatically sets the current date and time when the event is created
    },
    location: {
        type: String,
        trim: true,
        required: true // The location of the event is required
    },
    capacity: {
        type: Number,
        required: true // The capacity (max number of attendees) is required
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId, // References the User who created the event
        ref: 'User', // Points to the User collection
        required: true // The event must have a creator (User ID)
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});
// Define the Event model with the IEvent interface and eventSchema
const Event = mongoose_1.default.model('Event', eventSchema);
// Export the Event model for use in other parts of the application
exports.default = Event;
