# chatbot/historial.py
# El historial "vivo" de cada sesión lo mantiene el navegador (cliente) y
# se envía completo en cada request. Este módulo valida y limita ese
# historial en el servidor antes de reenviarlo a la IA.

MAX_MENSAJES = 20  # ventana de contexto: últimos N mensajes

ROLES_VALIDOS = {"user", "assistant"}


def validar_historial(mensajes):
    if not isinstance(mensajes, list):
        return []

    validos = [
        m for m in mensajes
        if isinstance(m, dict)
        and isinstance(m.get("content"), str)
        and m.get("role") in ROLES_VALIDOS
    ]

    return validos[-MAX_MENSAJES:]
