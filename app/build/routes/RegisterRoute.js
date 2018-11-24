"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv1 = require("uuid");
var AdministradorController_1 = require("../controller/AdministradorController");
var ClienteController_1 = require("../controller/ClienteController");
var RegisterRoute = (function () {
    function RegisterRoute() {
    }
    Object.defineProperty(RegisterRoute.prototype, "ativar", {
        get: function () {
            return function (req, res) {
                AdministradorController_1.default.update(req, res);
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterRoute.prototype, "verificaForm", {
        get: function () {
            return function (req, res) {
                var administrador = JSON.parse(req.params.form);
                var uuid = uuidv1().split("-");
                administrador.senha = uuid[0];
                administrador.ativado = 0;
                administrador.token = uuid[0];
                AdministradorController_1.default.insert(req, res, administrador);
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterRoute.prototype, "validaClient", {
        get: function () {
            return function (req, res) {
                var client = JSON.parse(req.params.client);
                ClienteController_1.default.insert(req, res, client);
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    return RegisterRoute;
}());
exports.default = new RegisterRoute();
