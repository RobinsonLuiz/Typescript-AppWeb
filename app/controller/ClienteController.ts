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

    get mailer() {
        return this._mailer;
    }

    public insert(req, res, client) { 
        let cliente = new Cliente(client.nome, client.email, new Date(), 'indefinido', uuidv1().split('-')[0], req.session.administrador.id);
        this.postgres.query("select * from cliente where email = ? and id_adm = ?", [cliente.email, req.session.administrador.id], (err, doc) => {
            if (!err) {
                if (doc.length > 0) {
                    res.send({register: 'cadastrado'});
                } else {
                    if (req.session.administrador.clientes) req.session.administrador.clientes += cliente.nome;
                    let opEmail = {
                        from: "'Controle de Tarefas' <ecommerceTemp@gmail.com>",
                        to: cliente.email,
                        subject: "Confirmação de Cadastro",
                        text: `Olá ${cliente.nome}, você foi cadastrado no controle de tarefas, sua senha é ${cliente.senha}
                        Desconsidere caso não tenha feito nenhum pedido para fazer parte do controle de tarefas`
                    };

                    this.mailer.transporter.sendMail(opEmail, function (err, info) {
                        if (err) console.log(err);
                        else console.log("Mensagem enviada com sucesso");
                    });

                    let cliente_response = [cliente.nome, cliente.email, cliente.date, cliente.situacao, cliente.senha, req.session.administrador.id];
                    this.postgres.query("insert into cliente (nome, email, ultimoacesso, situacao, senha, id_adm) VALUES (?,?,?,?,?,?)", cliente_response, function(err, results) {
                        if (!err) {
                            res.send({register: "ok"});
                        } else {
                            res.send({register: "error"});
                        }
                    });
                }
            } else res.send({register: 'error'});
        });
    }

    public login(req, res, user) {
        console.log(user.senha);
        this.postgres.query('select * from cliente where email = ? and senha = ?', [user.email, user.senha], function(err, results) {
            if (!err) {
                if (results && results.length > 0) {
                    req.session.cliente = results[0];
                    res.send(JSON.stringify({"OK": results[0]}));
                } else res.send(JSON.stringify({"OK": false}));
            } else res.send(JSON.stringify({"OK": "errorBank"}));
        });
    }

    public getClientes(req, res) {
        if (req.session.administrador) {
            this.resolveRequestBank("select * from cliente where id_adm = ?", req.session.administrador.id).then((result) => {
                if (result) {
                    result.forEach(client => {
                        client.ultimoacesso = this.inverterData(client.ultimoacesso.toISOString().split('T')[0]);
                    });
                }
                res.render('clientes', {administrador: req.session.administrador, clientes_table: result ? result : [], clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.administrador.clientes != undefined ? req.session.administrador.clientes : ''});
            });
        } else res.render("403");
    }

    public painel(req, res) {
        if (req.session.administrador) {
            let promise1 = this.resolveRequestBank("select * from administrador where id = ?", req.session.administrador.id);
            let promise2 = this.resolveRequestBank("select count(id) as mensagens from mensagens where id_usuario_recebe = ? and lida = false", req.session.administrador.id);
            let promise3 = this.resolveRequestBank("select * from cliente where id_adm = ?", req.session.administrador.id)
            Promise.all([promise1, promise2, promise3]).then((data) => {
                let clients = '';
                if (data[2] && data[2].length > 0) {
                    data[2].forEach(client => {
                        clients += client.nome + ","
                    });
                    req.session.administrador.clientes = clients;
                    clients = '';
                    req.session.clientes_tarefas = data[2];
                }
                res.render('painel', {administrador:  req.session.administrador, mensagens: data[1][0].mensagens != 0 ? data[1][0].mensagens : 0, clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.administrador.clientes != undefined ? req.session.administrador.clientes : '', tarefas: false, desafios: false});
                }).catch((error) => {
                    console.log(error);
                    if (req.session.administrador) res.redirect('painel');
                    else res.redirect('index');
                });
        } else {
            res.render("403");
        }
    }

    private inverterData(date): string {
        let data = date.split('-');
        return data[2] + "/" + data[1] + "/" + data[0];
    }


    private async resolveRequestBank(query, params): Promise<any> {
        return new Promise((resolve, reject) => {
            this.postgres.query(query, [params], function (err, results) {
                if (err) return reject(err);
                return resolve(results);
            });
        });
    }


}

export default new ClienteController();
