const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const OpenAI = require("openai");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "holaMundo";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const usaApiReal = OPENAI_API_KEY !== "holaMundo";

console.log("API key usada:", OPENAI_API_KEY);

if (!usaApiReal) {
  console.warn("⚠️  Se está usando la apiKey de prueba 'holaMundo'. El servicio de OpenAI no funcionará y se usará un resumen de demostración.");
}

let chismes = [];

const STOPWORDS = new Set([
  "de", "la", "el", "que", "y", "a", "en", "un", "una", "lo", "para", "con", "por", "se", "del", "al", "es", "mi", "tu", "su", "si", "no",
  "es", "esta", "esta", "esto", "como", "pero", "o", "más", "menos"
]);

function resumenLocal(texto, maxWords = 10) {
  const cleaned = texto
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "(sin texto)";

  const words = cleaned
    .split(/[^\p{L}0-9]+/u)
    .filter(Boolean)
    .map((w) => w.toLowerCase());

  const filtered = words.filter((w) => !STOPWORDS.has(w) && w.length > 1);
  const chosen = (filtered.length ? filtered : words).slice(0, maxWords);

  const suffix = chosen.length < (filtered.length || words.length) ? "..." : "";
  return `📌 ${chosen.join(" ")}${suffix}`;
}

async function resumirChisme(texto){
  const localRes = resumenLocal(texto, 10);

  if (!usaApiReal) {
    // Modo demo: devolvemos un resumen local inteligente sin OpenAI.
    return `Resumen (demo): ${localRes}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Resume chismes en máximo 10 palabras de forma graciosa."
        },
        {
          role: "user",
          content: texto
        }
      ]
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.log("OpenAI error, usando resumen local:", error);
    return `Resumen (fallback): ${localRes}`;
  }
}

io.on("connection", (socket)=>{

  console.log("usuario conectado");

  socket.emit("historial", chismes);

  socket.on("nuevoChisme", async (texto)=>{

    console.log("chisme recibido:", texto);

    const resumen = await resumirChisme(texto);

    const objeto = {
      original: texto,
      resumen: resumen,
      fecha: Date.now()
    };

    chismes.push(objeto);

    io.emit("chismeResumido", objeto);

  });

});

server.listen(3000, ()=>{
  console.log("servidor corriendo en puerto 3000");
});