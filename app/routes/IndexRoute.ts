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
            if (req.session.user) res.redirect('painel');
            else res.render('index', {success: false, usuario: false});
        }
    }

    get logout(): object {
        return (req, res) => {
            req.session.user = undefined;
            req.session.clientes = undefined;
            res.redirect('/');
        }
    }

    get session(): object {
        return (req, res) => {
            setTimeout(() => {
                res.redirect('/painel');
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
            if (req.session.user) {
                res.render('charts', {usuario: req.session.user, clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.user.clientes != undefined ? req.session.user.clientes : ''});
            } else res.render("403");
        }
    }
}
 

export default new IndexRoute();