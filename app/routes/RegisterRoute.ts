import mailer  from '../config/mailer';
import * as uuidv1 from 'uuid';
import connectionFactory from '../config/connectionFactory';
import AdministradorController from '../controller/AdministradorController';
import ClienteController from '../controller/ClienteController';

class RegisterRoute {


    constructor() {}


    get ativar() {
        return (req , res) => {
            AdministradorController.update(req, res,)
        }
    }

    get verificaForm() {
        return (req, res) => {
            let administrador = JSON.parse(req.params.form);
            let uuid = uuidv1().split("-");
            administrador.senha = uuid[0];
            administrador.ativado = 0;
            administrador.token = uuid[0];
            AdministradorController.insert(req, res, administrador);
        }
    }


    get validaClient() {
        return (req, res) => {
            let client = JSON.parse(req.params.client);
            ClienteController.insert(req, res, client);
        };
    };
}

export default new RegisterRoute();
