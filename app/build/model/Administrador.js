"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Administrador = (function () {
    function Administrador(nome, email, telefone, ativado, senha, token) {
        this._nome = nome;
        this._email = email;
        this._telefone = telefone;
        this._ativado = ativado;
        this._senha = senha;
        this._token = token;
    }
    ;
    Object.defineProperty(Administrador.prototype, "nome", {
        get: function () {
            return this._nome;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Administrador.prototype, "email", {
        get: function () {
            return this._email;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Administrador.prototype, "telefone", {
        get: function () {
            return this._telefone;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Administrador.prototype, "ativado", {
        get: function () {
            return this._ativado;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Administrador.prototype, "senha", {
        get: function () {
            return this._senha;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Administrador.prototype, "token", {
        get: function () {
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Administrador.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    return Administrador;
}());
;
exports.default = Administrador;
