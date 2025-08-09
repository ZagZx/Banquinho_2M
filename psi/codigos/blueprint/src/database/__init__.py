from database.model import db
import os


def init_database(app, file):
    PATH = os.path.dirname(file) # Montando o caminho até o arquivo
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{PATH}/database/data.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    with app.app_context():
        db.create_all()