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
        this._express.set('views', path.join(__dirname, '../../', 'public\/views'));
        this._express.use(express.static(path.join(__dirname, '../../', 'public')));
        this._router = express.Router();
        this._session = 'session-rbn';
        this._store = new session.MemoryStore();
        this._cookie = cookieParser(this._session)
        this._express.use(this._cookie);
        this._express.use(bodyParser.urlencoded({extended : true}));
        this._express.set('trust proxy', 1);
        this._express.use(session({
            name: 'robinson',
            secret: this._session,
            resave: false,
            store: this._store,
            saveUninitialized: true
        }))
        this.rotas();
    };
    
    private criarRotas(rota: any, callback: any, method: string) {
        if (method == 'get')
            this._router.get(rota, callback);
        else if (method == 'put') {
            this._router.put(rota, callback);
        } else 
            this._router.post(rota, callback);
        this._express.use(rota, this._router);
    }

    private rotas() {
        this.criarRotas(IndexRoute.updateRota(), IndexRoute.index, 'get');
        this.criarRotas(IndexRoute.updateRota('/index'), IndexRoute.index, 'get');
        this.criarRotas(IndexRoute.updateRota('/sair'), IndexRoute.logout, 'get');
        this.criarRotas(IndexRoute.updateRota('/session/:id'), IndexRoute.session, 'get');
        this.criarRotas(IndexRoute.updateRota('/clientes'), IndexRoute.clientes, 'get');
        this.criarRotas(IndexRoute.updateRota('/painel'), IndexRoute.painel, 'get');
        this.criarRotas(IndexRoute.updateRota('/charts'), IndexRoute.charts, 'get');
        this.criarRotas(LoginRoute.updateRota('/login/:user'), LoginRoute.login, 'get');
        this.criarRotas(LoginRoute.updateRota('/confirmar/:id'), LoginRoute.confirmLogin, 'get');
        this.criarRotas(RegisterRoute.updateRota('/valida/clients/:client'), RegisterRoute.validaClient, 'post');
        this.criarRotas(RegisterRoute.updateRota('/verifica/:form'), RegisterRoute.verificaForm, 'get');
        this.criarRotas(RegisterRoute.updateRota('/ativar'), RegisterRoute.ativar, 'post');
    }
    

    get express(): any {
        return this._express;
    }

    get router(): any {
        return this._router;
    }
}