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
exports.checkAttendeesAndCapacity = void 0;
const users_models_1 = __importDefault(require("../../models/users/users.models"));
const checkAttendeesAndCapacity = (attendees, capacity) => __awaiter(void 0, void 0, void 0, function* () {
    let validAttendees = [];
    let adjustedCapacity = capacity;
    if (attendees && attendees.length > 0) {
        const validAttendeesList = yield users_models_1.default.find({ _id: { $in: attendees } });
        validAttendees = validAttendeesList.map((user) => user._id.toString());
        if (validAttendees.length > capacity) {
            throw new Error(`Number of valid attendees (${validAttendees.length}) exceeds the event capacity (${capacity})`);
        }
        adjustedCapacity = capacity - validAttendees.length;
    }
    return { validAttendees, adjustedCapacity };
});
exports.checkAttendeesAndCapacity = checkAttendeesAndCapacity;
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
