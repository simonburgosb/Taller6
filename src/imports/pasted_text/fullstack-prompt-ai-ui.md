Prompt de Desarrollo Full-Stack: Chismógrafo con IA y Directrices de UI

Contexto del Proyecto

El "Chismógrafo" es una cabina física interactiva donde los usuarios graban historias de audio anónimas sobre sus memorias en la ciudad. Necesito desarrollar un flujo automatizado que tome el archivo de audio (.wav o .webm) generado por el usuario, realice un proceso de transcripción, curaduría y resumen utilizando Inteligencia Artificial, y finalmente lo publique en una página web externa (el "MaxiLibro" o archivo digital) siguiendo un UI Kit estricto.

Objetivo del Script

El sistema debe actuar como:

Moderador automático: Escuchar, transcribir, filtrar contenido inapropiado, generar un título y resumir.

Generador de Interfaz: Mostrar estos resultados en la web aplicando las tipografías y paletas de colores específicas del diseño "Memoria Viva".

FASE 1: Lógica Backend e IA (Flujo de Trabajo)

Paso 1: Transcripción (Speech-to-Text)

Recibir el archivo de audio grabado por el usuario en la cabina.

Utilizar un modelo de reconocimiento de voz (como OpenAI Whisper o similar).

Obtener la transcripción exacta del audio a texto en español.

Paso 2: Análisis y Filtro de Seguridad (Prompt para el LLM)

Enviar el texto transcrito a un LLM (como GPT-4o o Claude 3) con este System Prompt:

"Eres el moderador y editor de un proyecto cultural llamado 'Cartografía de Memorias'. Tu tarea es analizar la siguiente transcripción de una historia oral y realizar dos acciones.

ACCIÓN 1 (Filtro de Seguridad): Analiza el texto en busca de lenguaje de odio explícito, amenazas, discriminación grave o groserías extremadamente ofensivas. Si la historia viola estas reglas, debes rechazarla. (Nota: Las groserías coloquiales o regionales que sean parte natural de la forma de hablar se pueden permitir si no son un ataque directo a alguien).

ACCIÓN 2 (Resumen y Titulación): Si la historia es aprobada, debes generar:

Un Título Atractivo (Máximo 6 palabras) que capture la esencia de la memoria.

Un Resumen Breve (Máximo 3 oraciones) de lo que trata la historia.

Un par de Palabras Clave/Etiquetas (Ej: Romance, Nostalgia, Comercio).

Devuelve tu respuesta ÚNICAMENTE en el siguiente formato JSON estricto:
{
"aprobado": true/false,
"motivo_rechazo": "Explicación breve si fue rechazado (o null si es aprobado)",
"titulo": "El título generado",
"resumen": "El resumen breve",
"etiquetas": ["etiqueta1", "etiqueta2"],
"transcripcion_limpia": "La transcripción original (corrige errores menores de puntuación)"
}"

Paso 3: Manejo de la Respuesta y Base de Datos

Si "aprobado": false: Detener el proceso, eliminar el audio temporal y registrar el rechazo en los logs.

Si "aprobado": true:

Guardar el archivo de audio original en un servidor de almacenamiento (AWS S3, Firebase, etc.).

Hacer un POST a la base de datos con el siguiente Payload:

{
  "id": "generado_automaticamente",
  "fecha": "YYYY-MM-DD HH:MM:SS",
  "titulo": "Valor del JSON",
  "resumen": "Valor del JSON",
  "transcripcion": "Valor del JSON",
  "etiquetas": ["array", "del", "json"],
  "audio_url": "[https://url-del-audio-guardado.mp3](https://url-del-audio-guardado.mp3)"
}


FASE 2: Directrices de Frontend (UI Kit "Memoria Viva")

Cuando se desarrolle la interfaz de usuario (tanto para la pantalla de la cabina como para la galería web donde se mostrarán las historias), el código CSS/Tailwind debe respetar ESTRICTAMENTE el siguiente UI Kit.

1. Tipografías Asignadas

Debes importar estas fuentes desde Google Fonts y aplicarlas en los siguientes elementos:

Títulos Principales (H1, H2): Fraunces (Serif, elegante, transmite patrimonio).

Historias en el mapa (Tarjetas/Cards de contenido): Bricolage Grotesque (Sans-serif, moderna pero con carácter).

Cuerpo de texto o Instrucciones (Párrafos normales): Commissioner (Sans-serif, alta legibilidad).

Botones (Call to actions): Plus Jakarta Sans (Sans-serif, geométrica y clara).

Textos secundarios (Globos de instrucciones, Tooltips, Etiquetas): Source Sans 3 (Sans-serif, neutra).

2. Paleta de Colores

El diseño debe utilizar esquemas de colores basados en la identidad visual de "Santa Fe de Antioquia":

Tonos Cálidos / Tierra: Cremas claros, arena, ocres, mostazas y marrones oscuros. (Usar para fondos principales, tarjetas y textos destacados).

Tonos Fríos / Contraste: Verde azulado oscuro (Teal), azul petróleo oscuro y casi negro. (Usar para fondos de alto contraste, textos principales sobre fondos claros o cabeceras).

Tonos Acento / Terracota: Melocotón claro, salmón, coral, terracota y rojo ladrillo oscuro. (Usar para botones, estados activos, alertas o iconos).

Nota para el desarrollador frontend: Asegúrate de configurar estas fuentes en la configuración de Tailwind (tailwind.config.js) o en las variables CSS globales antes de maquetar los componentes.

Requisitos Técnicos Esperados del Código a Generar

Proveer la lógica de backend en Python o Node.js.

Proveer ejemplos de componentes frontend (ej. React) que consuman estos datos utilizando las clases de tipografía y color descritas en el UI Kit.