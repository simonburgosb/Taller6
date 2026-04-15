import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { Calendar, Tag, ArrowLeft, Play, Pause, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { motion } from "motion/react";

interface Story {
  id: string;
  fecha: string;
  titulo: string;
  resumen: string;
  transcripcion: string;
  etiquetas: string[];
  audio_url: string;
}

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (id) {
      fetchStory(id);
    }
  }, [id]);

  const fetchStory = async (storyId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8c79cdcb/stories/${storyId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setStory(data.story);
    } catch (error) {
      console.error("Error al cargar la historia:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f6e5cf] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={64} className="animate-spin text-[#28555a] mx-auto mb-4" />
          <p className="text-lg text-[#5d5d5d]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Cargando historia...
          </p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="bg-[#f6e5cf] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#212121]" style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
            Historia no encontrada
          </h2>
          <Link
            to="/maxilibro"
            className="inline-flex items-center gap-2 bg-[#28555a] hover:bg-[#163d41] text-white px-8 py-4 rounded-full font-bold transition-colors"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <ArrowLeft size={20} />
            Volver al MaxiLibro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6e5cf] min-h-screen px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/maxilibro"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#28555a] text-[#28555a] hover:text-white px-6 py-3 rounded-full font-bold mb-8 transition-colors shadow-md"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <ArrowLeft size={20} />
            Volver al MaxiLibro
          </Link>
        </motion.div>

        {/* Story Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Date */}
          <motion.div 
            className="flex items-center gap-2 text-sm text-[#4e7378] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Calendar size={18} />
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              {new Date(story.fecha).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-5xl font-bold mb-6 text-[#212121]" 
            style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {story.titulo}
          </motion.h1>

          {/* Tags */}
          <motion.div 
            className="flex gap-2 mb-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {story.etiquetas.map((tag, index) => (
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
          </motion.div>

          {/* Audio Player */}
          <motion.div 
            className="bg-[#28555a] rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-white hover:bg-[#f6e5cf] rounded-full flex items-center justify-center transition-colors shadow-lg flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? (
                  <Pause size={32} className="text-[#28555a]" />
                ) : (
                  <Play size={32} className="text-[#28555a] ml-1" />
                )}
              </motion.button>
              <div className="flex-grow">
                <motion.p 
                  className="text-sm text-white mb-2 font-bold" 
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  animate={isPlaying ? { opacity: [1, 0.7, 1] } : {}}
                  transition={isPlaying ? { duration: 2, repeat: Infinity } : {}}
                >
                  Escuchar audio original
                </motion.p>
                <div className="h-2 bg-[#4e7378] rounded-full overflow-hidden">
                  <div className="h-full bg-white w-0 transition-all" id="progress-bar"></div>
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={story.audio_url}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={(e) => {
                const audio = e.currentTarget;
                const progress = (audio.currentTime / audio.duration) * 100;
                const progressBar = document.getElementById('progress-bar');
                if (progressBar) {
                  progressBar.style.width = `${progress}%`;
                }
              }}
            />
          </motion.div>

          {/* Summary */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-3 text-[#212121]" style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
              Resumen
            </h2>
            <p className="text-lg text-[#5d5d5d] leading-relaxed" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
              {story.resumen}
            </p>
          </motion.div>

          {/* Full Transcription */}
          <motion.div 
            className="bg-[#e9d1c2] rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-[#212121]" style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
              Transcripción completa
            </h2>
            <p className="text-base text-[#5d5d5d] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
              {story.transcripcion}
            </p>
          </motion.div>
        </motion.div>

        {/* Info Box */}
        <motion.div 
          className="mt-8 bg-[#80a4a8] text-white p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm leading-relaxed" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Esta historia es parte del proyecto "Cartografía de Memorias" de Santa Fé de Antioquia. 
            Todas las historias son anónimas y han sido moderadas para preservar un espacio respetuoso de intercambio cultural.
          </p>
        </motion.div>
      </div>
    </div>
  );
}