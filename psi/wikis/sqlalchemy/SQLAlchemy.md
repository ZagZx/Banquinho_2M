# SQLAlchemy

O **SQLAlchemy** é uma biblioteca `Python` que cria e manipula bancos de dados num formato **ORM** (**O**bject **R**elational **M**apper). Ou seja, cada tabela é retratada como um objeto em `Python`.

## Como instalar o `SQLAlchemy`

```sh
pip install sqlalchemy
```

## Configurações iniciais

Para que seja possível a manipulação ou criação, é preciso algumas configurações iniciais. Nessa introdução vamos usar um banco de dados `SQLite`, por ser leve e não precisar de servidor.

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


URL = 'sqlite:///data.db' # URL do banco SQlite
engine = create_engine(URL)
Session = sessionmaker(bind=engine)
Base = declarative_base()
```

### Para que serve cada coisa?

- **engine:** Responsável por conectar e interagir com o banco de dados;
- **Session:** A Session é usada para manipular o banco;
- **Base:** Classe base usada em cada classe;

---

## Classe Usuário

Vamos fazer uma classe de exemplo que represente uma entidade usuário com id, nome, email e senha.

> [!NOTE]
> Há outras formas de criar e retratar cada entidade, porém aqui cada entidade será uma classe `Python`.

```python
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    senha = Column(String(100), nullable=False)
```

### Como funciona?

A classe `Usuario` representa uma entidade que tem:

- **ID:** chave primária, auto increment e não nulo;
- **NOME:** não nulo;
- **EMAIL:** não nulo e único;
- **SENHA:** não nulo;

### Como criar o banco de dados

Para que todas as tabelas do banco de dados sejam criadas, é extremamente simples.

```python
Base.metadata.create_all(engine)
```

---

## Relacionamentos com `SQLAlchemy`

Para criar um relacionamento entre as entidades existem 3 formas.

- **1:N**
- **1:1**
- **N:N**

### 1:N

Nesse exemplo, criaremos 2 tabelas, uma com o usuário e outra com os enderenços do usuário.

Para fazer o relacionamento, vamos importar algumas coisas.

```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
```

```python
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    senha = Column(String(100), nullable=False)

    enderecos = relationship('Endereco', back_populates='usuario')


class Endereco(Base):
    __tablename__ = 'enderecos'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    rua = Column(String(100), nullable=False)
    bairro = Column(String(100), nullable=False)
    cidade = Column(String(100), nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), nullable=False)

    usuario = relationship('Usuario', back_populates='enderecos')
```

Vamos por partes. Na classe `Usuario` temos o atributo endereços, que recebe `relationship`. Ela estabelece uma relação entre as classes, mas é preciso passar alguns parâmetros para ela.

```python
enderecos = relationship('Endereco', back_populates='usuario')
```

Nesse caso, passa-se como parâmetro o nome da classe a qual `Usuario` se relaciona e passo o equivalente à endereços na classe `Endereco`, através do `back_populates`.

Esse atributo servirá como uma lista que armazena todos os endereços que são do usuário

```python
id_usuario = Column(Integer, ForeignKey('usuarios.id'), nullable=False)

usuario = relationship('Usuario', back_populates='enderecos')
```

Na classe `Enderecos` é adicionada a chave estrangeira que além do tipo e características, recebe a classe `ForeignKey`. Ela explicita que essa coluna se refere ao **ID** de usuário, passando o nome da tabela (usuarios) e o id, ou seja, `usuarios.id`.

Perceba que `Endereco` também tem um atributo que se refere à classe `Usuario`, um `relationship`. Assim como na outra classe ela recebe o nome (`Usuario`) e `back_populates` que, dessa vez, se refere ao atributo da classe `Usuário`.

### 1:1

No relacionamento de 1 para 1 é quase a mesma coisa, porém um pequeno detalhe. Vamos fazer outra representação, dessa vez com um usuário e seu respectivo CPF

```python
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    senha = Column(String(100), nullable=False)

    cpf = relationship('CPF', back_populates='usuario', uselist=False)


class CPF(Base):
    __tablename__ = 'cpfs'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    cpf = Column(String(100), nullable=False, unique=True  )
    id_usuario = Column(Integer, ForeignKey('usuarios.id'), nullable=False)

    usuario = relationship('Usuario', back_populates='cpf')
```

Você se lembra que no exemplo de relacionamento de 1:N o atributo `endereco` funcionava como uma lista? Se sim, essa é a única diferença para o relacionamento 1:1. Ao trocar o parâmetro `uselist` para falso, ele referenciará a um único objeto `CPF`.

### N:N

Quando há um relacionamento de muitos para muitos é preciso uma tabela de associação. Ela servirá para conter as chaves estrangeiras das duas entidades e indicar que uma entidade pode conter múltiplas outras.

Para fazer essa tabela é preciso uma importação

```python
from sqlalchemy import Table
```

No exemplo vamos fazer a relação de muitos para muitos entre usuários e grupos. Mas antes, vamos criar a tabela de associação.

```python
tabela_de_associacao = Table(
    'grupos_usuarios',
    Base.metadata,
    Column('id_usuario', Integer, ForeignKey('usuarios.id')),
    Column('id_grupo', Integer, ForeignKey('grupos.id'))
)
```

Essa tabela contém apenas chaves estrangeiras das outras entidades. Agora vamos relacioná-la com as classes.

```python
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    senha = Column(String(100), nullable=False)

    grupos = relationship('Grupo', secondary=tabela_de_associacao, back_populates='usuarios')

class Grupo(Base):
    __tablename__ = 'grupos'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = Column(String(100), nullable=False)

    usuarios = relationship('Usuario', secondary=tabela_de_associacao, back_populates='grupos')
```

Dessa forma, ambas as tabelas têm uma lista que contém todas as associações entre usuários e grupos.

---

## CRUD com `SQLAlchemy`

Agora vamos fazer as 4 operações (cria, ler, atualizar e apagar) com `SQLAlchemy`.

Todas as operações envolverão a variável `Session` que criamos lá no inicio, nas [Configuração iniciais](#configurações-iniciais).

### Fluxo da operação

```python
session = Session()

...

session.commit() # Apenas se o banco for alterado
session.close()
```

### Create (criar)

Para inserir um novo valor no banco é extremamente simples.

```python
session = Session()

novo_usuario = Usuario(nome='Fulano', email='fulano@email.com', senha='senha123')
session.add(novo_usuario)

session.commit()
session.close()
```

Viu? Basta criar um objeto e adicioná-lo ao banco. Também é possível adicionar uma lista de usuários...

```python
session = Session()

novos_usuarios = [
    Usuario(nome='Fulano', email='fulano@email.com', senha='senha123'),
    Usuario(nome='Cicrano', email='cicrano@email.com', senha='senha123'),
]
session.add_all(novos_usuarios)

session.commit()
session.close()
```

### Read (ler)

Para fazer uma consulta ou "select" no banco há mais de uma forma, afinal a consulta pode ter algumas variações.

- Selecionar todos os dados [`select * from usuarios`]:

    ```python
    session = Session()

    usuarios = session.query(Usuario).all()

    session.close()
    ```

    A variável `usuarios` conterá todos os objetos de `Usuario`.

- Selecionar por uma condição [`select * from usuario where nome='Fulano'`]:

    ```python
    session = Session()

    usuario = session.query(Usuario).filter_by(nome='Fulano').first()

    session.close()
    ```

    Nesse exemplo a variável `usuario` conterá apenas o usuário com o nome igual a "Fulano".

    > [!NOTE]
    > O método `first()` retorna o primeiro resultado da consulta.

- Selecionar pelo ID [`select * from usuario where id = 1`]:

    ```python
    session = Session()

    usuario = session.get(Usuario, 1)

    session.close()
    ```

### Update (Atualizar)

Para atualizar um valor, primeiro é preciso pegar qual informação você irá alterar. Vamos alterar o nome do usuário com o nome "Fulano".

```python
session = Session()

usuario = session.query(Usuario).filter_by(nome='Fulano').first()
usuario.nome = 'Zefa'

session.commit()
session.close()
```

### Delete (Apagar)

Para apagar um usuário também é uma operação extremamente simples.

```python
session = Session()

usuario = session.get(Usuario, 1)
session.delete(usuario)

session.commit()
session.close()
```

---

## Referências

- [SQLAlchemy](https://www.sqlalchemy.org/)
