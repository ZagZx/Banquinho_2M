from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from database.model import db, Usuario


auth_bp = Blueprint('auth', __name__, template_folder='templates') # Indica onde estão os templates


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']
        
        usuario = Usuario.query.filter_by(email=email).first()
        if usuario:
            if check_password_hash(usuario.senha, senha): # Verificando senha criptografada com a inserida pelo usuário
                login_user(usuario)
                return redirect(url_for('main.index'))
            flash('Senha incorreta', category='error')
        else:
            flash('Esse email não existe', category='error')

    return render_template('auth/login.html')


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        senha = request.form['senha']
        
        # Procuro primeiro pelo email, pois ele é único
        usuario = Usuario.query.filter_by(email=email).first()
        if not usuario:
            novo_usuario = Usuario(nome=nome, email=email, senha=generate_password_hash(senha)) # Gerando criptografia
            db.session.add(novo_usuario)
            db.session.commit()
            login_user(novo_usuario)
            return redirect(url_for('main.index'))
        flash('Esse email já existe', category='error')

    return render_template('auth/register.html')


@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))