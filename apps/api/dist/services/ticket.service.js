"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketsByEventIdService = exports.createTicketService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
const createTicketService = async (organizerId, eventId, data) => {
    // Verify that the event belongs to this organizer
    const event = await prisma_1.default.event.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        throw (0, customError_1.createCustomError)(404, 'Event not found');
    }
    if (event.organizerId !== organizerId) {
        throw (0, customError_1.createCustomError)(403, 'You are not authorized to add tickets to this event');
    }
    const ticket = await prisma_1.default.ticket.create({
        data: Object.assign(Object.assign({}, data), { eventId }),
    });
    return ticket;
};
exports.createTicketService = createTicketService;
const getTicketsByEventIdService = async (eventId) => {
    const tickets = await prisma_1.default.ticket.findMany({
        where: { eventId },
    });
    return tickets;
};
exports.getTicketsByEventIdService = getTicketsByEventIdService;
