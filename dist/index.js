"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const app = (0, express_1.default)();
const port = '8000';
app.get('/', controller_1.rootHandler);
app.get("/hello/:name", controller_1.helloHandler);
app.listen(port, err => {
    if (err)
        return console.error(err);
    return console.log(`Server is listening on ${port}`);
});
