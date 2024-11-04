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
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendeeList = exports.insertAttendees = void 0;
const attendee_models_1 = require("../../models/attendee/attendee.models");
const insertAttendees = (validAttendees, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (validAttendees.length > 0) {
        yield attendee_models_1.Attendee.insertMany(validAttendees.map((attendeeId) => ({
            event_id: id,
            user_id: attendeeId
        })));
    }
});
exports.insertAttendees = insertAttendees;
const attendeeList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const attendeesList = yield attendee_models_1.Attendee.find({ event_id: id }).populate('user_id', 'username');
    return attendeesList;
});
exports.attendeeList = attendeeList;
