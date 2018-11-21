class Administrador {

    private _id: number;
    private _nome: string;
    private _email: string;
    private _telefone: string;
    private _ativado: string;
    private _senha: string;
    private _token: string;

    constructor(nome: string, email: string, telefone: string, 
        ativado: string, senha: string, token:string) {
            this._nome = nome;
            this._email = email;
            this._telefone = telefone;
            this._ativado = ativado;
            this._senha = senha;
            this._token = token;
    };

    get nome() {
        return this._nome
    }

    get email() {
        return this._email;
    }

    get telefone() {
        return this._telefone;
    }

    get ativado() {
        return this._ativado;
    }

    get senha() {
        return this._senha;
    }

    get token() {
        return this._token;
    }

    get id() {
        return this._id;
    }
}; 


export default Administrador;