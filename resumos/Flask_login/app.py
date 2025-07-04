from flask import Flask, redirect, render_template, request, url_for, session, flash
from flask_login import LoginManager, login_user
from werkzeug.security import generate_password_hash
from user import User

login_manager = LoginManager()
app = Flask(__name__)

login_manager.init_app(app)
app.secret_key = 'SenhaSecretaSuperSecretaSSSS'

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/')
def index():
    if 'users' not in session:
        session['users'] = {}

    return render_template('index.html')

@app.route('/response', methods=['POST', 'GET'])
def response():
    email = request.form.get('email')
    return render_template('reponse.html', email=email)

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('password')

        if email in session['users']:
            flash('ERRO 403! O usuário já existe. Faça login para acessar', category='error')
            return redirect(url_for('register'))
        
        senha_hash = generate_password_hash(senha)
        session['users'][email] = senha_hash
        session.modified = True

        user = User(email=email, senha=senha_hash)
        login_user(user)
        flash('201! Usuário criado, seja bem vindo!', category='success')
        return render_template('reponse.html', email=email)

    else:
        return render_template('register.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('senha')

        if email not in session['users']:
            flash('ERRO 404! Usuário não cadastrado', category='error')
            return redirect(url_for('login'))
        
        senha_hash = session['users'][email]
        user = User(email=email, senha=senha_hash)
        if user.verify_password(senha):
            login_user(user)
            flash('200! Login efetuado', category='sucess')
            return render_template('reponse.html', email=email)
        else:
            flash('ERRO 400! Verfique sua senha e tente novamente', category='success')
            return redirect(url_for(login))
    return render_template('login.html')
