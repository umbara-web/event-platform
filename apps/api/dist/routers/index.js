"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routers_1 = __importDefault(require("../routers/auth.routers"));
const event_routers_1 = __importDefault(require("../routers/event.routers"));
const ticket_routers_1 = __importDefault(require("../routers/ticket.routers"));
const registration_routers_1 = __importDefault(require("../routers/registration.routers"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routers_1.default);
router.use('/events', event_routers_1.default);
// Nested routes for tickets and registration handled by event router
event_routers_1.default.use('/:eventId/tickets', ticket_routers_1.default);
event_routers_1.default.use('/:eventId/register', registration_routers_1.default);
exports.default = router;
