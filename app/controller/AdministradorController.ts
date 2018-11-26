import connectionFactory from '../config/connectionFactory';
import Administrador from '../model/Administrador';
import mailer  from '../config/mailer';

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
        this.postgres.query("select * from administrador where email = ?", [administrador.email], (err, results) => {
            if (!err && results.length > 0) {
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
                this.postgres.query("insert into administrador (nome,email,telefone,ativado,senha,token) VALUES (?,?,?,?,md5(?),?)", insert_administrador, function(err, results) {
                    if (!err) res.send({register: "OK"});
                    else res.send({register: false});
                });
            };
        });
    }

    public update(req, res) {
        this.postgres.query("update administrador set senha = md5(?), token = '', ativado = 1 where id = ?", [req.body.senha, req.body.id], function(err, results) {
            if (!err) res.render("index", {administrador: false});
            else res.status(404).json("Ocorreu um erro no update");
        });
    };

    public login(req, res, user) {
        this.postgres.query('select nome,id,ativado,email from administrador where email = ? and senha = md5(?)', [user.email, user.senha], function(err, results) {
            if (!err) {
                if (results && results.length > 0) {
                    if (results[0].ativado == 1) {
                        req.session.administrador = results[0];
                        res.send(JSON.stringify({"OK": results[0]}));
                    } else {
                        res.send(JSON.stringify({"OK": "desatived"}));
                    }
                } else res.send(JSON.stringify({"OK": false}));
            } else res.send(JSON.stringify({"OK": "errorBank"}));
        });
    }

    public confirmLogin(req, res) {
        this.postgres.query("select email,id from administrador where token = ? and token != ''", [String(req.params.id)], function(err, results) {
            if(!err && results.length > 0) res.render('confirmar', {administrador: results[0]});
            else res.status(404).json("Você já confirmou sua conta ou o código de acesso não existe");
        });
    }
}


export default new AdministradorController();