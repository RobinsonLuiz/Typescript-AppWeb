"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cliente = (function () {
    function Cliente(nome, email, date, situacao, senha, idAdm) {
        this._nome = nome;
        this._email = email;
        this._date = date;
        this._situacao = situacao;
        this._senha = senha;
        this._idAdm = idAdm;
    }
    Object.defineProperty(Cliente.prototype, "nome", {
        get: function () {
            return this._nome;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cliente.prototype, "email", {
        get: function () {
            return this._email;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cliente.prototype, "date", {
        get: function () {
            return this._date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cliente.prototype, "situacao", {
        get: function () {
            return this.situacao;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cliente.prototype, "senha", {
        get: function () {
            return this._senha;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cliente.prototype, "idAdm", {
        get: function () {
            return this._idAdm;
        },
        enumerable: true,
        configurable: true
    });
    return Cliente;
}());
exports.default = Cliente;
