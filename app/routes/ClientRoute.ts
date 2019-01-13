import connectionFactory from '../config/connectionFactory';
import ClienteController from '../controller/ClienteController';
import { Router } from 'express';

class ClientRoute {

    private _postgres: any;
    public router: any = Router();

    constructor() {
        this._postgres = connectionFactory.pool;
    }
    
    get postgres() {
        return this._postgres;
    }


    get index(): object {
        return (req, res) => {
            if (req.session.cliente) {
                res.render("./area_cliente/index", {user: req.session.cliente});
            } else res.render('403');
        }
    }

    get profile(): object {
        return (req, res) => {
            if (req.session.cliente) { 
                res.render("./area_cliente/profile", {user: req.session.cliente});
            } else res.render('403');
        }
    }

    get session(): object {
        return (req, res) => {
            setTimeout(() => {
                res.redirect('/clientes/index');
            }, 500);
        };
    }

    get sair() {
        return (req, res) => {
            req.session.cliente = undefined;
            res.redirect('../index');
        }
    }

    get login() {
        return (req, res) => {
            if (!req.session.cliente) { 
                let user = JSON.parse(req.params.user);
                ClienteController.login(req, res, user);
            } else res.redirect('/clientes/index');
        };
    }

    public init() {
        this.router.get('/index', this.index);
        this.router.get('/sair', this.sair);
        this.router.get("/profile", this.profile);
        this.router.post("/login/:user", this.login);
        this.router.get('/session/:id', this.session);
    }
}

const clientRouter = new ClientRoute();
clientRouter.init();
 

export default clientRouter.router;