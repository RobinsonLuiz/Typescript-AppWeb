import mailer  from '../config/mailer';
import * as uuidv1 from 'uuid';
import connectionFactory from '../config/connectionFactory';

class RegisterRoute {

    private _postgres: any;
    private _mailer: mailer;

    constructor() {
        this._mailer = new mailer();
        this._postgres = connectionFactory.pool;
    }

    get mailer() {
        return this._mailer;
    }

    updateRota(route) {
        return route;
    }

    get postgres() {
        return this._postgres;
    }

    get ativar() {
        return (req , res) => {
            this.postgres.query("update administrador set senha = md5($1), token = '', ativado = 1 where id = $2", [req.body.senha, req.body.id], function(err, results) {
                if (!err) res.render("index", {usuario: false});
                else res.status(404).end();
            });
        }
    }

    get verificaForm() {
        return (req, res) => {
            let administrador = JSON.parse(req.params.form);
            let uuid = uuidv1().split("-");
            administrador.senha = uuid[0];
            administrador.ativado = 0;
            administrador.token = uuid[0];
            let bind = this;
            this.postgres.query("select * from administrador where email = $1", [administrador.email], function(err, results) {
                if (!err && results.rows.length > 0) {
                    res.send({register: "cadastrado"});
                } else if (!err) {
                    let opEmail = {
                        from: "'Controle de Tarefas' <ecommerceTemp@gmail.com>",
                        to: administrador.email,
                        subject: "Confirmação de Cadastro",
                        text: `Olá ${administrador.nome}, obrigado por se cadastrar em nosso site! Por favor confirme o cadastro no seguinte link http://localhost/confirmar/${uuid[0]}`
                    };
                    
                    bind.mailer.transporter.sendMail(opEmail, function (err, info) {
                        if (err) console.log(err);
                        else console.log("Mensagem enviada com sucesso");
                    });

                    let insert_administrador = [administrador.nome, administrador.email, administrador.telefone, administrador.ativado, administrador.senha,administrador.token];
                    bind.postgres.query("insert into administrador (nome,email,telefone,ativado,senha,token) VALUES ($1,$2,$3,$4,md5($5),$6)", insert_administrador, function(err, results) {
                        if (!err) res.send({register: "OK"});
                        else res.send({register: false});
                    })
                }
            });
        }
    }

    get validaClient() {
        return (req, res) => {
            let client = JSON.parse(req.params.client);
            this.postgres.query("select * from cliente where email = $1 and id_adm = $2", [client.email, req.session.user.id], (err, doc) => {
                if (!err) {
                    if (doc.rows.length > 0) {
                        res.send({register: 'cadastrado'});
                    } else {
                        let client_response = [client.nome, client.email,new Date(), 'indefinedo', uuidv1().split('-')[0], req.session.user.id];
                        if (req.session.user.clientes) req.session.user.clientes += client.nome;
                        this.postgres.query("insert into cliente (nome,email,ultimoacesso,situacao,senha,id_adm) VALUES ($1,$2,$3,$4,md5($5),$6)", client_response, function(err, results) {
                            if (!err) {
                                res.send({register: "ok"});
                            } else res.send({register: "error"})
                        })
                    }
                } else res.send({register: 'error'});
            });
        }
    }

    private async resolveRequestBank(query, params) {
        return new Promise((resolve, reject) => {
            resolve(this.postgres.query(query, params));
        })
    }
}

export default new RegisterRoute();
