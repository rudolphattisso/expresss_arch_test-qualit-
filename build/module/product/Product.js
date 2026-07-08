"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var typeorm_1 = require("typeorm");
var Product = /** @class */ (function () {
    function Product(_a) {
        var title = _a.title, description = _a.description, price = _a.price;
        this.checkPrice(price);
        this.validateTitle(title);
        this.validateDescription(description);
        this.title = title;
        this.description = description;
        this.price = price;
    }
    Product.prototype.update = function (title, description, price) {
        this.checkPrice(price);
        this.validateTitle(title);
        this.validateDescription(description);
        this.title = title;
        this.description = description;
        this.price = price;
    };
    Product.prototype.validateTitle = function (title) {
        if (title.length < 3) {
            throw new Error('titre trop court');
        }
        if (title.length > 20) {
            throw new Error('le titre doit faire 20 caractères max');
        }
        if (title.startsWith(' ')) {
            throw new Error('le titre ne doit pas commencer par un espace');
        }
        if (title.includes(' ')) {
            throw new Error('le titre ne doit pas contenir d\'espaces');
        }
    };
    Product.prototype.validateDescription = function (description) {
        if (description && description.includes('@')) {
            throw new Error('la description ne doit pas contenir @');
        }
    };
    Product.prototype.checkPrice = function (price) {
        if (price <= 0) {
            throw new Error('le prix doit être supérieur à 0');
        }
        if (price > 10000) {
            throw new Error('le prix doit être inférieur à 10000');
        }
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Product.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
        __metadata("design:type", Number)
    ], Product.prototype, "price", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
        __metadata("design:type", String)
    ], Product.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], Product.prototype, "description", void 0);
    Product = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Product);
    return Product;
}());
exports.Product = Product;
