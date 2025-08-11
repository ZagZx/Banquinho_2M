from flask import Blueprint, render_template
from flask_login import current_user


main_bp = Blueprint('main', __name__, template_folder='templates') # Indicia onde estão os templates


@main_bp.route('/')
def index():
    return render_template('main/index.html', nome=(current_user.nome if current_user.is_authenticated else None))
