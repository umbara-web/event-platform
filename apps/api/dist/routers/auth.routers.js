"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
authRouter.post('/login', auth_controller_1.loginController);
authRouter.post('/register', auth_controller_1.registerController);
exports.default = authRouter;
