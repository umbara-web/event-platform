"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("../controllers/registration.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const registrationRouter = (0, express_1.Router)({ mergeParams: true });
// Uses eventId param from parent router: /api/events/:eventId/register
registrationRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleGuard)(['ATTENDEE', 'ORGANIZER']), registration_controller_1.registerEventController);
exports.default = registrationRouter;
