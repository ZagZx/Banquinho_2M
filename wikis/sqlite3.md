# SQLite3

O **SQLite3** é uma biblioteca padrão do Python para a manipulação de bancos de dados leves e locais do tipo `SQLite` de forma simples. Por não precisar de servidor, é uma ótima escolha para pequenos projetos.

## Configurações

Para fazer operações com os scripts SQL é preciso realizar algumas configurações prévias no código.

```python
import sqlite3


FILE = 'banco.db' # Caminho de exemplo

conn = sqlite3.connect(FILE)
cursor = conn.cursor()

...

conn.commit()
conn.close()
```

> [!NOTE]
> A linha `conn.commit()` só é necessária se o banco de dados for alterado.

### `sqlite3.connect()`

Essa função retorna uma conexão com o banco de dados, sendo assim possível a sua manipulação.

> [!IMPORTANT]
> Após todas as operações serem realizadas é importante que a conexão seja fechada com a função `close()`.

> [!NOTE]
> Caso o arquivo do banco de dados não exista, a função criará um.

## `cursor`

O objeto `cursor` será o responsável pelas operações, oferecendo assim, algumas funções para a manipulação do banco de dados. Ele também atua como "ponteiro" para o resultado da consulta.


### Métodos do cursor

#### `execute(sql, [parameters])`

Executa uma instrução SQL.

> [!IMPORTANT]
> `execute()` executará apenas uma única instrução SQL.

```python
cursor.execute("""
    create table user(
        id int primary key,
        nome text
    );
""")
```

É possível também fazer uma operação com passagem de parâmetros, como por exemplo:

```python
cursor.execute('select * from user where nome = ?', ('João',))
```

#### `executemany(sql, seq_of_parameters)`

Executa um script, assim como o [`execute()`](#executesql-parameters). Porém ele permite a passagem de múltiplos parâmetros. Por exemplo:

```python
users = [
    (1, 'João'),
    (2, 'Maria'),
    (3, 'Fulano'),
    (4, 'Cicrano')
]
cursor.executemany('insert into user values (?, ?)', users)
```

#### `executescript(sql_script)`

Este método executa uma string com um script SQL, podendo assim executar várias instruções de uma única vez.

```python
cursor.executescript("""
    create table person(
        firstname,
        lastname,
        age
    );

    create table book(
        title,
        author,
        published
    );

    insert into book (title, author, published) values (
        'Dirk Gently''s Holistic Detective Agency',
        'Douglas Adams',
        1987
    );
""")
```

Essa característica permite operações mais organizadas, como ter o script num arquivo separado `.sql`.

```python
with open(FILE) as f:
    cursor.executescript(f.read())
```

### Métodos de leitura

#### `fetchone()`

Recupera a próxima linha do resultado da consulta como uma tupla, ou None se não houver mais linhas.

```python
resultado = cursor.execute('select * from user').fetchone()
print(resultado) # Output: (1, 'João')
```

#### `fetchmany([size])`

Recupera um número específico de linhas do resultado da consulta como uma lista de tuplas. Se o tamanho não for especificado, busca todas as linhas restantes.

```python
resultado = cursor.execute('select * from user').fetchmany(3)
print(resultado) # Output: [(1, 'João'), (2, 'Maria'), (3, 'Fulano')]
```

#### `fetchall()`

Recupera todas as linhas restantes do resultado da consulta como uma lista de tuplas.

```python
resultado = cursor.execute('select * from user').fetchall()
print(resultado) # Output: [(1, 'João'), (2, 'Maria'), (3, 'Fulano'), (4, 'Cicrano')]
```

## Referências

- [sqlite3— Interface DB-API 2.0 para bancos de dados SQLite](https://docs.python.org/pt-br/3.9/library/sqlite3.html)