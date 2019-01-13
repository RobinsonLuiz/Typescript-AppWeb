import connectionFactory from '../config/connectionFactory';
import AdministradorController from '../controller/AdministradorController';
import * as recaptcha from 'express-recaptcha';
import { Router } from 'express';

class LoginRoute {

    private _postgres: any;
    private _recaptcha: any = recaptcha.Recaptcha;
    public router: any = Router();

    constructor() {
        this._postgres = connectionFactory.pool;
    }

    get postgres() {
        return this._postgres;
    }

    get login() {
        return (req, res) => {
            let user = JSON.parse(req.params.user);
            // if (user.captcha.length > 0) {
            // } else res.status(500).json("Problemas internos com o recaptcha");
            AdministradorController.login(req, res, user);
        };
    }

    get confirmLogin() {
        return (req, res) => {
            AdministradorController.confirmLogin(req, res);
        }
    }

    public init() {
        this.router.post('/login/:user', this.login);
        this.router.get('/confirmar/:id', this.confirmLogin);
    }
}

let loginRouter = new LoginRoute();
loginRouter.init();

export default loginRouter.router;