"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectionFactory_1 = require("../config/connectionFactory");
var AdministradorController_1 = require("../controller/AdministradorController");
var LoginRoute = (function () {
    function LoginRoute() {
        this._postgres = connectionFactory_1.default.pool;
    }
    Object.defineProperty(LoginRoute.prototype, "postgres", {
        get: function () {
            return this._postgres;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginRoute.prototype, "login", {
        get: function () {
            return function (req, res) {
                var user = JSON.parse(req.params.user);
                AdministradorController_1.default.login(req, res, user);
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginRoute.prototype, "confirmLogin", {
        get: function () {
            return function (req, res) {
                AdministradorController_1.default.confirmLogin(req, res);
            };
        },
        enumerable: true,
        configurable: true
    });
    return LoginRoute;
}());
exports.default = new LoginRoute();
