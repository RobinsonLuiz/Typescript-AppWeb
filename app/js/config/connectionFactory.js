"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg = require("pg");
var connectionFactory = (function () {
    function connectionFactory() {
        this._config = {
            user: 'postgres',
            password: '325140',
            database: 'controle_tarefas',
            host: 'localhost',
            port: 5432
        };
        this._pool = new pg.Pool(this._config);
    }
    Object.defineProperty(connectionFactory.prototype, "pool", {
        get: function () {
            return this._pool;
        },
        enumerable: true,
        configurable: true
    });
    return connectionFactory;
}());
exports.default = new connectionFactory();
