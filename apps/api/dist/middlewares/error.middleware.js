"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
function errorMiddleware(err, req, res, next) {
    const status = "statusCode" in err ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        message: "NG",
        error: message,
    });
}
