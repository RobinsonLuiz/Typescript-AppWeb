import connectionFactory from '../config/connectionFactory';

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
            res.render("area_clientes");
        }
    }

    get login(): object {
        return (req, res) => { 
            res.render("area_clientes");
        }
    }
}
 

export default new ClientRoute();