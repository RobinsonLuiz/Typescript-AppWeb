"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectionFactory_1 = require("../config/connectionFactory");
var IndexRoute = (function () {
    function IndexRoute() {
        this._postgres = connectionFactory_1.default.pool;
    }
    Object.defineProperty(IndexRoute.prototype, "postgres", {
        get: function () {
            return this._postgres;
        },
        enumerable: true,
        configurable: true
    });
    IndexRoute.prototype.updateRota = function (route) {
        if (route === void 0) { route = '/'; }
        return route;
    };
    Object.defineProperty(IndexRoute.prototype, "index", {
        get: function () {
            return function (req, res) {
                var hour = 3000000;
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.cookie.maxAge = hour;
                if (req.session.user)
                    res.render('index', { success: false, usuario: req.session.user });
                else
                    res.render('index', { success: false, usuario: false });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexRoute.prototype, "logout", {
        get: function () {
            return function (req, res) {
                req.session.user = undefined;
                res.redirect('/');
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexRoute.prototype, "session", {
        get: function () {
            return function (req, res) {
                setTimeout(function () {
                    res.redirect('/painel');
                }, 500);
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexRoute.prototype, "clientes", {
        get: function () {
            var _this = this;
            return function (req, res) {
                var bind = _this;
                if (req.session.user) {
                    _this.postgres.query("select * from usuario where id_adm = $1", [req.session.user.id], function (err, results) {
                        results.rows.forEach(function (client) {
                            client.datanascimento = bind.inverterData(client.datanascimento.toISOString().split('T')[0]);
                            client.ultimoacesso = bind.inverterData(client.ultimoacesso.toISOString().split('T')[0]);
                        });
                        if (!err)
                            res.render('clientes', { clientes_table: results.rows, clientes: req.session.clientes != undefined ? req.session.clientes : '' });
                    });
                }
                else
                    res.send("403 Forbidden");
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexRoute.prototype, "painel", {
        get: function () {
            var _this = this;
            return function (req, res) {
                var bind = _this;
                if (req.session.user) {
                    _this.postgres.query("select * from usuario where id = $1", [req.session.user.id], function (err, doc) {
                        if (!err) {
                            bind.postgres.query("select count(id) as mensagens from mensagens where id_usuario_recebe = $1 and lida = true", [req.session.user.id], function (err2, result) {
                                if (!err2) {
                                    bind.postgres.query("select * from usuario where id_adm = $1", [req.session.user.id], function (err, docs) {
                                        var clientes = [];
                                        docs.rows.forEach(function (client) {
                                            clientes.push(client.nome);
                                        });
                                        req.session.clientes = clientes;
                                        if (!err)
                                            res.render('painel', { usuario: req.session.user, mensagens: result.rows[0].mensagens, clientes: req.session.clientes != undefined ? req.session.clientes : '', tarefas: false, desafios: false });
                                    });
                                }
                            });
                        }
                    });
                }
                else
                    res.send("403 Forbidden");
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexRoute.prototype, "charts", {
        get: function () {
            return function (req, res) {
                if (req.session.user) {
                    res.render('charts', { usuario: req.session.user, clientes: req.session.clientes != undefined ? req.session.clientes : '' });
                }
                else
                    res.send("403 Forbidden");
            };
        },
        enumerable: true,
        configurable: true
    });
    IndexRoute.prototype.inverterData = function (date) {
        var data = date.split('-');
        return data[2] + "/" + data[1] + "/" + data[0];
    };
    return IndexRoute;
}());
exports.default = new IndexRoute();
