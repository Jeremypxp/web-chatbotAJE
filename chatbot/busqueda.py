# chatbot/busqueda.py
# Búsqueda por palabras clave curadas dentro de la FAQ, para reforzar
# al modelo con la respuesta "oficial" cuando la pregunta ya está mapeada.

import unicodedata

from services.data_service import get_faq


def _normalizar(txt):
    txt = txt.lower()
    txt = unicodedata.normalize("NFD", txt)
    txt = "".join(c for c in txt if unicodedata.category(c) != "Mn")  # quita tildes
    return txt


def buscar_en_faq(consulta_usuario):
    faq = get_faq()
    consulta = _normalizar(consulta_usuario)

    mejor_match = None
    mejor_puntaje = 0

    for item in faq:
        claves = item.get("palabras_clave", [])

        # Compatibilidad: si un item no tiene palabras_clave, usa la pregunta como respaldo
        if not claves:
            claves = [item["pregunta"]]

        puntaje = 0
        for clave in claves:
            clave_norm = _normalizar(clave)
            # Substring en vez de palabra exacta: cubre plurales, femenino/masculino, variaciones
            if clave_norm in consulta:
                puntaje += 1

        if puntaje > mejor_puntaje:
            mejor_puntaje = puntaje
            mejor_match = item

    # Con palabras_clave curadas, basta 1 coincidencia real para considerar match
    return mejor_match if mejor_puntaje >= 1 else None