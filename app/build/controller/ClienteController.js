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
var Cliente_1 = require("../model/Cliente");
var mailer_1 = require("../config/mailer");
var uuidv1 = require("uuid");
var ClienteController = (function () {
    function ClienteController() {
        this._postgres = connectionFactory_1.default.pool;
        this._mailer = new mailer_1.default();
    }
    Object.defineProperty(ClienteController.prototype, "postgres", {
        get: function () {
            return this._postgres;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClienteController.prototype, "mailer", {
        get: function () {
            return this._mailer;
        },
        enumerable: true,
        configurable: true
    });
    ClienteController.prototype.insert = function (req, res, client) {
        var _this = this;
        var cliente = new Cliente_1.default(client.nome, client.email, new Date(), 'indefinido', uuidv1().split('-')[0], req.session.user.id);
        this.postgres.query("select * from cliente where email = $1 and id_adm = $2", [cliente.email, req.session.user.id], function (err, doc) {
            if (!err) {
                if (doc.rows.length > 0) {
                    res.send({ register: 'cadastrado' });
                }
                else {
                    if (req.session.user.clientes)
                        req.session.user.clientes += cliente.nome;
                    var opEmail = {
                        from: "'Controle de Tarefas' <ecommerceTemp@gmail.com>",
                        to: cliente.email,
                        subject: "Confirmação de Cadastro",
                        text: "Ol\u00E1 " + cliente.nome + ", voc\u00EA foi cadastrado no controle de tarefas, sua senha \u00E9 " + client.senha + "\n                        Desconsidere caso n\u00E3o tenha feito nenhum pedido para fazer parte do controle de tarefas"
                    };
                    _this.mailer.transporter.sendMail(opEmail, function (err, info) {
                        if (err)
                            console.log(err);
                        else
                            console.log("Mensagem enviada com sucesso");
                    });
                    var cliente_response = [cliente.nome, cliente.email, new Date(), 'indefinido', uuidv1().split('-')[0], req.session.user.id];
                    _this.postgres.query("insert into cliente (nome,email,ultimoacesso,situacao,senha,id_adm) VALUES ($1,$2,$3,$4,md5($5),$6)", cliente_response, function (err, results) {
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
    ClienteController.prototype.getClientes = function (req, res) {
        var _this = this;
        if (req.session.user) {
            this.resolveRequestBank("select * from cliente where id_adm = $1", req.session.user.id).then(function (result) {
                result['rows'].forEach(function (client) {
                    client.ultimoacesso = _this.inverterData(client.ultimoacesso.toISOString().split('T')[0]);
                });
                res.render('clientes', { clientes_table: result['rows'], clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.user.clientes != undefined ? req.session.user.clientes : '' });
            });
        }
        else
            res.render("403");
    };
    ClienteController.prototype.painel = function (req, res) {
        if (req.session.user) {
            var promise1 = this.resolveRequestBank("select * from administrador where id = $1", req.session.user.id);
            var promise2 = this.resolveRequestBank("select count(id) as mensagens from mensagens where id_usuario_recebe = $1 and lida = true", req.session.user.id);
            var promise3 = this.resolveRequestBank("select * from cliente where id_adm = $1", req.session.user.id);
            Promise.all([promise1, promise2, promise3]).then(function (data) {
                var clients = '';
                data[2]['rows'].forEach(function (client) {
                    clients += client.nome + ",";
                });
                req.session.user.clientes = clients;
                clients = '';
                req.session.clientes_tarefas = data[2]['rows'];
                res.render('painel', { usuario: req.session.user, mensagens: data[1]['rows'][0].mensagens, clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.user.clientes != undefined ? req.session.user.clientes : '', tarefas: false, desafios: false });
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
    };
    ClienteController.prototype.inverterData = function (date) {
        var data = date.split('-');
        return data[2] + "/" + data[1] + "/" + data[0];
    };
    ClienteController.prototype.resolveRequestBank = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        resolve(_this.postgres.query(query, [params]));
                    })];
            });
        });
    };
    return ClienteController;
}());
exports.default = new ClienteController();
