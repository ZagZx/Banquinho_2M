from flask_login import UserMixin
from flask import session
from werkzeug.security import check_password_hash

class User(UserMixin):
    def __init__(self, email: str, senha: str):
        self.id = email
        self.email = email
        self.senha = senha

    @classmethod
    def get(cls, email: str):
        lista_user = session.get('users', {})
        if email in lista_user:
            return cls(email=email, senha=lista_user[email])
        return None
    
    def verify_password(self, password: str):
        return check_password_hash(self.senha, password)