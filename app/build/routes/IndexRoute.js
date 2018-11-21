"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
                    res.redirect('painel');
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
                req.session.clientes = undefined;
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
                if (req.session.user) {
                    _this.resolveRequestBank("select * from cliente where id_adm = $1", req.session.user.id).then(function (result) {
                        result['rows'].forEach(function (client) {
                            client.ultimoacesso = _this.inverterData(client.ultimoacesso.toISOString().split('T')[0]);
                        });
                        res.render('clientes', { clientes_table: result['rows'], clientes: req.session.user.clientes != undefined ? req.session.user.clientes : '' });
                    });
                }
                else
                    res.render("403");
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexRoute.prototype, "painel", {
        get: function () {
            var _this = this;
            return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var promise1, promise2, promise3;
                return __generator(this, function (_a) {
                    if (req.session.user) {
                        promise1 = this.resolveRequestBank("select * from administrador where id = $1", req.session.user.id);
                        promise2 = this.resolveRequestBank("select count(id) as mensagens from mensagens where id_usuario_recebe = $1 and lida = true", req.session.user.id);
                        promise3 = this.resolveRequestBank("select * from cliente where id_adm = $1", req.session.user.id);
                        Promise.all([promise1, promise2, promise3]).then(function (data) {
                            var clients = '';
                            data[2]['rows'].forEach(function (client) {
                                clients += client.nome + ",";
                            });
                            req.session.user.clientes = clients;
                            clients = '';
                            res.render('painel', { usuario: req.session.user, mensagens: data[1]['rows'][0].mensagens, clientes: req.session.user.clientes != undefined ? req.session.user.clientes : '', tarefas: false, desafios: false });
                        }).catch(function (error) {
                            if (req.session.user)
                                res.redirect('painel');
                            else
                                res.redirect('index');
                        });
                    }
                    else {
                        res.render("403");
                    }
                    return [2];
                });
            }); };
        },
        enumerable: true,
        configurable: true
    });
    IndexRoute.prototype.resolveRequestBank = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        resolve(_this.postgres.query(query, [params]));
                    })];
            });
        });
    };
    Object.defineProperty(IndexRoute.prototype, "charts", {
        get: function () {
            return function (req, res) {
                if (req.session.user) {
                    res.render('charts', { usuario: req.session.user, clientes: req.session.user.clientes != undefined ? req.session.user.clientes : '' });
                }
                else
                    res.render("403");
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
