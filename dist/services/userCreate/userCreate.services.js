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
exports.createNewUser = void 0;
const users_models_1 = __importDefault(require("../../models/users/users.models"));
const jwt_services_1 = require("../../services/jwt/jwt.services");
const createNewUser = (email, username, hashedPassword, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new user document in the database
    const newUser = yield users_models_1.default.create({
        email,
        password: hashedPassword,
        username
    });
    // Generate JWT token and cookie options for the newly registered user
    const { token, cookieOptions } = yield (0, jwt_services_1.createToken)(newUser);
    // Store the generated token in the user document
    yield users_models_1.default.findByIdAndUpdate(newUser._id, { token });
    // Fetch the user details (excluding password)
    const user = (yield users_models_1.default.findById(newUser._id).select('-password'));
    // Set the JWT token as a cookie in the response
    res.cookie('jwt', token, cookieOptions);
    return user;
});
exports.createNewUser = createNewUser;
