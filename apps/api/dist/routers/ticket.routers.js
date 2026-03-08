"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Reusing same route structure for modularity (mounted at /api/events/:eventId/tickets in index)
const ticketRouter = (0, express_1.Router)({ mergeParams: true });
ticketRouter.get('/', ticket_controller_1.getEventTicketsController);
// Requires Authentication and ORGANIZER Role to add tickets
ticketRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleGuard)(['ORGANIZER']), ticket_controller_1.createTicketController);
exports.default = ticketRouter;
