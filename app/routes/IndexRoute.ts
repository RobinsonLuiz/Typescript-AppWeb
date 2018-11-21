import connectionFactory from '../config/connectionFactory';

class IndexRoute {

    private _postgres: any;

    constructor() {
        this._postgres = connectionFactory.pool;
    }
    
    get postgres() {
        return this._postgres;
    }

    updateRota(route='/'): string {
        return route;
    }

    get index(): object {
        return (req, res) => { 
            const hour = 3000000
            req.session.cookie.expires = new Date(Date.now() + hour);
            req.session.cookie.maxAge = hour;
            if (req.session.user) res.redirect('painel');
            else res.render('index', {success: false, usuario: false});
        }
    }

    get logout(): object {
        return (req, res) => {
            req.session.user = undefined;
            req.session.clientes = undefined;
            res.redirect('/');
        }
    }

    get session(): object {
        return (req, res) => {
            setTimeout(() => {
                res.redirect('/painel');
            }, 500);
        };
    }

    get clientes(): object {
        return (req, res) => {
            if (req.session.user) {
                this.resolveRequestBank("select * from cliente where id_adm = $1", req.session.user.id).then((result) => {
                    result['rows'].forEach(client => {
                        client.ultimoacesso = this.inverterData(client.ultimoacesso.toISOString().split('T')[0]);
                    });
                    res.render('clientes', {clientes_table:  result['rows'], clientes: req.session.user.clientes != undefined ? req.session.user.clientes : ''});
                });
            } else res.render("403");
        }
    }

    get painel(): object {
        return async (req, res) => {
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
                    res.render('painel', {usuario:  req.session.user, mensagens: data[1]['rows'][0].mensagens, clientes: req.session.user.clientes != undefined ? req.session.user.clientes : '', tarefas: false, desafios: false});
                }).catch((error) => {
                    if (req.session.user) res.redirect('painel');
                    else res.redirect('index');
                })
            } else {
                res.render("403");
            }
        }
    }

    // private async recursiveRequest(...promises) {
    //     return Promise.all([await promises[0], await promises[1], await promises[2]]);
    // }


    private async resolveRequestBank(query, params) {
        return new Promise((resolve, reject) => {
            resolve(this.postgres.query(query, [params]));
        })
    }

    get charts(): object {
        return (req, res) => {
            if (req.session.user) {
                res.render('charts', {usuario: req.session.user, clientes: req.session.user.clientes != undefined ? req.session.user.clientes : ''});
            } else res.render("403");
        }
    }

    private inverterData(date): string {
        let data = date.split('-');
        return data[2] + "/" + data[1] + "/" + data[0];
    }
}
 

export default new IndexRoute();