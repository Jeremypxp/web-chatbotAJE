# chatbot/inferencia.py
# Envía system prompt + historial al servicio de IA y devuelve el texto.

from services.ia_service import consultar_ia


def generar_respuesta(system_prompt, historial):
    return consultar_ia(system_prompt, historial, max_tokens=800)
