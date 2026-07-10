<div align="center">

# 🥤 Grupo AJE — Sitio Web + Asistente Virtual IA

Sitio web institucional del Grupo AJE con un chatbot inteligente integrado, capaz de responder consultas sobre la empresa, productos, distribución, proveedores y presencia internacional utilizando Inteligencia Artificial mediante la API de Groq.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Groq](https://img.shields.io/badge/IA-Groq%20%7C%20Llama%203.3-orange)](https://groq.com/)
[![License](https://img.shields.io/badge/Licencia-MIT-green)](#-licencia)

</div>

---

# 📋 Tabla de contenidos

- Descripción general
- Características
- Stack tecnológico
- Arquitectura
- Estructura del proyecto
- Requisitos previos
- Instalación
- Variables de entorno
- Ejecución
- Endpoints
- Funcionamiento del chatbot
- Problemas comunes
- Seguridad
- Roadmap
- Licencia

---

# 🌎 Descripción general

Este proyecto consiste en un sitio web institucional del **Grupo AJE** que incorpora un **asistente virtual con Inteligencia Artificial** capaz de responder preguntas relacionadas con la empresa utilizando información previamente estructurada en archivos JSON y procesada mediante un modelo LLM de Groq.

El backend está desarrollado con **Python y Flask**, mientras que el frontend utiliza **HTML, CSS y JavaScript puro**, ofreciendo una interfaz responsive y un chatbot flotante accesible desde cualquier parte del sitio.

> 🎓 Proyecto desarrollado con fines académicos.

---

# ✨ Características

- 💬 Chatbot inteligente utilizando **Llama 3.3** mediante Groq.
- 📚 Contexto del Grupo AJE almacenado en archivos JSON.
- 🔎 Búsqueda de preguntas frecuentes (FAQ).
- 🧠 Prompt dinámico generado desde el backend.
- 📱 Diseño responsive.
- 🎨 Animaciones suaves.
- ⚡ Comunicación mediante Fetch API.
- 🔐 API Key protegida mediante variables de entorno.

---

# 🛠 Stack Tecnológico

| Capa | Tecnología |
|-------|------------|
| Backend | Python 3 + Flask |
| IA | Groq API (Llama 3.3) |
| Frontend | HTML5, CSS3, JavaScript |
| Datos | JSON |
| Editor recomendado | Visual Studio Code |

---

# 🏗 Arquitectura

```
Usuario
    │
    ▼
Frontend (HTML/CSS/JS)
    │
    ▼
Flask (app.py)
    │
    ├────────► Web Routes
    │
    └────────► Chatbot Routes
                     │
                     ▼
          Lógica del Chatbot
                     │
         ├── Prompt
         ├── Historial
         ├── Contexto
         ├── FAQ
         └── Inferencia
                     │
                     ▼
              API de Groq
```

---

# 📁 Estructura del proyecto

```
GrupoAje-ProyectoAcademico/
│
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
│
├── chatbot/
│   ├── chatbot.py
│   ├── busqueda.py
│   ├── contexto.py
│   ├── historial.py
│   ├── inferencia.py
│   └── prompts.py
│
├── data/
│   ├── conocimiento.json
│   ├── faq.json
│   └── arquitectura.json
│
├── routes/
│   ├── chatbot_routes.py
│   └── web_routes.py
│
├── services/
│   ├── data_service.py
│   └── ia_service.py
│
├── static/
│   ├── css/
│   ├── img/
│   └── js/
│
└── index.html
```

---

# ✅ Requisitos previos

Antes de ejecutar el proyecto debes tener instalado:

- Python 3.10 o superior
- pip
- Visual Studio Code (recomendado)
- Una cuenta en Groq
- Una API Key de Groq

Puedes obtener una API Key desde:

https://console.groq.com/keys

---

# 🚀 Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/web-chatbotAJE.git
cd web-chatbotAJE
```

---

## 2. Crear el entorno virtual

```bash
python -m venv venv
```

---

## 3. Activar el entorno virtual

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
venv\Scripts\activate.bat
```

### Linux / macOS

```bash
source venv/bin/activate
```

Si PowerShell muestra un error de permisos ejecutar una sola vez:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## 4. Instalar las dependencias

```bash
pip install -r requirements.txt
```

---

# 🔑 Variables de entorno

El chatbot necesita una API Key de Groq para funcionar.

## Paso 1

Obtén una API Key desde:

https://console.groq.com/keys

---

## Paso 2

En la raíz del proyecto encontrarás un archivo llamado:

```
.env.example
```

Crea un nuevo archivo llamado:

```
.env
```

y copia el contenido del archivo anterior.

Debe quedar así:

```env
GROQ_API_KEY=tu_api_key_de_groq
```

Ejemplo:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Importante:** Nunca subas el archivo `.env` al repositorio.

---

# ▶️ Ejecución

Con el entorno virtual activado ejecutar:

```bash
python app.py
```

Si todo está correctamente configurado aparecerá algo similar a:

```
✅ Chatbot AJE corriendo en http://localhost:3000

📌 Abre ese link en tu navegador
```

Luego abre en el navegador:

```
http://localhost:3000
```

---

# 🔌 Endpoints

## GET /

Carga la página principal del sitio.

---

## POST /chat

Envía un mensaje al chatbot.

### Request

```json
{
    "messages":[
        {
            "role":"user",
            "content":"¿Qué productos vende Grupo AJE?"
        }
    ]
}
```

### Response

```json
{
    "content":[
        {
            "type":"text",
            "text":"Grupo AJE comercializa Big Cola, Cielo, Sporade..."
        }
    ]
}
```

---

# 🤖 Funcionamiento del chatbot

1. El usuario escribe un mensaje.
2. JavaScript envía la conversación mediante `POST /chat`.
3. Flask recibe la solicitud.
4. Se valida el historial.
5. Se consulta la información almacenada en JSON.
6. Se construye el Prompt del sistema.
7. Se envía la solicitud a la API de Groq.
8. Groq genera la respuesta.
9. Flask devuelve la respuesta.
10. JavaScript la muestra en el chat.

---

# ❗ Problemas comunes

## Error

```
Falta configurar GROQ_API_KEY en las variables de entorno.
```

### Solución

- Verifica que exista el archivo:

```
.env
```

- Comprueba que contenga:

```env
GROQ_API_KEY=tu_api_key
```

- Verifica que la API Key sea válida.

- Reinicia la aplicación.

---

## Error

```
No Python at ...
```

### Solución

Selecciona el intérprete correcto de Python en Visual Studio Code.

```
Ctrl + Shift + P

Python: Select Interpreter
```

Selecciona:

```
venv/Scripts/python.exe
```

---

## Error

```
ModuleNotFoundError
```

Instala nuevamente las dependencias.

```bash
pip install -r requirements.txt
```

---

## Error

```
No module named dotenv
```

Instala:

```bash
pip install python-dotenv
```

---

## El chatbot responde con errores

Verifica:

- Que la API Key sea válida.
- Que exista conexión a Internet.
- Que el archivo `.env` tenga el nombre correcto.
- Que el entorno virtual esté activado.

---

# 🔐 Seguridad

- La API Key nunca debe escribirse directamente en el código fuente.
- Debe almacenarse únicamente en el archivo `.env`.
- El archivo `.env` debe estar incluido en `.gitignore`.
- Si una API Key fue expuesta públicamente, debe revocarse y generar una nueva desde el panel de Groq.

---

# 🗺 Roadmap

- Persistencia de conversaciones.
- Panel de administración.
- Base de datos.
- Estadísticas del chatbot.
- Integración con más modelos de IA.
- Soporte para múltiples idiomas.

---

# 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT.

---

<div align="center">

**Proyecto académico 2026**

Desarrollado para el curso de Sistemas Inteligentes 🥤

</div>
