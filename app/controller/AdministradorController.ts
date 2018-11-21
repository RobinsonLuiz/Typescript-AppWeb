import connectionFactory from '../config/connectionFactory';
import Administrador from '../model/Administrador';
import mailer  from '../config/mailer';
import * as uuidv1 from 'uuid';

class AdministradorController {

    private _postgres: any;
    private _mailer: mailer;

    constructor() {
        this._postgres = connectionFactory.pool;
        this._mailer = new mailer();
    }

    get postgres() {
        return this._postgres;
    }

    get mailer() {
        return this._mailer;
    }

    public insert(req, res, administrador) {
        let admin = new Administrador(administrador.nome, administrador.email, administrador.telefone, administrador.ativado, administrador.senha,administrador.token);
        this.postgres.query("select * from administrador where email = $1", [administrador.email], (err, results) => {
            if (!err && results.rows.length > 0) {
                res.send({register: "cadastrado"});
            } else if (!err) {
                let opEmail = {
                    from: "'Controle de Tarefas' <ecommerceTemp@gmail.com>",
                    to: admin.email,
                    subject: "Confirmação de Cadastro",
                    text: `Olá ${admin.nome}, obrigado por se cadastrar em nosso site! Por favor confirme o cadastro no seguinte link http://localhost/confirmar/${admin.token}`
                };
                
                this.mailer.transporter.sendMail(opEmail, function (err, info) {
                    if (err) console.log(err);
                    else console.log("Mensagem enviada com sucesso");
                });

                let insert_administrador = [admin.nome, admin.email, admin.telefone, admin.ativado, admin.senha, admin.token];
                this.postgres.query("insert into administrador (nome,email,telefone,ativado,senha,token) VALUES ($1,$2,$3,$4,md5($5),$6)", insert_administrador, function(err, results) {
                    if (!err) res.send({register: "OK"});
                    else res.send({register: false});
                })
            }
        });
    }

    public update(req, res) {
        this.postgres.query("update administrador set senha = md5($1), token = '', ativado = 1 where id = $2", [req.body.senha, req.body.id], function(err, results) {
            if (!err) res.render("index", {usuario: false});
            else res.status(404).end();
        });
    };
}


export default new AdministradorController();