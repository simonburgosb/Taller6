import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Bucket name for audio storage
const BUCKET_NAME = 'make-8c79cdcb-audio';

// Initialize storage bucket on startup
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
      console.log(`Created bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('Error initializing storage bucket:', error);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8c79cdcb/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload and process audio story
app.post("/make-server-8c79cdcb/upload-story", async (c) => {
  try {
    const formData = await c.req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return c.json({ error: 'No se proporcionó archivo de audio' }, 400);
    }

    // Read Gemini API key from environment
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      return c.json({ error: 'Gemini API key no configurada' }, 500);
    }

    // Convert audio file to base64 (safe for large files)
    const audioBytes = await audioFile.arrayBuffer();
    
    // Convert ArrayBuffer to base64 using chunks to avoid stack overflow
    const uint8Array = new Uint8Array(audioBytes);
    let binary = '';
    const chunkSize = 0x8000; // Process 32KB at a time
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const audioBase64 = btoa(binary);

    // Step 1: Transcribe and analyze audio using Gemini 1.5 Flash
    console.log('Transcribiendo y analizando audio con Gemini...');
    
    const systemPrompt = `Eres el moderador y editor de un proyecto cultural llamado 'Cartografía de Memorias'. Tu tarea es:

1. TRANSCRIBIR el audio en español
2. FILTRO DE SEGURIDAD: Analiza el texto en busca de lenguaje de odio explícito, amenazas, discriminación grave o groserías extremadamente ofensivas. Si la historia viola estas reglas, debes rechazarla. (Nota: Las groserías coloquiales o regionales que sean parte natural de la forma de hablar se pueden permitir si no son un ataque directo a alguien).
3. RESUMEN ESTILO 'CHISME' Y TITULACIÓN: Si la historia es aprobada, debes generar:
   - Un Título Intrigante (Máximo 6 palabras) que suene como el titular de un chisme jugoso.
   - Un Resumen Estilo 'Chisme' (Máximo 3 oraciones). NO hagas un resumen técnico ni aburrido. Redáctalo como si le estuvieras contando un secreto fascinante a un amigo al oído. Usa un tono coloquial, intrigante y muy narrativo. Comienza con frases como 'Imagínate que...', 'Resulta que...', 'Cuentan por ahí que...' o 'No vas a creer que...'.
   - Un par de Palabras Clave/Etiquetas (Ej: Romance, Nostalgia, Chisme de barrio).

Devuelve tu respuesta ÚNICAMENTE en el siguiente formato JSON estricto:
{
  "aprobado": true/false,
  "motivo_rechazo": "Explicación breve si fue rechazado (o null si es aprobado)",
  "titulo": "El título generado",
  "resumen": "El resumen breve",
  "etiquetas": ["etiqueta1", "etiqueta2"],
  "transcripcion_limpia": "La transcripción completa del audio (corrige errores menores de puntuación)"
}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                {
                  inline_data: {
                    mime_type: audioFile.type || 'audio/webm',
                    data: audioBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Error en Gemini API:', error);
      return c.json({ error: 'Error al procesar el audio con Gemini' }, 500);
    }

    const geminiData = await geminiResponse.json();
    
    // Extract the text response from Gemini's structure
    if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Respuesta inesperada de Gemini:', geminiData);
      return c.json({ error: 'Respuesta inesperada de Gemini' }, 500);
    }

    const analysis = JSON.parse(geminiData.candidates[0].content.parts[0].text);

    // Step 2: Handle rejection or approval
    if (!analysis.aprobado) {
      console.log('Historia rechazada:', analysis.motivo_rechazo);
      return c.json({
        aprobado: false,
        motivo_rechazo: analysis.motivo_rechazo,
      });
    }

    // Step 3: Save audio to Supabase Storage
    console.log('Guardando audio en storage...');
    const fileName = `${Date.now()}-${crypto.randomUUID()}.webm`;
    
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, audioBytes, {
        contentType: audioFile.type,
      });

    if (uploadError) {
      console.error('Error al subir audio:', uploadError);
      return c.json({ error: 'Error al guardar el audio' }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000);

    // Step 4: Save to database
    const storyId = crypto.randomUUID();
    const storyData = {
      id: storyId,
      fecha: new Date().toISOString(),
      titulo: analysis.titulo,
      resumen: analysis.resumen,
      transcripcion: analysis.transcripcion_limpia,
      etiquetas: analysis.etiquetas,
      audio_url: urlData?.signedUrl || '',
      audio_filename: fileName,
    };

    await kv.set(`story:${storyId}`, storyData);

    console.log('Historia guardada exitosamente:', storyId);
    return c.json({
      aprobado: true,
      historia: storyData,
    });

  } catch (error) {
    console.error('Error procesando historia:', error);
    return c.json({ error: 'Error interno del servidor', details: String(error) }, 500);
  }
});

// Get all approved stories
app.get("/make-server-8c79cdcb/stories", async (c) => {
  try {
    const stories = await kv.getByPrefix('story:');
    
    // Sort by date (newest first)
    const sortedStories = stories.sort((a: any, b: any) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    return c.json({ stories: sortedStories });
  } catch (error) {
    console.error('Error obteniendo historias:', error);
    return c.json({ error: 'Error al obtener historias' }, 500);
  }
});

// Get single story by ID
app.get("/make-server-8c79cdcb/stories/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const story = await kv.get(`story:${id}`);
    
    if (!story) {
      return c.json({ error: 'Historia no encontrada' }, 404);
    }

    return c.json({ story });
  } catch (error) {
    console.error('Error obteniendo historia:', error);
    return c.json({ error: 'Error al obtener la historia' }, 500);
  }
});

Deno.serve(app.fetch);