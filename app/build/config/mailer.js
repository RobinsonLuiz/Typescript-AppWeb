"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
var mailer = (function () {
    function mailer() {
        this._transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'ecommerceTemp@gmail.com',
                pass: 'ecommerce123'
            }
        });
    }
    Object.defineProperty(mailer.prototype, "transporter", {
        get: function () {
            return this._transporter;
        },
        enumerable: true,
        configurable: true
    });
    return mailer;
}());
exports.default = mailer;
