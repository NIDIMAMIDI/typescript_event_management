"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("./auth/auth.routes");
const events_routes_1 = require("./events/events.routes");
const indexRouter = (0, express_1.Router)();
indexRouter.use('/auth', auth_routes_1.authRouter);
indexRouter.use('/events', events_routes_1.eventRouter);
exports.default = indexRouter;
