# app.py
# Punto de entrada del proyecto.
# Antes de ejecutar:
# 1. Crear un archivo .env en la raíz del proyecto.
# 2. Agregar:
#    GROQ_API_KEY=tu_api_key
#
# Instalar dependencias:
#    pip install -r requirements.txt
#
# Ejecutar:
#    python app.py

import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask

from routes.web_routes import web_bp
from routes.chatbot_routes import chatbot_bp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, "static"),
    static_url_path="/static",
)

app.register_blueprint(web_bp)
app.register_blueprint(chatbot_bp)


@app.after_request
def add_cors_headers(response):
    # Habilita CORS sin depender de flask-cors (una dependencia menos que instalar)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

if __name__ == "__main__":
    print()
    print("  ✅ Chatbot AJE corriendo en http://localhost:3000")
    print("  📌 Abre ese link en tu navegador")
    if not os.environ.get("GROQ_API_KEY"):
        print("  ⚠️  No se detectó GROQ_API_KEY. El chat no funcionará hasta que la configures.")
    print("  🛑 Para detener: Ctrl + C")
    print()
    app.run(host="0.0.0.0", port=3000, debug=True)
