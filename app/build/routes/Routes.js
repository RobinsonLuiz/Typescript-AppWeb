"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var IndexRoute_1 = require("./IndexRoute");
var LoginRoute_1 = require("./LoginRoute");
var RegisterRoute_1 = require("./RegisterRoute");
var path = require("path");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var Routes = (function () {
    function Routes() {
        this._express = express().set('view engine', 'ejs');
        this._router = express.Router();
        this.middlewares();
        this.rotas();
    }
    ;
    Routes.prototype.middlewares = function () {
        this.express.set('views', path.join(__dirname, '../../', 'public\/views'));
        this.express.use(express.static(path.join(__dirname, '../../', 'public')));
        this._session = 'session-storage';
        this._store = new session.MemoryStore();
        this._cookie = cookieParser(this._session);
        this.express.use(this._cookie);
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.set('trust proxy', 1);
        this.express.use(session({
            name: 'session-storage',
            secret: this._session,
            resave: true,
            store: this._store,
            saveUninitialized: true
        }));
    };
    Routes.prototype.criarRotas = function (rota, callback, method) {
        if (method == 'get')
            this._router.get(rota, callback);
        else if (method == 'put') {
            this._router.put(rota, callback);
        }
        else
            this._router.post(rota, callback);
        this._express.use(rota, this._router);
    };
    Routes.prototype.rotas = function () {
        this.criarRotas(IndexRoute_1.default.updateRota(), IndexRoute_1.default.index, 'get');
        this.criarRotas(IndexRoute_1.default.updateRota('/index'), IndexRoute_1.default.index, 'get');
        this.criarRotas(IndexRoute_1.default.updateRota('/sair'), IndexRoute_1.default.logout, 'get');
        this.criarRotas(IndexRoute_1.default.updateRota('/session/:id'), IndexRoute_1.default.session, 'get');
        this.criarRotas(IndexRoute_1.default.updateRota('/clientes'), IndexRoute_1.default.clientes, 'get');
        this.criarRotas(IndexRoute_1.default.updateRota('/painel'), IndexRoute_1.default.painel, 'get');
        this.criarRotas(IndexRoute_1.default.updateRota('/charts'), IndexRoute_1.default.charts, 'get');
        this.criarRotas(LoginRoute_1.default.updateRota('/login/:user'), LoginRoute_1.default.login, 'get');
        this.criarRotas(LoginRoute_1.default.updateRota('/confirmar/:id'), LoginRoute_1.default.confirmLogin, 'get');
        this.criarRotas(RegisterRoute_1.default.updateRota('/valida/clients/:client'), RegisterRoute_1.default.validaClient, 'post');
        this.criarRotas(RegisterRoute_1.default.updateRota('/verifica/:form'), RegisterRoute_1.default.verificaForm, 'get');
        this.criarRotas(RegisterRoute_1.default.updateRota('/ativar'), RegisterRoute_1.default.ativar, 'post');
    };
    Object.defineProperty(Routes.prototype, "express", {
        get: function () {
            return this._express;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Routes.prototype, "router", {
        get: function () {
            return this._router;
        },
        enumerable: true,
        configurable: true
    });
    return Routes;
}());
exports.default = Routes;
