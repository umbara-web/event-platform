"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.roleGuard = roleGuard;
const jsonwebtoken_1 = require("jsonwebtoken");
const customError_1 = require("../utils/customError");
const env_config_1 = require("../configs/env.config");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            throw (0, customError_1.createCustomError)(401, 'Unauthorized');
        const token = authHeader.split(' ')[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, env_config_1.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        next(err);
    }
}
function roleGuard(allowedRoles) {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user)
                throw (0, customError_1.createCustomError)(401, 'invalid token');
            if (!allowedRoles.includes(user === null || user === void 0 ? void 0 : user.role))
                throw (0, customError_1.createCustomError)(401, 'Insufficient permissions');
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
