CREATE TABLE administrador(id Integer NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    nome varchar(100) NOT NULL, 
    email varchar(100) NOT NULL, 
    token varchar(32), 
    senha varchar(32), 
    telefone varchar(13) NOT NULL, 
    ativado Integer not null check(ativado = 0 or ativado = 1));

CREATE TABLE cliente(id Integer NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome varchar(100) NOT NULL,
    email varchar(30) NOT NULL,
    senha varchar(32) NOT NULL,
    situacao varchar(500) NOT NULL,
    ultimoacesso date NOT NULL,
    id_adm Integer NOT NULL,
    CONSTRAINT `foreignkey` FOREIGN KEY (id_adm) REFERENCES administrador (id));


CREATE TABLE mensagens(id Integer NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_usuario_recebe Integer NOT NULL,
    id_usuario_envia Integer NOT NULL,
    texto varchar(100) NOT NULL,
    data_envio Date NOT NULL,
    lida boolean, 
    CONSTRAINT `foreignkey_envio` FOREIGN KEY (id_usuario_envia) REFERENCES administrador (id),
    CONSTRAINT `foreignkey_recebe` FOREIGN KEY (id_usuario_recebe) REFERENCES administrador (id));