import * as express from 'express';
import IndexRoute from './IndexRoute';
import LoginRoute from './LoginRoute';
import RegisterRoute from './RegisterRoute';
import ClientRoute from './ClientRoute';
import * as path from 'path';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

export default class Routes {

    private _express: any;
    private _router: any;
    private _session: any;
    private _cookie: any;
    private _store: any;

    constructor() {
        this._express = express().set('view engine', 'ejs');
        this._router = express.Router();
        this.middlewares();
        this.rotas();
    };

    private middlewares() {
        this.express.set('views', path.join(__dirname, '../../', 'public\/views'));
        this.express.use(express.static(path.join(__dirname, '../../', 'public')));
        this._session = 'session-storage';
        this._store = new session.MemoryStore();
        this._cookie = cookieParser(this._session);
        this.express.use(this._cookie);
        this.express.use(bodyParser.urlencoded({ extended : true }));
        this.express.set('trust proxy', 1);
        this.express.use(
            session({
                name: 'session-storage',
                secret: this._session,
                resave: true,
                store: this._store,
                saveUninitialized: true
            })
        );
    }
    
    private rotas() {
        this._router.get('/clientes/index', ClientRoute.index);
        this._router.get("/clientes/profile", ClientRoute.profile);
        this._router.post("/clientes/login/:user", ClientRoute.login);
        this._router.get('/clientes/session/:id', ClientRoute.session);
        this._router.get("/", IndexRoute.index);
        this._router.get('/index', IndexRoute.index);
        this._router.get('/administrador/sair', IndexRoute.logout);
        this._router.get('/administrador/session/:id', IndexRoute.session);
        this._router.get('/administrador/clientes', IndexRoute.clientes);
        this._router.get('/administrador/painel', IndexRoute.painel);
        this._router.get('/administrador/charts', IndexRoute.charts);
        this._router.post('/login/:user', LoginRoute.login);
        this._router.get('/confirmar/:id', LoginRoute.confirmLogin);
        this._router.post('/valida/clients/:client', RegisterRoute.validaClient);
        this._router.get('/verifica/:form', RegisterRoute.verificaForm);
        this._router.post('/ativar', RegisterRoute.ativar);
        this._express.use('/', this._router);
    }
    

    get express(): any {
        return this._express;
    }

    get router(): any {
        return this._router;
    }
}