"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../lib/prisma"));
const env_config_1 = require("../configs/env.config");
const customError_1 = require("../utils/customError");
const registerService = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw (0, customError_1.createCustomError)(400, 'Email is already registered!');
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
    const newUser = await prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
    });
    return newUser;
};
exports.registerService = registerService;
const loginService = async (data) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw (0, customError_1.createCustomError)(401, 'Invalid email or password!');
    }
    const isValidPassword = await bcrypt_1.default.compare(data.password, user.password);
    if (!isValidPassword) {
        throw (0, customError_1.createCustomError)(401, 'Invalid email or password!');
    }
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    const token = (0, jsonwebtoken_1.sign)(payload, env_config_1.SECRET_KEY, { expiresIn: '1d' });
    return { user: payload, token };
};
exports.loginService = loginService;
