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
var mailer_1 = require("../config/mailer");
var uuidv1 = require("uuid");
var connectionFactory_1 = require("../config/connectionFactory");
var RegisterRoute = (function () {
    function RegisterRoute() {
        this._mailer = new mailer_1.default();
        this._postgres = connectionFactory_1.default.pool;
    }
    Object.defineProperty(RegisterRoute.prototype, "mailer", {
        get: function () {
            return this._mailer;
        },
        enumerable: true,
        configurable: true
    });
    RegisterRoute.prototype.updateRota = function (route) {
        return route;
    };
    Object.defineProperty(RegisterRoute.prototype, "postgres", {
        get: function () {
            return this._postgres;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterRoute.prototype, "ativar", {
        get: function () {
            var _this = this;
            return function (req, res) {
                _this.postgres.query("update administrador set senha = md5($1), token = '', ativado = 1 where id = $2", [req.body.senha, req.body.id], function (err, results) {
                    if (!err)
                        res.render("index", { usuario: false });
                    else
                        res.status(404).end();
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterRoute.prototype, "verificaForm", {
        get: function () {
            var _this = this;
            return function (req, res) {
                var administrador = JSON.parse(req.params.form);
                var uuid = uuidv1().split("-");
                administrador.senha = uuid[0];
                administrador.ativado = 0;
                administrador.token = uuid[0];
                var bind = _this;
                _this.postgres.query("select * from administrador where email = $1", [administrador.email], function (err, results) {
                    if (!err && results.rows.length > 0) {
                        res.send({ register: "cadastrado" });
                    }
                    else if (!err) {
                        var opEmail = {
                            from: "'Controle de Tarefas' <ecommerceTemp@gmail.com>",
                            to: administrador.email,
                            subject: "Confirmação de Cadastro",
                            text: "Ol\u00E1 " + administrador.nome + ", obrigado por se cadastrar em nosso site! Por favor confirme o cadastro no seguinte link http://localhost/confirmar/" + uuid[0]
                        };
                        bind.mailer.transporter.sendMail(opEmail, function (err, info) {
                            if (err)
                                console.log(err);
                            else
                                console.log("Mensagem enviada com sucesso");
                        });
                        var insert_administrador = [administrador.nome, administrador.email, administrador.telefone, administrador.ativado, administrador.senha, administrador.token];
                        bind.postgres.query("insert into administrador (nome,email,telefone,ativado,senha,token) VALUES ($1,$2,$3,$4,md5($5),$6)", insert_administrador, function (err, results) {
                            if (!err)
                                res.send({ register: "OK" });
                            else
                                res.send({ register: false });
                        });
                    }
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegisterRoute.prototype, "validaClient", {
        get: function () {
            var _this = this;
            return function (req, res) {
                var client = JSON.parse(req.params.client);
                _this.postgres.query("select * from cliente where email = $1 and id_adm = $2", [client.email, req.session.user.id], function (err, doc) {
                    if (!err) {
                        if (doc.rows.length > 0) {
                            res.send({ register: 'cadastrado' });
                        }
                        else {
                            var client_response = [client.nome, client.email, new Date(), 'indefinedo', uuidv1().split('-')[0], req.session.user.id];
                            if (req.session.user.clientes)
                                req.session.user.clientes += client.nome;
                            _this.postgres.query("insert into cliente (nome,email,ultimoacesso,situacao,senha,id_adm) VALUES ($1,$2,$3,$4,md5($5),$6)", client_response, function (err, results) {
                                if (!err) {
                                    res.send({ register: "ok" });
                                }
                                else
                                    res.send({ register: "error" });
                            });
                        }
                    }
                    else
                        res.send({ register: 'error' });
                });
            };
        },
        enumerable: true,
        configurable: true
    });
    RegisterRoute.prototype.resolveRequestBank = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        resolve(_this.postgres.query(query, params));
                    })];
            });
        });
    };
    return RegisterRoute;
}());
exports.default = new RegisterRoute();
