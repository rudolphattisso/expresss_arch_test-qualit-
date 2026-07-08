"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./config/app");
var dotenv_1 = require("dotenv");
var db_config_1 = __importDefault(require("./config/db.config"));
(0, dotenv_1.config)({ path: '.env.local' });
db_config_1.default.initialize()
    .then(function () {
    var _a;
    var port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error("Invalid PORT value: \"".concat(process.env.PORT, "\""));
    }
    console.log('Data Source has been initialized!');
    (0, app_1.buildApp)().listen(port, function () { return console.log("Server started on port ".concat(port)); });
})
    .catch(function (err) {
    console.error('Error during Data Source initialization:', err);
});
