"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
exports.validateBody = validateBody;
const zod_1 = require("zod");
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                file: req.file,
            });
            next();
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                const zodError = err;
                return res.status(400).json({
                    message: "NG",
                    error: "Validation Failed",
                    details: zodError.issues.map((error) => ({
                        field: error.path.join("."),
                        message: error.message,
                    })),
                });
            }
        }
    };
}
function validateBody(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                const zodError = err;
                return res.status(400).json({
                    message: "NG",
                    error: "Validation Failed",
                    details: zodError.issues.map((error) => ({
                        field: error.path.join("."),
                        message: error.message,
                    })),
                });
            }
        }
    };
}
