# services/data_service.py
# Lectura de archivos JSON de la carpeta /data

import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")


def _leer_json(nombre_archivo):
    ruta = os.path.join(DATA_DIR, nombre_archivo)
    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f)


def get_conocimiento():
    return _leer_json("conocimiento.json")


def get_faq():
    return _leer_json("faq.json")


def get_arquitectura():
    return _leer_json("arquitectura.json")
