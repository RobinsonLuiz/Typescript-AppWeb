import connectionFactory from '../config/connectionFactory';

class LoginRoute {

    private _postgres: any;

    constructor() {
        this._postgres = connectionFactory.pool;
    }

    updateRota(route) {
        return route;
    }

    get postgres() {
        return this._postgres;
    }

    get login() {
        return (req, res) => {
            let user = JSON.parse(req.params.user);
            this.postgres.query('select nome,id,ativado from administrador where email = $1 and senha = md5($2)', [user.email, user.senha], function(err, results) {
                if (!err) {
                    if (results.rows && results.rows.length > 0) {
                        if (results.rows[0].ativado == 1) {
                            req.session.user = results.rows[0];
                            req.session.isLogged = true;
                            res.send(JSON.stringify({"OK": results.rows[0].id}));
                        } else {
                            res.send(JSON.stringify({"OK": "desatived"}));
                        }
                    } else res.send(JSON.stringify({"OK": false}));
                } else res.send(JSON.stringify({"OK": "errorBank"}));
            });
        };
    }

    get confirmLogin() {
        return (req, res) => {
            this.postgres.query("select email,id from administrador where token = $1 and token != ''", [String(req.params.id)], function(err, results) {
                if(!err && results.rows.length > 0) res.render('confirmar', {usuario: results.rows[0]});
                else res.status(404).json("Não achado");
            });
        }
    }
} 

export default new LoginRoute();