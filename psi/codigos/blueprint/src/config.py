from flask_login import LoginManager
from database import init_database
from database.model import db, Usuario


def config_app(app, file):
    app.secret_key = 'oi9u8y7t6rdfgvhbjkloi9u8y7t6gr5tersrdfghuijopi9u8y7t6r'

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    init_database(app, file)


    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(Usuario, int(user_id))