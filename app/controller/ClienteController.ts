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
        let cliente = new Cliente(client.nome, client.email,new Date(), 'indefinido', uuidv1().split('-')[0], req.session.user.id);
        this.postgres.query("select * from cliente where email = $1 and id_adm = $2", [cliente.email, req.session.user.id], (err, doc) => {
            if (!err) {
                if (doc.rows.length > 0) {
                    res.send({register: 'cadastrado'});
                } else {
                    if (req.session.user.clientes) req.session.user.clientes += cliente.nome;
                    let opEmail = {
                        from: "'Controle de Tarefas' <ecommerceTemp@gmail.com>",
                        to: cliente.email,
                        subject: "Confirmação de Cadastro",
                        text: `Olá ${cliente.nome}, você foi cadastrado no controle de tarefas, sua senha é ${client.senha}
                        Desconsidere caso não tenha feito nenhum pedido para fazer parte do controle de tarefas`
                    };
                    this.mailer.transporter.sendMail(opEmail, function (err, info) {
                        if (err) console.log(err);
                        else console.log("Mensagem enviada com sucesso");
                    });
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

    public getClientes(req, res) {
        if (req.session.user) {
            this.resolveRequestBank("select * from cliente where id_adm = $1", req.session.user.id).then((result) => {
                result['rows'].forEach(client => {
                    client.ultimoacesso = this.inverterData(client.ultimoacesso.toISOString().split('T')[0]);
                });
                res.render('clientes', {clientes_table:  result['rows'], clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.user.clientes != undefined ? req.session.user.clientes : ''});
            });
        } else res.render("403");
    }

    public painel(req, res) {
        if (req.session.user) {
            let promise1 = this.resolveRequestBank("select * from administrador where id = $1", req.session.user.id);
            let promise2 = this.resolveRequestBank("select count(id) as mensagens from mensagens where id_usuario_recebe = $1 and lida = true", req.session.user.id);
            let promise3 = this.resolveRequestBank("select * from cliente where id_adm = $1", req.session.user.id)
            Promise.all([promise1, promise2, promise3]).then((data) => {
                let clients = '';
                data[2]['rows'].forEach(client => {
                    clients += client.nome + ","
                });
                req.session.user.clientes = clients;
                clients = '';
                req.session.clientes_tarefas = data[2]['rows'];
                res.render('painel', {usuario:  req.session.user, mensagens: data[1]['rows'][0].mensagens, clientes_tarefas: req.session.clientes_tarefas ? req.session.clientes_tarefas : '', clientes: req.session.user.clientes != undefined ? req.session.user.clientes : '', tarefas: false, desafios: false});
            }).catch((error) => {
                if (req.session.user) res.redirect('painel');
                else res.redirect('index');
            })
        } else {
            res.render("403");
        }
    }

    private inverterData(date): string {
        let data = date.split('-');
        return data[2] + "/" + data[1] + "/" + data[0];
    }


    private async resolveRequestBank(query, params) {
        return new Promise((resolve, reject) => {
            resolve(this.postgres.query(query, [params]));
        })
    }


}

export default new ClienteController();
