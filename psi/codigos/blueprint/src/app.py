from flask import Flask
from main.routes import main_bp
from auth.routes import auth_bp
import config


app = Flask(__name__)
app.register_blueprint(main_bp)
app.register_blueprint(auth_bp)
config.config_app(app, __file__)


if __name__ == '__main__':
    app.run(debug=True)
