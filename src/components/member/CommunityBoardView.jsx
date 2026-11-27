import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Share2, 
  Send, 
  PlusCircle, 
  Users,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Megaphone
} from 'lucide-react';

export const CommunityBoardView = ({ currentUser }) => {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      author: 'Lic. Ruth Anastacio',
      cargo: 'Trabajadora Social Especialista',
      sector: 'Salud - Hospitales',
      badge: 'Admin Directiva',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      time: 'Hace 2 horas',
      categoria: 'convocatoria',
      titulo: 'Convocatoria CAS: 2 Trabajadoras Sociales en Red de Salud Lima Este',
      contenido: 'Estimadas colegas, se ha abierto convocatoria pública para el Hospital de Baja Complejidad. Se requiere colegiatura vigente y 1 año de experiencia en atenciones de emergencia y triaje social. Postulaciones abiertas hasta el viernes.',
      enlace: 'https://www.gob.pe',
      respuestas: 4,
      meGusta: 12
    },
    {
      id: 'post-2',
      author: 'Lic. Mariella Quispe',
      cargo: 'Trabajadora Social Forense',
      sector: 'Poder Judicial / Fiscalía',
      badge: 'Colegiada Verificada',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
      time: 'Ayer',
      categoria: 'modelos',
      titulo: 'Solicitud: Modelo de Informe Social Pericial para Casos de Custodia',
      contenido: 'Buenas tardes estimadas colegas, tengo un caso complejo de tenencia compartida con presunta vulneración socio-familiar. ¿Alguna colega tendría un formato o estructura de indicadores socioeconómicos validado recientemente que me pueda compartir?',
      enlace: '',
      respuestas: 7,
      meGusta: 8
    },
    {
      id: 'post-3',
      author: 'Mg. Carmen Rosa Vargas',
      cargo: 'Jefa de Bienestar Social',
      sector: 'Educación / Universidades',
      badge: 'Colegiada Verificada',
      avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80',
      time: 'Hace 2 días',
      categoria: 'casos',
      titulo: 'Articulación de Albergue para Adulto Mayor en situación de abandono',
      contenido: 'Colegas del sector Inabif / Beneficencia: atendemos un caso de un adulto mayor de 78 años sin redes de soporte familiar. Requerimos contacto directo con trabajadora social del CIAM o albergue temporal en Lima Metropolitana.',
      enlace: '',
      respuestas: 9,
      meGusta: 15
    }
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('casos');
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim() || !newPostTitle.trim()) return;

    setIsPublishing(true);
    setTimeout(() => {
      const newPost = {
        id: `post-${Date.now()}`,
        author: currentUser?.nombreCompleto || currentUser?.nombre || 'Colegiada SISNETS',
        cargo: currentUser?.cargo || 'Trabajadora Social',
        sector: currentUser?.sector || 'Trabajo Social Comunitario',
        badge: currentUser?.rol === 'admin' ? 'Admin Directiva' : 'Colegiada Verificada',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        time: 'Justo ahora',
        categoria: newPostCategory,
        titulo: newPostTitle,
        contenido: newPostText,
        enlace: '',
        respuestas: 0,
        meGusta: 1
      };

      setPosts([newPost, ...posts]);
      setNewPostTitle('');
      setNewPostText('');
      setIsPublishing(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3500);
    }, 400);
  };

  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'todos') return true;
    return post.categoria === activeCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <HeartHandshake className="w-80 h-80" />
        </div>

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            Comunidad Profesional & Cooperación Mutua
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            Muro de Alianzas & Apoyo Colegiado
          </h2>

          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
            Espacio confidencial y solidario para el intercambio de oportunidades laborales, 
            modelos de informes sociales periciales, y articulación directa de casos interinstitucionales.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a 
              href="https://chat.whatsapp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" />
              Unirse al Grupo Oficial de WhatsApp
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium text-emerald-50">
              <Users className="w-4 h-4 text-emerald-300" />
              Red Activa de Trabajo Social Perú
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Formulario de Publicación y Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Formulario de Nueva Consulta / Publicación */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-base">Crear Publicación o Consulta</h3>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ¡Tu consulta ha sido compartida con la red de colegiadas!
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-700 font-medium"
                >
                  <option value="casos">Articulación de Caso Complejo</option>
                  <option value="convocatoria">Bolsa / Convocatoria Laboral</option>
                  <option value="modelos">Solicitud de Modelos / Formatos</option>
                  <option value="capacitacion">Cursos y Capacitaciones</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Breve
                </label>
                <input
                  type="text"
                  placeholder="Ej: Apoyo para derivación de menor en Chiclayo..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detalle de la Consulta o Aporte
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe la necesidad o compártelo respetando la debida confidencialidad de datos personales según la ley de protección de datos..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-800 placeholder-slate-400 font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isPublishing ? 'Publicando...' : 'Publicar en el Muro'}
              </button>

              <div className="p-3 bg-amber-50/60 border border-amber-200/50 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 leading-tight">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Código de Ética:</strong> Omite nombres propios y DNI de usuarios de casos para resguardar el secreto profesional del Trabajo Social.
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Columna Derecha: Filtros y Feed de Publicaciones */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Barra de Filtros */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/70 shadow-sm">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'todos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos ({posts.length})
            </button>
            <button
              onClick={() => setActiveCategory('convocatoria')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCategory === 'convocatoria'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Convocatorias
            </button>
            <button
              onClick={() => setActiveCategory('casos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCategory === 'casos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Articulación de Casos
            </button>
            <button
              onClick={() => setActiveCategory('modelos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeCategory === 'modelos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Modelos y Formatos
            </button>
          </div>

          {/* Listado de Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header del post */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      className="w-11 h-11 rounded-2xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{post.author}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
                          {post.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {post.cargo} • <span className="text-emerald-600">{post.sector}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                    {post.time}
                  </span>
                </div>

                {/* Contenido */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-base leading-snug">
                    {post.titulo}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {post.contenido}
                  </p>
                </div>

                {/* Footer del Post con acciones */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setPosts(posts.map(p => p.id === post.id ? { ...p, meGusta: p.meGusta + 1 } : p));
                      }}
                      className="inline-flex items-center gap-1.5 hover:text-emerald-600 font-medium transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{post.meGusta} Apoyos</span>
                    </button>

                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.respuestas} Respuestas</span>
                    </span>
                  </div>

                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Hola estimada colega, vi tu publicación en el Muro SISNETS sobre: "${post.titulo}" y me gustaría articular contigo.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium text-xs transition-colors border border-slate-200/60"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Articular por WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
