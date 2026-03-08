"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("../configs/env.config");
exports.transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_config_1.GMAIL_EMAIL,
        pass: env_config_1.GMAIL_APP_PASS,
    },
});
