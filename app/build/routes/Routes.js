"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var IndexRoute_1 = require("./IndexRoute");
var LoginRoute_1 = require("./LoginRoute");
var RegisterRoute_1 = require("./RegisterRoute");
var ClientRoute_1 = require("./ClientRoute");
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
    Routes.prototype.rotas = function () {
        this._router.get('/clientes/index', ClientRoute_1.default.index);
        this._router.get("/clientes/profile", ClientRoute_1.default.profile);
        this._router.post("/clientes/login/:user", ClientRoute_1.default.login);
        this._router.get('/clientes/session/:id', ClientRoute_1.default.session);
        this._router.get("/", IndexRoute_1.default.index);
        this._router.get('/index', IndexRoute_1.default.index);
        this._router.get('/administrador/sair', IndexRoute_1.default.logout);
        this._router.get('/administrador/session/:id', IndexRoute_1.default.session);
        this._router.get('/administrador/clientes', IndexRoute_1.default.clientes);
        this._router.get('/administrador/painel', IndexRoute_1.default.painel);
        this._router.get('/administrador/charts', IndexRoute_1.default.charts);
        this._router.post('/login/:user', LoginRoute_1.default.login);
        this._router.get('/confirmar/:id', LoginRoute_1.default.confirmLogin);
        this._router.post('/valida/clients/:client', RegisterRoute_1.default.validaClient);
        this._router.get('/verifica/:form', RegisterRoute_1.default.verificaForm);
        this._router.post('/ativar', RegisterRoute_1.default.ativar);
        this._express.use('/', this._router);
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
