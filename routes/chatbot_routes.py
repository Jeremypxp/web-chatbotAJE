# routes/chatbot_routes.py
# Endpoint POST /chat

from flask import Blueprint, request, jsonify

from chatbot.chatbot import manejar_consulta
from services.ia_service import IAServiceError

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    try:
        body = request.get_json(force=True, silent=True) or {}
        mensajes = body.get("messages", [])

        respuesta_texto = manejar_consulta(mensajes)

        # Formato de respuesta compatible con el front-end (estilo Anthropic)
        return jsonify({"content": [{"type": "text", "text": respuesta_texto}]})

    except IAServiceError as e:
        return jsonify({"error": {"message": str(e)}}), 500
    except Exception as e:  # noqa: BLE001
        return jsonify({"error": {"message": str(e)}}), 500
