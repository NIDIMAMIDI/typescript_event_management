"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const connectToDB_1 = require("./config/connectToDB/connectToDB");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 7777; // Use lowercase number for type annotation
app.use(express_1.default.json());
app.use('/api', index_routes_1.default);
app.get('/', (req, res, next) => {
    res.send('Bismillah');
});
const server = app.listen(port, () => {
    console.log(`Server has started at port ${port}`);
    (0, connectToDB_1.connectToDB)();
});
