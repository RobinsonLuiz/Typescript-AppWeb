import connectionFactory from '../config/connectionFactory';
import AdministradorController from '../controller/AdministradorController';
import * as recaptcha from 'express-recaptcha';

class LoginRoute {

    private _postgres: any;
    private _recaptcha: any = recaptcha.Recaptcha;

    constructor() {
        this._postgres = connectionFactory.pool;
    }

    get postgres() {
        return this._postgres;
    }

    get login() {
        return (req, res) => {
            let user = JSON.parse(req.params.user);
            if (user.captcha.length > 0) {
                AdministradorController.login(req, res, user);
            } else res.status(403).json("Problemas internos");
        };
    }

    get confirmLogin() {
        return (req, res) => {
            AdministradorController.confirmLogin(req, res);
        }
    }
}

export default new LoginRoute();