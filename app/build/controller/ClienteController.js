"use strict";
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
    return ClienteController;
}());
exports.default = new ClienteController();
