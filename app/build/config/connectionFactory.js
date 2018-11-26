"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var connectionFactory = (function () {
    function connectionFactory() {
        this._config = mysql.createPool({
            host: 'localhost',
            port: '3307',
            user: 'root',
            password: 'root',
            database: 'controledetarefas'
        });
    }
    Object.defineProperty(connectionFactory.prototype, "pool", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    return connectionFactory;
}());
exports.default = new connectionFactory();
