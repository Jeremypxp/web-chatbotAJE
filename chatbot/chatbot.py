# chatbot/chatbot.py
# Controlador principal: orquesta busqueda + historial + prompts + inferencia.

from chatbot.busqueda import buscar_en_faq
from chatbot.historial import validar_historial
from chatbot.prompts import construir_system_prompt
from chatbot.inferencia import generar_respuesta


def manejar_consulta(mensajes_cliente):
    historial = validar_historial(mensajes_cliente)

    ultimo_mensaje_usuario = next(
        (m for m in reversed(historial) if m["role"] == "user"), None
    )
    faq_sugerida = buscar_en_faq(ultimo_mensaje_usuario["content"]) if ultimo_mensaje_usuario else None

    system_prompt = construir_system_prompt(faq_sugerida)
    return generar_respuesta(system_prompt, historial)
