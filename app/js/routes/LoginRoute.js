"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectionFactory_1 = require("../config/connectionFactory");
var LoginRoute = (function () {
    function LoginRoute() {
        this._postgres = connectionFactory_1.default.pool;
    }
    LoginRoute.prototype.updateRota = function (route) {
        return route;
    };
    Object.defineProperty(LoginRoute.prototype, "postgres", {
        get: function () {
            return this._postgres;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginRoute.prototype, "login", {
        get: function () {
            var _this = this;
            return function (req, res) {
                var user = req.params.user.split(',');
                _this.postgres.query('select nome,id,ativado from usuario where email = $1 and senha = md5($2)', user, function (err, results) {
                    if (results.rows && results.rows.length > 0) {
                        if (results.rows[0].ativado == 1) {
                            req.session.user = results.rows[0];
                            req.session.isLogged = true;
                            res.send(JSON.stringify({ "OK": results.rows[0].id }));
                        }
                        else {
                            res.send(JSON.stringify({ "OK": "desatived" }));
                        }
                    }
                    else
                        res.send(JSON.stringify({ "OK": false }));
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginRoute.prototype, "confirmLogin", {
        get: function () {
            var _this = this;
            return function (req, res) {
                _this.postgres.query("select * from usuario where token = $1 and token != ''", [String(req.params.id)], function (err, results) {
                    if (req.session.user && req.session.user.ativado != 1) {
                        if (!err && results.rows.length > 0)
                            res.render('confirmar', { usuario: results.rows[0] });
                        else
                            res.status(404).json("Não achado");
                    }
                    else {
                        res.redirect("/painel");
                    }
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    return LoginRoute;
}());
exports.default = new LoginRoute();
