"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomError = createCustomError;
function createCustomError(statusCode, message) {
    return { statusCode, message };
}
