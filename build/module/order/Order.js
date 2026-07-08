"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var Order = /** @class */ (function () {
    function Order(productsIds, totalPrice) {
        if (productsIds.length < 1 || productsIds.length > 5) {
            throw new Error('An order must contain between 1 and 5 products.');
        }
        if (totalPrice < 2 || totalPrice > 500) {
            throw new Error('Total price must be between 2 and 500.');
        }
        this.createdAt = new Date();
        this.status = OrderStatus.PENDING;
        this.totalPrice = totalPrice;
        this.productIds = productsIds;
    }
    return Order;
}());
exports.Order = Order;
