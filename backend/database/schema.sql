CREATE SCHEMA IF NOT EXISTS adotai;

-- Usuários comuns da aplicação: podem visualizar, curtir e solicitar adoção.
CREATE TABLE adotai.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
);

-- Administradores: responsáveis por cadastrar, editar e remover animais.
CREATE TABLE adotai.administradores (
    id_admin SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
);

CREATE TABLE adotai.enderecos (
    id_endereco SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    cidade VARCHAR(50) DEFAULT 'FLORESTAL',
    logradouro VARCHAR(100) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    numero VARCHAR(10) NOT NULL,

    CONSTRAINT fk_endereco_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES adotai.usuarios(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE adotai.pets (
    id_pet SERIAL PRIMARY KEY,
    id_admin INT NOT NULL,

    nome VARCHAR(80) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(20),              -- cachorro, gato etc.
    genero VARCHAR(20),            -- macho, femea
    porte VARCHAR(20),             -- pequeno, medio, grande
    cor_pelagem VARCHAR(30),
    tipo_pelagem VARCHAR(30),
    idade VARCHAR(20),             -- filhote, adulto, idoso
    energia VARCHAR(20),           -- baixa, media, alta
    comorbidade VARCHAR(100),
    castrado BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'disponivel', -- disponivel, em_adocao, adotado

    CONSTRAINT fk_pet_admin
        FOREIGN KEY (id_admin)
        REFERENCES adotai.administradores(id_admin)
        ON DELETE RESTRICT
);

-- Fotos dos animais. Pode armazenar URL local ou de serviço externo.
CREATE TABLE adotai.pet_fotos (
    id_foto SERIAL PRIMARY KEY,
    id_pet INT NOT NULL,
    url TEXT NOT NULL,

    CONSTRAINT fk_foto_pet
        FOREIGN KEY (id_pet)
        REFERENCES adotai.pets(id_pet)
        ON DELETE CASCADE
);

-- Like/interesse leve do usuário por um animal.
CREATE TABLE adotai.pet_likes (
    id_usuario INT NOT NULL,
    id_pet INT NOT NULL,

    PRIMARY KEY (id_usuario, id_pet),

    CONSTRAINT fk_like_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES adotai.usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_like_pet
        FOREIGN KEY (id_pet)
        REFERENCES adotai.pets(id_pet)
        ON DELETE CASCADE
);

-- Pedido formal de adoção feito pelo usuário.
CREATE TABLE adotai.pedidos_adocao (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_pet INT NOT NULL,
    mensagem TEXT,
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, aceito, recusado, cancelado

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES adotai.usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_pedido_pet
        FOREIGN KEY (id_pet)
        REFERENCES adotai.pets(id_pet)
        ON DELETE CASCADE,

    CONSTRAINT uq_usuario_pet_pedido
        UNIQUE (id_usuario, id_pet)
);
