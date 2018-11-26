import connectionFactory from '../config/connectionFactory';
import ClientController from '../controller/ClienteController';

class IndexRoute {

    private _postgres: any;

    constructor() {
        this._postgres = connectionFactory.pool;
    }
    
    get postgres() {
        return this._postgres;
    }


    get index(): object {
        return (req, res) => { 
            const hour = 3000000
            req.session.cookie.expires = new Date(Date.now() + hour);
            req.session.cookie.maxAge = hour;
            if (req.session.administrador) res.redirect('painel');
            else res.render('index', {success: false, administrador: false});
        }
    }

    get logout(): object {
        return (req, res) => {
            req.session.administrador = undefined;
            req.session.administradorClientes = undefined;
            res.redirect('/');
        }
    }

    get session(): object {
        return (req, res) => {
            setTimeout(() => {
                res.redirect('/administrador/painel');
            }, 500);
        };
    }

    get clientes(): object {
        return (req, res) => {
            ClientController.getClientes(req,res);
        }
    }

    get painel(): object {
        return async (req, res) => {
            ClientController.painel(req, res); 
        }
    }

    get charts(): object {
        return (req, res) => {
            if (req.session.administrador) {
                res.render('charts', {administrador: req.session.administrador, clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.administrador.administradorClientes != undefined ? req.session.administrador.administradorClientes : ''});
            } else res.render("403");
        }
    }
}
 

export default new IndexRoute();