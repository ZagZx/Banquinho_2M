DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- em SQLite não tem o underline em AUTO_INCREMENT
    nome VARCHAR(50),
    email VARCHAR(255),
    senha_hash VARCHAR(255)
)