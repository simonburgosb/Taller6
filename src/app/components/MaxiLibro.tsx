import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Tag, Loader2, Play } from "lucide-react";
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

export default function MaxiLibro() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8c79cdcb/stories`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error("Error al cargar historias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(stories.flatMap((story) => story.etiquetas))
  ).sort();

  // Filter stories by selected tag
  const filteredStories = selectedTag
    ? stories.filter((story) => story.etiquetas.includes(selectedTag))
    : stories;

  if (loading) {
    return (
      <div className="bg-[#f6e5cf] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={64} className="animate-spin text-[#28555a] mx-auto mb-4" />
          <p className="text-lg text-[#5d5d5d]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Cargando memorias...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6e5cf] min-h-screen px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-5xl font-bold text-[#212121] mb-4" 
            style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
          >
            MaxiLibro de Memorias
          </h2>
          <p className="text-lg text-[#5d5d5d]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
            Archivo digital de las historias de Santa Fé de Antioquia
          </p>
        </motion.div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <motion.div 
            className="mb-10 bg-white p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm font-semibold mb-4 text-[#212121] text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Filtrar por etiqueta:
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <motion.button
                onClick={() => setSelectedTag(null)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-colors ${
                  selectedTag === null
                    ? "bg-[#28555a] text-white"
                    : "bg-[#e0c49f] text-[#212121] hover:bg-[#d2a060]"
                }`}
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Todas ({stories.length})
              </motion.button>
              {allTags.map((tag, index) => (
                <motion.button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-5 py-3 rounded-full text-sm font-bold transition-colors ${
                    selectedTag === tag
                      ? "bg-[#28555a] text-white"
                      : "bg-[#e0c49f] text-[#212121] hover:bg-[#d2a060]"
                  }`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag} ({stories.filter((s) => s.etiquetas.includes(tag)).length})
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <motion.div 
            className="text-center py-20 bg-white rounded-2xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-[#5d5d5d]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              {selectedTag
                ? `No hay historias con la etiqueta "${selectedTag}"`
                : "Aún no hay historias publicadas. ¡Sé el primero en compartir!"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/historia/${story.id}`}
                  className="group block"
                >
                  <motion.div 
                    className="bg-white rounded-2xl shadow-lg p-6 transition-all h-full flex flex-col"
                    whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-[#4e7378] mb-3">
                      <Calendar size={16} />
                      <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                        {new Date(story.fecha).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold mb-3 text-[#212121] group-hover:text-[#4e7378] transition-colors" style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>
                      {story.titulo}
                    </h3>

                    {/* Summary */}
                    <p className="text-[#5d5d5d] mb-4 flex-grow line-clamp-3" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
                      {story.resumen}
                    </p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {story.etiquetas.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-[#ddb198] text-[#802c16] px-3 py-1 rounded-full text-xs font-bold"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Play Button */}
                    <motion.div 
                      className="flex items-center gap-2 text-[#28555a] font-bold"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Play size={18} />
                      <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Escuchar historia
                      </span>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}