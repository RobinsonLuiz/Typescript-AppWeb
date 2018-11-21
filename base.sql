CREATE TABLE administrador(id serial, 
    nome varchar(100) NOT NULL, 
    email varchar(100) NOT NULL, 
    token varchar(32), 
    senha varchar(32), 
    telefone varchar(13) NOT NULL, 
    ativado Integer not null check(ativado = 0 or ativado = 1),
    CONSTRAINT "primarykey" PRIMARY KEY (id));

CREATE TABLE cliente(id serial NOT NULL,
    nome varchar(100) NOT NULL,
    situacao varchar(500) NOT NULL,
    ultimoacesso date NOT NULL,
    id_adm Integer NOT NULL,
    CONSTRAINT "foreignkey" FOREIGN KEY (id_adm) REFERENCES administrador(id));