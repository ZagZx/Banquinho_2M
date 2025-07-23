# Flask-Login

O **Flask-Login** fornece gerenciamento de sessões de usuários para o Flask. Ele lida com as tarefas comuns de login, logout e memorização das sessões dos seus usuários por longos períodos.

---

**Ele vai:**

- Armazene o ID do usuário ativo na Sessão Flask e permita que você faça login e logout facilmente.
- Permite restringir visualizações a usuários logados (ou desconectados). ( login_required)
- Lide com a funcionalidade normalmente complicada de “lembrar de mim”.
- Ajude a proteger as sessões dos seus usuários contra roubos de cookies.

No entanto, isso não acontece:

- Imponha um banco de dados específico ou outro método de armazenamento a você. Você é totalmente responsável por como o usuário é carregado.
- Restringe o uso de nomes de usuário e senhas, OpenIDs ou qualquer outro método de autenticação.
- Gerencie permissões além de “conectado ou não”.
- Gerenciar registro de usuário ou recuperação de conta.

---

## Como instalar?

```sh
pip install flask-login
```

## Configuração

No inicio do código, no arquivo `app.py`, é preciso fazer algumas configurações iniciais antes de iniciar de fato o código.

```python
from flask import Flask, session
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

app = Flask(__name__)

# 2 formas de configurar a chave secreta, são a mesma coisa:
app.secret_key = '<CHAVE SECRETA>'
app.config['SECRET_KEY'] = '<CHAVE SECRETA>'

login_manager = LoginManager()
login_manager.init_app(app)
```

O gerenciador de login (`LoginManager`) contém o código que permite que seu aplicativo e o Flask-Login trabalhem juntos, como carregar um usuário a partir de um ID, para onde enviar os usuários quando eles precisam fazer login e coisas do tipo.

A chave secreta precisa ser definida, o **Flask-Login** funciona com base em sessões, por isso a definição da chave secreta.

---

### Classe `User`

```python
class User(UserMixin):
    def __init__(self, nome, senha):
        self.nome = nome
        self.senha = senha

    @staticmethod
    def get(user_id):
        lista_usuarios = session['usuarios']
        if user_id in lista_usuarios:
            info = lista_usuarios[user_id]
            user = User(nome=info['nome'], senha=info['senha'])
            user.id = user_id
            return user
```

A classe `User` é apenas um exemplo. Ela pode ser alterada para conveniência do código, podendo alterar tanto o método construtor (`__init__`) quanto o método de classe (`get`).

---

### Função `user_loader`

Essa função é importante para que o flask_login consiga resgatar os dados do usuário na `session`, ela recebe uma `str` como ID e retorna um objeto da classe [`User`](#classe-user).

```python
@login_manager.user_loader
def load_user(user_id: str) -> User | None:
    return User.get(user_id)
```

## Função `login_user`, `logout_user` e decorador `login_required`

### Decorador `login_required`

Esse decorador é de grande ajuda quando se trata de proteger determinadas rotas de acesso quando não há usuário logado.

Exemplo:
```python
@app.route('/carrinho')
@login_required
def carrinho():
    ...
```

### Função `login_user`

Essa função é usada para fazer o login de um usuário na sessão passando um objeto da classe [`User`](#classe-user) como parâmetro.

Exemplo:
```python
user = User(nome=nome, senha=senha)
user.id = id # Variável antes definida
login_user(user)
```

Essa função pode ser usada dentro de uma classe de login ou cadastro.

### Função `logout_user`

Essa função removerá o usuário da sessão.

Exemplo de função de logout:
```python
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))
```

O uso do [`login_required`](#login_required) é interessante para proteger o código, visto que é preciso ter algum usuário logado para poder fazer a operação.

## `current_user`

Para que se tenha acesso ao usuário é preciso importar a variável `current_user`, essa variável é um objeto carregado pelo [`user_loader`](#função-user_loader).

Com o `current_user` é possível verificar se um usuário está autenticado apenas com `current_user.is_authenticated`.

## Referências:

- [Documentação do Flask-Login](https://flask-login.readthedocs.io/en/latest/)