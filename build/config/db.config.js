"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var typeorm_1 = require("typeorm");
var Product_1 = require("../module/product/Product");
var Order_1 = require("../module/order/Order");
(0, dotenv_1.config)({ path: '.env.local' });
var AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    logging: false,
    entities: [Product_1.Product, Order_1.Order],
    synchronize: true,
    entitySkipConstructor: true
});
exports.default = AppDataSource;
