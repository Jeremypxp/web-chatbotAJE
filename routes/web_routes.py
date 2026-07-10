# routes/web_routes.py
# Sirve index.html. Los archivos dentro de /static los sirve Flask
# automáticamente en la ruta /static/... porque así se configura la app
# en app.py (static_folder="static", static_url_path="/static").

import os
from flask import Blueprint, send_from_directory

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

web_bp = Blueprint("web", __name__)


@web_bp.route("/")
@web_bp.route("/index.html")
def index():
    return send_from_directory(BASE_DIR, "index.html")
