import * as mysql from 'mysql';

class connectionFactory {

    private _config: object;

    constructor() {
        this._config = mysql.createPool({
            host: 'localhost',
            port: '3307',
            user: 'root',
            password: 'root',
            database: 'controledetarefas'
        });
    }

    get pool() {
        return this._config;
    }
}

export default new connectionFactory();