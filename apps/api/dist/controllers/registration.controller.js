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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRegistrationsController = exports.registerEventController = void 0;
const registrationService = __importStar(require("../services/registration.service"));
const registerEventController = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { eventId } = req.params;
        const { ticketId, attendeeName, attendeeEmail, attendeePhone } = req.body;
        // Use logged in user's details if not provided
        const payload = {
            ticketId,
            attendeeName: attendeeName || user.name,
            attendeeEmail: attendeeEmail || user.email,
            attendeePhone: attendeePhone || '0000',
        };
        const result = await registrationService.registerEventService(user.id, eventId, payload);
        res.status(201).json({
            message: 'Registration successful',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.registerEventController = registerEventController;
const getUserRegistrationsController = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await registrationService.getRegistrationsByUserService(user.id);
        res.status(200).json({
            message: 'Success',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getUserRegistrationsController = getUserRegistrationsController;
