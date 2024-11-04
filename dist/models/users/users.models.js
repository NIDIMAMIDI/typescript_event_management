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
// Define the schema for the User model
const userSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});
// Export the model using the IUser interface
exports.default = mongoose_1.default.model('User', userSchema);
