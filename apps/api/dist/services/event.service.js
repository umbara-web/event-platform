"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventByIdService = exports.getEventsService = exports.createEventService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const customError_1 = require("../utils/customError");
const createEventService = async (organizerId, data) => {
    const event = await prisma_1.default.event.create({
        data: Object.assign(Object.assign({}, data), { organizerId }),
    });
    return event;
};
exports.createEventService = createEventService;
const getEventsService = async () => {
    const events = await prisma_1.default.event.findMany({
        include: {
            tickets: true,
            organizer: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return events;
};
exports.getEventsService = getEventsService;
const getEventByIdService = async (id) => {
    const event = await prisma_1.default.event.findUnique({
        where: { id },
        include: {
            tickets: true,
            organizer: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!event) {
        throw (0, customError_1.createCustomError)(404, 'Event not found');
    }
    return event;
};
exports.getEventByIdService = getEventByIdService;
