import * as pg from 'pg';

class connectionFactory {

    private _config: object;
    private _pool: any;

    constructor() {
        this._config = {
            user: 'postgres',
            password: '325140',
            database: 'controle_tarefas',
            host: 'localhost',
            port: 5432
        }
        this._pool = new pg.Pool(this._config);
    }

    get pool() {
        return this._pool;
    }
}

export default new connectionFactory();