import Administrador from "./Administrador";

class Cliente {
    private _nome: string;
    private _email: string;
    private _date: Date;
    private _situacao: string; 
    private _senha: string;
    private _idAdm: number;

    constructor(nome: string, email: string, date: Date, 
        situacao: string, senha: string, idAdm: number) {
            this._nome = nome;
            this._email = email;
            this._date = date;
            this._situacao = situacao;
            this._senha = senha;
            this._idAdm = idAdm;
    }

    get nome() {
        return this._nome;
    }

    get email() {
        return this._email;
    }

    get date() {
        return this._date;
    }

    get situacao() {
        return this.situacao;
    }

    get senha() {
        return this._senha;
    }

    get idAdm() {
        return this._idAdm;
    }
}

export default Cliente;