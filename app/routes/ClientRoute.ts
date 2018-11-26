import connectionFactory from '../config/connectionFactory';
import ClienteController from '../controller/ClienteController';

class ClientRoute {

    private _postgres: any;

    constructor() {
        this._postgres = connectionFactory.pool;
    }
    
    get postgres() {
        return this._postgres;
    }


    get index(): object {
        return (req, res) => {
            if (req.session.cliente) {
                res.render("./area_cliente/index");
            } else res.render('403');
        }
    }

    get profile(): object {
        return (req, res) => {
            if (req.session.cliente) { 
                res.render("./area_cliente/profile");
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

    get login() {
        return (req, res) => {
            let user = JSON.parse(req.params.user);
            ClienteController.login(req, res, user);
        };
    }
}
 

export default new ClientRoute();