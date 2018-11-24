import * as express from 'express';
import IndexRoute from './IndexRoute';
import LoginRoute from './LoginRoute';
import RegisterRoute from './RegisterRoute';
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
        this._router.get("/", IndexRoute.index);
        this._router.get('/index', IndexRoute.index);
        this._router.get('/sair', IndexRoute.logout);
        this._router.get('/session/:id', IndexRoute.session);
        this._router.get('/clientes', IndexRoute.clientes);
        this._router.get('/painel', IndexRoute.painel);
        this._router.get('/charts', IndexRoute.charts);
        this._router.get('/login/:user', LoginRoute.login);
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