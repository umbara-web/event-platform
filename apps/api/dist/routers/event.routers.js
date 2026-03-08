"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const eventRouter = (0, express_1.Router)();
eventRouter.get('/', event_controller_1.getEventsController);
eventRouter.get('/:id', event_controller_1.getEventByIdController);
// Requires Authentication and ORGANIZER Role
eventRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleGuard)(['ORGANIZER']), event_controller_1.createEventController);
exports.default = eventRouter;
