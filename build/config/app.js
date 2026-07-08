"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
var express_1 = __importDefault(require("express"));
var cors = require('cors');
var createProductController = require('../module/product/createProduct/createProductController');
var updateProductController = require('../module/product/updateProduct/updateProductController');
var listProductsController = require('../module/product/listProducts/listProductsController');
var deleteProductController = require('../module/product/deleteProduct/deleteProductController');
function buildApp() {
    var app = (0, express_1.default)();
    app.use(cors());
    app.use(express_1.default.json());
    app.get('/api/health', function (req, res) {
        res.send('OK');
    });
    app.use('/api', createProductController);
    app.use('/api', updateProductController);
    app.use('/api', listProductsController);
    app.use('/api', deleteProductController);
    return app;
}
