"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_config_1 = require("./configs/env.config");
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
// import router from "./routers";
const app = (0, express_1.default)();
// middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// routers
app.use('/api');
// error middleware
app.use(error_middleware_1.default);
app.listen(env_config_1.PORT, () => {
    console.log(`Server started on port ${env_config_1.PORT}`);
});
