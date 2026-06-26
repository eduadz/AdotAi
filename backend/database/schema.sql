CREATE SCHEMA adotai;

CREATE TABLE adotai.usuarios(
	id_usuario SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	cpf VARCHAR(9) NOT NULL,
	telefone VARCHAR(15) NOT NULL,
	email VARCHAR(25) UNIQUE NOT NULL,
	senha VARCHAR(8) UNIQUE NOT NULL
);

CREATE TABLE adotai.enderecos(
	cidade VARCHAR(30) DEFAULT "FLORESTAL",
	logradouro VARCHAR(50) NOT NULL,
	bairro VARCHAR(50) NOT NULL,
	numero VARCHAR(5) NOT NULL,
	id_endereco SERIAL,
	id_usuario INT,
	PRIMARY KEY (id_endereco, id_usuario),

	CONSTRAINT fk_usuarios
		FOREIGN KEY (id_usuario)
		REFERENCES adotai.usuarios(id_usuario)
		ON DELETE CASCADE
);

CREATE TABLE adotai.pets(
	id_pet SERIAL PRIMARY KEY,
	tipo VARCHAR(15),
	genero VARCHAR(15),
	porte VARCHAR(15),
	cor_pelagem VARCHAR(15),
	tipo_pelagem VARCHAR(15),
	idade VARCHAR(15),
	energia VARCHAR(15),
	comorbidade VARCHAR(80),
	castrado VARCHAR(3),
	likes INT
);
