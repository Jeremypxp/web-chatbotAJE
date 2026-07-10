# services/ia_service.py
# Conexión con Groq (API compatible con OpenAI Chat Completions)

import os
import requests

# La API key se lee de una variable de entorno. Nunca la escribas directamente aquí.
#   Mac/Linux:        export GROQ_API_KEY=tu_key_aqui
#   Windows (cmd):     set GROQ_API_KEY=tu_key_aqui
#   Windows (PS):      $env:GROQ_API_KEY="tu_key_aqui"
API_KEY = os.environ.get("GROQ_API_KEY", "")
MODEL = "llama-3.3-70b-versatile"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


class IAServiceError(Exception):
    pass


def consultar_ia(system_prompt, messages, max_tokens=800):
    if not API_KEY:
        raise IAServiceError("Falta configurar GROQ_API_KEY en las variables de entorno.")

    payload = {
        "model": MODEL,
        "max_tokens": max_tokens,
        "messages": [{"role": "system", "content": system_prompt}, *messages],
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
    }

    resp = requests.post(GROQ_URL, json=payload, headers=headers, timeout=30)
    data = resp.json()

    if not resp.ok:
        mensaje = (data.get("error") or {}).get("message") or f"Error {resp.status_code} al consultar el proveedor de IA."
        raise IAServiceError(mensaje)

    choices = data.get("choices") or []
    if not choices:
        return "No pude generar respuesta."

    return choices[0].get("message", {}).get("content", "No pude generar respuesta.")
