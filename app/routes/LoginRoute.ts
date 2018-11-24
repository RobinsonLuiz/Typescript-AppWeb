import connectionFactory from '../config/connectionFactory';
import AdministradorController from '../controller/AdministradorController';
class LoginRoute {

    private _postgres: any;

    constructor() {
        this._postgres = connectionFactory.pool;
    }

    get postgres() {
        return this._postgres;
    }

    get login() {
        return (req, res) => {
            let user = JSON.parse(req.params.user);
            AdministradorController.login(req, res, user);
        };
    }

    get confirmLogin() {
        return (req, res) => {
            AdministradorController.confirmLogin(req, res);
        }
    }
} 

export default new LoginRoute();