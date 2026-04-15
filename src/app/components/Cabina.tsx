import { useState, useRef } from "react";
import { Mic, Square, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { motion, AnimatePresence } from "motion/react";

type RecordingState = "idle" | "recording" | "stopped" | "uploading" | "success" | "rejected";

export default function Cabina() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [storyData, setStoryData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setErrorMessage("");
      
      // Check if we're in a secure context
      if (!window.isSecureContext) {
        setErrorMessage("El acceso al micrófono requiere una conexión segura (HTTPS).");
        return;
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Tu navegador no soporta la grabación de audio. Por favor usa Chrome, Firefox o Edge.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordingState("stopped");
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState("recording");
    } catch (error: any) {
      console.error("Error al acceder al micrófono:", error);
      
      if (error.name === 'NotAllowedError') {
        setErrorMessage(
          "Necesitas dar permiso para usar el micrófono. " +
          "Por favor, haz clic en el ícono de candado/permisos en la barra de direcciones " +
          "y permite el acceso al micrófono. Luego recarga la página."
        );
      } else if (error.name === 'NotFoundError') {
        setErrorMessage("No se encontró ningún micrófono. Por favor conecta un micrófono y vuelve a intentar.");
      } else if (error.name === 'NotReadableError') {
        setErrorMessage("El micrófono está siendo usado por otra aplicación. Por favor ciérrala y vuelve a intentar.");
      } else {
        setErrorMessage(`Error al acceder al micrófono: ${error.message}`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadStory = async () => {
    if (!audioBlob) return;

    setRecordingState("uploading");
    setResponseMessage("");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8c79cdcb/upload-story`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.aprobado) {
        setRecordingState("success");
        setStoryData(data.historia);
        setResponseMessage("¡Tu historia ha sido aprobada y publicada!");
      } else {
        setRecordingState("rejected");
        setResponseMessage(data.motivo_rechazo || "Tu historia no cumplió con los criterios de moderación.");
      }
    } catch (error) {
      console.error("Error al subir la historia:", error);
      setRecordingState("idle");
      alert("Error al procesar tu historia. Por favor intenta nuevamente.");
    }
  };

  const reset = () => {
    setRecordingState("idle");
    setAudioBlob(null);
    setResponseMessage("");
    setStoryData(null);
    audioChunksRef.current = [];
  };

  return (
    <div className="bg-[#f6e5cf] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 
            className="text-[32px] font-bold mb-4 text-[#212121]" 
            style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
          >
            Chismógrafo
          </h2>
          <p 
            className="text-lg text-[#5d5d5d] max-w-2xl mx-auto" 
            style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}
          >
            Comparte tus memorias sobre Santa Fé de Antioquia. Graba tu historia y conviértela en parte del archivo colectivo.
          </p>
        </div>

        {/* Recording Interface */}
        <motion.div 
          className="bg-[#f6e5cf] rounded-2xl shadow-xl p-12 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {/* Instructions */}
            {recordingState === "idle" && (
              <motion.div 
                key="idle"
                className="text-center flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="w-40 h-40 bg-[#28555a] rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Mic size={64} className="text-white" />
                </motion.div>
                <p className="text-lg text-[#212121]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
                  Presiona el botón para comenzar a grabar tu historia
                </p>
                <motion.button
                  onClick={startRecording}
                  className="bg-[#4e7378] hover:bg-[#28555a] text-white px-10 py-4 rounded-full text-base font-bold transition-colors"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Comenzar a Grabar
                </motion.button>
              </motion.div>
            )}

            {/* Recording */}
            {recordingState === "recording" && (
              <motion.div 
                key="recording"
                className="text-center flex flex-col items-center gap-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="w-40 h-40 bg-[#ba4f33] rounded-full flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(186, 79, 51, 0.7)",
                      "0 0 0 20px rgba(186, 79, 51, 0)",
                      "0 0 0 0 rgba(186, 79, 51, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Mic size={64} className="text-white" />
                </motion.div>
                <motion.p 
                  className="text-xl font-semibold text-[#212121]" 
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Grabando...
                </motion.p>
                <p className="text-base text-[#5d5d5d]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
                  Cuéntanos tu memoria. Habla con claridad y autenticidad.
                </p>
                <motion.button
                  onClick={stopRecording}
                  className="bg-[#28555a] hover:bg-[#163d41] text-white px-10 py-4 rounded-full text-base font-bold flex items-center gap-2 transition-colors"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Square size={20} />
                  Detener Grabación
                </motion.button>
              </motion.div>
            )}

            {/* Stopped - Ready to Upload */}
            {recordingState === "stopped" && (
              <motion.div 
                key="stopped"
                className="text-center flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="w-40 h-40 bg-[#4e7378] rounded-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Upload size={64} className="text-white" />
                </motion.div>
                <p className="text-base text-[#212121]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
                  Tu grabación está lista. ¿Deseas enviarla para moderación?
                </p>
                <div className="flex gap-4">
                  <motion.button
                    onClick={uploadStory}
                    className="bg-[#28555a] hover:bg-[#163d41] text-white px-8 py-4 rounded-full text-base font-bold transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enviar Historia
                  </motion.button>
                  <motion.button
                    onClick={reset}
                    className="bg-[#d2a060] hover:bg-[#b3782e] text-white px-8 py-4 rounded-full text-base font-bold transition-colors"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Grabar de Nuevo
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Uploading */}
            {recordingState === "uploading" && (
              <motion.div 
                key="uploading"
                className="text-center flex flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="w-40 h-40 bg-[#80a4a8] rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={64} className="text-white" />
                </motion.div>
                <motion.p 
                  className="text-xl font-semibold text-[#212121]" 
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Procesando tu historia...
                </motion.p>
                <p className="text-base text-[#5d5d5d]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
                  Estamos transcribiendo, moderando y preparando tu memoria.
                </p>
              </motion.div>
            )}

            {/* Success */}
            {recordingState === "success" && storyData && (
              <motion.div 
                key="success"
                className="text-center flex flex-col items-center gap-6"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-40 h-40 bg-[#28555a] rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle size={64} className="text-white" />
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-xl font-semibold text-[#28555a]" 
                  style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {responseMessage}
                </motion.p>
                
                {/* Story Preview */}
                <motion.div 
                  className="bg-[#e9d1c2] p-8 rounded-2xl text-left w-full"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl font-semibold mb-3 text-[#212121]" style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
                    {storyData.titulo}
                  </h3>
                  <p className="text-base text-[#5d5d5d] mb-4" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
                    {storyData.resumen}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {storyData.etiquetas?.map((tag: string, index: number) => (
                      <motion.span
                        key={index}
                        className="bg-[#4e7378] text-white px-4 py-2 rounded-full text-sm font-bold"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.button
                  onClick={reset}
                  className="bg-[#4e7378] hover:bg-[#28555a] text-white px-10 py-4 rounded-full text-base font-bold transition-colors"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Grabar Otra Historia
                </motion.button>
              </motion.div>
            )}

            {/* Rejected */}
            {recordingState === "rejected" && (
              <motion.div 
                key="rejected"
                className="text-center flex flex-col items-center gap-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="w-40 h-40 bg-[#802c16] rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <XCircle size={64} className="text-white" />
                  </motion.div>
                </motion.div>
                <p className="text-xl font-semibold text-[#802c16]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  Historia no aprobada
                </p>
                <p className="text-base text-[#5d5d5d] max-w-lg" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
                  {responseMessage}
                </p>
                <motion.button
                  onClick={reset}
                  className="bg-[#d2a060] hover:bg-[#b3782e] text-white px-10 py-4 rounded-full text-base font-bold transition-colors"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Intentar de Nuevo
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Information Box */}
        <div className="bg-[#dfc49f] p-8 rounded-xl">
          <h3 className="text-xl font-semibold mb-2 text-[#212121]" style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
            Sobre el Chismógrafo
          </h3>
          <p className="text-base text-[#5d5d5d]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
            Este proyecto recopila memorias orales anónimas sobre Santa Fé de Antioquia. 
            Todas las historias pasan por un proceso de moderación automática para asegurar 
            un espacio respetuoso. Las groserías coloquiales son parte de nuestra cultura y están permitidas, 
            siempre que no sean ataques directos.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-6 bg-[#802c16] p-6 rounded-xl text-white">
            <div className="flex items-start gap-3">
              <XCircle size={24} className="flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Error de Permisos
                </p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  {errorMessage}
                </p>
                {errorMessage.includes("permiso") && (
                  <div className="mt-4 bg-[#ba4f33] p-4 rounded">
                    <p className="text-xs font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      Cómo habilitar el micrófono:
                    </p>
                    <ol className="text-xs space-y-1 list-decimal list-inside" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                      <li>Busca el ícono de candado en la barra de direcciones</li>
                      <li>Haz clic y busca "Micrófono" en los permisos</li>
                      <li>Cambia el permiso a "Permitir"</li>
                      <li>Recarga la página</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}