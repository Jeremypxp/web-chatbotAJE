# chatbot/contexto.py
# Construye el bloque de contexto (información real) que la IA debe conocer.

from services.data_service import get_conocimiento


def construir_contexto():
    c = get_conocimiento()

    productos = ", ".join(f"{p['nombre']} ({p['categoria']})" for p in c["productos"])
    historia = " | ".join(f"{h['anio']}: {h['hecho']}" for h in c["historia"])

    return f"""
INFORMACIÓN CLAVE DEL GRUPO AJE:
Fundación: {c['empresa']['fundacion']} en {c['empresa']['lugar_fundacion']}, por la {c['empresa']['fundadores']}.
Razón social: {c['empresa']['razon_social']} · RUC: {c['empresa']['ruc']} · Dirección: {c['empresa']['direccion']}.
Productos: {productos}.
Presencia global: {c['presencia_global']['paises']} países, {c['presencia_global']['puntos_de_venta']} puntos de venta, {c['presencia_global']['plantas']} plantas, {c['presencia_global']['centros_distribucion']} centros de distribución.
Misión: {c['mision']}
Visión: {c['vision']}
Historia resumida: {historia}
Web: {c['empresa']['web']} · Delivery: {c['empresa']['delivery']} · Email: {c['empresa']['email']} · Tel: {c['empresa']['telefono']}
""".strip()
