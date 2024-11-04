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
exports.query = void 0;
const query = (title, date, location, capacity) => __awaiter(void 0, void 0, void 0, function* () {
    const searchQuery = {};
    if (title) {
        searchQuery.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }
    if (date) {
        searchQuery.date = new Date(date);
    }
    if (location) {
        searchQuery.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }
    if (capacity) {
        searchQuery.capacity = capacity;
    }
    return searchQuery;
});
exports.query = query;
