import sqlite3

BANCO = './banco.db' # Caminho e arquivo em que o banco ficará armazenado
SQL_INICIAL = './schema.sql' # Arquivo que será executado para criar as tabelas (OBS: este só será rodado uma vez)

# Cria a conexão
conexao = sqlite3.connect(BANCO)

# Executando um arquivo SQL (schema.sql)
with open(SQL_INICIAL) as arquivo:
    conexao.executescript(arquivo.read())
conexao.commit() # Sempre utilizar após rodar um comando ou um script
conexao.close() # Sempre fechar a conexão após fazer tudo que for necessário

# Executando um comando com parâmetros que serão passados pelo python
conexao = sqlite3.connect(BANCO) # Restabelecendo a conexão, pois fechamos ela anteriormente ao executar o schema.sql
comando = 'INSERT INTO usuarios(nome, email, senha_hash) VALUES (?, ?, ?)' 

nome = 'Livia Lopi'
email = 'livia@example.com'
senha_hash = 'HashMuitoGrandeEsecreto'


conexao.execute(comando, (nome, email, senha_hash)) # Os parâmetros devem seguir a ordem das interrogações
conexao.commit()
conexao.close()

# E se os parâmetros forem em partes diferentes do comando? (SET e WHERE)
# são passado os parâmetros da mesma forma, sempre seguindo a ordem das interrogações
conexao = sqlite3.connect(BANCO)
comando = "UPDATE usuarios SET nome = ? WHERE id = ?"

id = 1
novo_nome = 'Livia Lopes'

conexao.execute(comando, (novo_nome, id)) # 1° SET nome = ? | 2° WHERE id = ?
conexao.commit()
conexao.close()

# RESULTADO FINAL NA TABELA usuarios:
# id |     nome    |       email       |        senha_hash       |
# 1  | Livia Lopes | livia@example.com | HashMuitoGrandeEsecreto |