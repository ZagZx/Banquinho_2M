# SQLAlchemy

O **SQLAlchemy** é uma biblioteca `Python` que cria e manipula bancos de dados num formato **ORM** (**O**bject **R**elational **M**odal). Ou seja, cada tabela é retradata como um objeto em `Python`.

## Como instalar o `SQLAlchemy`

```sh
pip install sqlalchemy
```

## Configurações iniciais

Para que seja possível a manipulação ou criação, é preciso algumas configurações iniciais. Nessa introdução vamos usar um banco de dados `SQLite`, por ser leve e não precisar de servidor.

> [!NOTE]
> Há outras forma de criar e retratar cada entidade, porém aqui cada entidade será uma classe `Python`.

```python
from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.orm import declarative_base, sessionmaker


URL = 'sqlite:///data.db' # URL do banco SQlite
engine = create_engine(URL)
Session = sessionmaler(bind=engine)
Base = declarative_base()
```

### Para que serve cada coisa?

- **engine:** Responsável por "traduzir" o banco para objetos em python;
- **Session:** A Session é usada para manipular o banco;
- **Base:** Classe base usada em cada classe;

---

Vamos fazer uma classe que represente uma entidade usuário, com: id, nome, email, senha.

```python
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True)
    senha = Column(Text, nullable=False)
```

### Como funciona?

A classe usuário representa uma entidade que tem:

- **ID:** chave primária, auto increment e não nulo;
- **NOME:** não nulo;
- **EMAIL:** não nulo e único;
- **SENHA:** não nulo;

---

### Como criar o banco de dados

Para que todos os banco de dados sejam criados, é extremanente simples.

```python
Base.metadata.create_all(engine)
```

## Relacionamento com `SQLAlchemy`

Para criar um relacionamento entre as entidades existem 3 formas.

- **N:1**
- **1:1**
- **N:N**

### N:1

Nesse exemplo, criaremos 2 tabelas, uma com o usuário e outra com os enderenços do usuário.

Para fazer o relacionamento, vamor importar algumas coisas.

```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
```

```python
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True)
    senha = Column(Text, nullable=False)

    enderecos = relationship('Endereco', back_populates='usuario')


class Endereco(Base):
    __tablename__ = 'enderecos'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    rua = Column(Text, nullable=False)
    bairro = Column(Text, nullable=False)
    cidade = Column(Text, nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), nullable=False)

    usuario = relationship('Usuario', back_populates='enderecos')
```

<!-- Explicar como funciona -->
