import connectionFactory from '../config/connectionFactory';
import Cliente from '../model/Cliente';
import mailer  from '../config/mailer';
import * as uuidv1 from 'uuid';

class ClienteController {
    private _postgres: any;
    private _mailer: mailer;

    constructor() {
        this._postgres = connectionFactory.pool;
        this._mailer = new mailer();
    }

    get postgres() {
        return this._postgres;
    }

    public insert(req, res, client) { 
        let cliente = new Cliente(client.nome, client.email,new Date(), 'indefinido', uuidv1().split('-')[0], req.session.user.id);
        this.postgres.query("select * from cliente where email = $1 and id_adm = $2", [cliente.email, req.session.user.id], (err, doc) => {
            if (!err) {
                if (doc.rows.length > 0) {
                    res.send({register: 'cadastrado'});
                } else {
                    if (req.session.user.clientes) req.session.user.clientes += cliente.nome;
                    let cliente_response = [cliente.nome, cliente.email,new Date(), 'indefinido', uuidv1().split('-')[0], req.session.user.id];
                    this.postgres.query("insert into cliente (nome,email,ultimoacesso,situacao,senha,id_adm) VALUES ($1,$2,$3,$4,md5($5),$6)", cliente_response, function(err, results) {
                        if (!err) {
                            res.send({register: "ok"});
                        } else res.send({register: "error"})
                    })
                }
            } else res.send({register: 'error'});
        });
    }
}

export default new ClienteController();
