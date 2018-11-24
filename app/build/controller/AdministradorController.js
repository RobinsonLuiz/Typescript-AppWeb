"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectionFactory_1 = require("../config/connectionFactory");
var Administrador_1 = require("../model/Administrador");
var mailer_1 = require("../config/mailer");
var AdministradorController = (function () {
    function AdministradorController() {
        this._postgres = connectionFactory_1.default.pool;
        this._mailer = new mailer_1.default();
    }
    Object.defineProperty(AdministradorController.prototype, "postgres", {
        get: function () {
            return this._postgres;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdministradorController.prototype, "mailer", {
        get: function () {
            return this._mailer;
        },
        enumerable: true,
        configurable: true
    });
    AdministradorController.prototype.insert = function (req, res, administrador) {
        var _this = this;
        var admin = new Administrador_1.default(administrador.nome, administrador.email, administrador.telefone, administrador.ativado, administrador.senha, administrador.token);
        this.postgres.query("select * from administrador where email = $1", [administrador.email], function (err, results) {
            if (!err && results.rows.length > 0) {
                res.send({ register: "cadastrado" });
            }
            else if (!err) {
                var opEmail = {
                    from: "'Controle de Tarefas' <ecommerceTemp@gmail.com>",
                    to: admin.email,
                    subject: "Confirmação de Cadastro",
                    text: "Ol\u00E1 " + admin.nome + ", obrigado por se cadastrar em nosso site! Por favor confirme o cadastro no seguinte link http://localhost/confirmar/" + admin.token
                };
                _this.mailer.transporter.sendMail(opEmail, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Mensagem enviada com sucesso");
                });
                var insert_administrador = [admin.nome, admin.email, admin.telefone, admin.ativado, admin.senha, admin.token];
                _this.postgres.query("insert into administrador (nome,email,telefone,ativado,senha,token) VALUES ($1,$2,$3,$4,md5($5),$6)", insert_administrador, function (err, results) {
                    if (!err)
                        res.send({ register: "OK" });
                    else
                        res.send({ register: false });
                });
            }
            ;
        });
    };
    AdministradorController.prototype.update = function (req, res) {
        this.postgres.query("update administrador set senha = md5($1), token = '', ativado = 1 where id = $2", [req.body.senha, req.body.id], function (err, results) {
            if (!err)
                res.render("index", { usuario: false });
            else
                res.status(404).json("Ocorreu um erro no update");
        });
    };
    ;
    AdministradorController.prototype.login = function (req, res, user) {
        this.postgres.query('select nome,id,ativado,email from administrador where email = $1 and senha = md5($2)', [user.email, user.senha], function (err, results) {
            if (!err) {
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
            }
            else
                res.send(JSON.stringify({ "OK": "errorBank" }));
        });
    };
    AdministradorController.prototype.confirmLogin = function (req, res) {
        this.postgres.query("select email,id from administrador where token = $1 and token != ''", [String(req.params.id)], function (err, results) {
            if (!err && results.rows.length > 0)
                res.render('confirmar', { usuario: results.rows[0] });
            else
                res.status(404).json("Você já confirmou sua conta ou o código de acesso não existe");
        });
    };
    return AdministradorController;
}());
exports.default = new AdministradorController();
