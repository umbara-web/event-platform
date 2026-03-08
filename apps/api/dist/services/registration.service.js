"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationsByUserService = exports.registerEventService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
const registerEventService = async (userId, eventId, data) => {
    const event = await prisma_1.default.event.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        throw (0, customError_1.createCustomError)(404, 'Event not found');
    }
    const ticket = await prisma_1.default.ticket.findUnique({
        where: { id: data.ticketId },
        include: {
            _count: {
                select: { registrations: true },
            },
        },
    });
    if (!ticket || ticket.eventId !== eventId) {
        throw (0, customError_1.createCustomError)(404, 'Ticket not found for this event');
    }
    if (ticket._count.registrations >= ticket.capacity) {
        throw (0, customError_1.createCustomError)(400, 'Ticket is sold out');
    }
    // Determine status
    const status = ticket.price === 0 ? 'PAID' : 'PENDING';
    const registration = await prisma_1.default.registration.create({
        data: {
            eventId,
            userId,
            ticketId: ticket.id,
            status,
            attendeeName: data.attendeeName,
            attendeeEmail: data.attendeeEmail,
            attendeePhone: data.attendeePhone,
        },
    });
    return registration;
};
exports.registerEventService = registerEventService;
const getRegistrationsByUserService = async (userId) => {
    const registrations = await prisma_1.default.registration.findMany({
        where: { userId },
        include: {
            event: true,
            ticket: true,
        },
    });
    return registrations;
};
exports.getRegistrationsByUserService = getRegistrationsByUserService;
