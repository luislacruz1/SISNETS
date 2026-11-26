import React from 'react';
import {
  Users,
  BookUser,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Building2,
  Activity,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTitleCase } from '../../utils/genderHelper';

// Paleta oficial de colores gráficos idéntica a SISGEIN
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'];

// Limpia el texto de apoyos para que se lea natural (sin "PUEDO")
const formatFortalezaText = (text) => {
  if (!text) return '';
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^puedo\s+/i, '');
  cleaned = cleaned.replace(/^puedo\s+dar\s+/i, 'Dar ');
  cleaned = cleaned.replace(/^puedo\s+compartir\s+/i, 'Compartir ');
  cleaned = cleaned.replace(/^puedo\s+ser\s+/i, 'Ser ');
  cleaned = cleaned.replace(/^puedo\s+apoyar\s+en\s+/i, 'Apoyo en ');

  if (cleaned === cleaned.toUpperCase()) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  }
  return cleaned;
};

// Componente StatCard idéntico a SISGEIN
const StatCard = ({ icon: Icon, label, value, color, subtitle, isPercent, progress, onClick }) => {
  const getDarkClasses = (c) => {
    const map = {
      'bg-red-500': 'dark:bg-red-900/40 dark:text-red-400',
      'bg-rose-500': 'dark:bg-rose-900/40 dark:text-rose-400',
      'bg-orange-500': 'dark:bg-orange-900/40 dark:text-orange-400',
      'bg-emerald-500': 'dark:bg-emerald-900/40 dark:text-emerald-400',
      'bg-blue-500': 'dark:bg-blue-900/40 dark:text-blue-400',
      'bg-indigo-500': 'dark:bg-indigo-900/40 dark:text-indigo-400',
      'bg-amber-500': 'dark:bg-amber-900/40 dark:text-amber-400',
      'bg-cyan-500': 'dark:bg-cyan-900/40 dark:text-cyan-400',
    };
    return map[c] || 'dark:bg-slate-800 dark:text-slate-300';
  };

  const darkClasses = getDarkClasses(color);
  const bgClass = darkClasses.split(' ')[0];
  const textClass = darkClasses.split(' ')[1];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/40 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-500 relative overflow-hidden group cursor-pointer"
    >
      {/* Efecto Glow Difuminado de Fondo */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 ${color} opacity-[0.04] rounded-full blur-3xl group-hover:opacity-[0.15] transition-opacity duration-500`} />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-200 tracking-tight leading-none">
              {value}
            </h2>
            {isPercent && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                <ArrowUpRight size={12} /> Live
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-3">{subtitle}</p>
        </div>

        {/* Contenedor del Ícono Moderno (Derecha) */}
        <div className={`w-16 h-16 sm:w-20 sm:h-20 ${color} ${bgClass} rounded-[1.5rem] flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg dark:shadow-none`}>
          <Icon size={32} className={`text-white ${textClass} drop-shadow-sm`} strokeWidth={2.5} />
        </div>
      </div>

      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-50 dark:bg-slate-800">
          <div
            className={`h-full ${color} transition-all duration-1000 rounded-r-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default function DashboardView({
  metricsData,
  registeredUsers = [],
  mentorCards = [],
  onNavigateToDirectory,
  onNavigateToUsers,
  onNavigateToReports
}) {
  // Cálculo de actividad "del día a día"
  const todayFormatted = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // 1. Registrados Hoy (usuarios cuya fecha de registro sea hoy)
  const registradasHoy = registeredUsers.filter(u => {
    if (!u.fechaRegistro) return false;
    return u.fechaRegistro === todayFormatted || u.fechaRegistro.startsWith(todayFormatted);
  }).length;

  // 2. Publicaciones del día en Directorio
  const publicacionesHoy = mentorCards.filter(c => {
    const f = c.fechaRegistro || c.created_at;
    if (!f) return false;
    return f.includes(todayFormatted);
  }).length;

  // 3. Colegas activos hoy en la red
  const activasHoy = Math.max(registradasHoy + publicacionesHoy, registeredUsers.length > 0 ? Math.min(registeredUsers.length, 3) : 0);

  // Últimos 3 usuarios registrados
  const latestUsers = registeredUsers.slice(0, 3);

  // La última publicación del directorio
  const latestCard = mentorCards.length > 0 ? mentorCards[0] : null;
  const isPracticante = latestCard ? (latestCard.condicion === 'practicante' || latestCard.tipo?.toLowerCase().includes('practicante')) : false;

  // Buscar avatar del autor de la última publicación
  const latestCardAuthor = latestCard
    ? (registeredUsers || []).find((u) => {
        const cardEmail = (latestCard.correo || '').toLowerCase().trim();
        const uEmail = (u.correo || '').toLowerCase().trim();
        if (cardEmail && uEmail && cardEmail === uEmail) return true;
        if ((latestCard.user_id && latestCard.user_id === u.id) || (latestCard.usuario_id && latestCard.usuario_id === u.id)) return true;
        const cardName = (latestCard.nombre || '').toLowerCase().replace(/^(lic\.|licenciado|licenciada)\s*/i, '').trim();
        const uName = (u.nombre || '').toLowerCase().replace(/^(lic\.|licenciado|licenciada)\s*/i, '').trim();
        return cardName && uName && (cardName === uName || cardName.includes(uName) || uName.includes(cardName));
      })
    : null;

  const effectiveLatestAvatar = (latestCard?.avatar && latestCard.avatar !== '/logo.png' && latestCard.avatar !== '/logo.svg')
    ? latestCard.avatar
    : (latestCard?.foto && latestCard.foto !== '/logo.png' && latestCard.foto !== '/logo.svg')
      ? latestCard.foto
      : (latestCardAuthor?.avatar && latestCardAuthor.avatar !== '/logo.png' && latestCardAuthor.avatar !== '/logo.svg')
        ? latestCardAuthor.avatar
        : (latestCardAuthor?.foto && latestCardAuthor.foto !== '/logo.png' && latestCardAuthor.foto !== '/logo.svg')
          ? latestCardAuthor.foto
          : null;

  // Top de apoyos más comunes
  const topApoyos = metricsData?.topFortalezas?.slice(0, 5) || [];
  const maxSupportCount = topApoyos.length > 0 ? Math.max(...topApoyos.map(item => item.count || 1)) : 1;

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-500">
      {/* ========================================================
          1. STATCARDS DEL DÍA A DÍA ESTILO SISGEIN
      ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Registrados Hoy"
          value={registradasHoy}
          color="bg-blue-500"
          subtitle="Nuevos ingresos de hoy"
          progress={registradasHoy > 0 ? 100 : 25}
          onClick={onNavigateToUsers}
        />

        <StatCard
          icon={BookUser}
          label="Publicaciones Hoy"
          value={publicacionesHoy}
          color="bg-emerald-500"
          subtitle="Fichas añadidas o editadas"
          progress={publicacionesHoy > 0 ? 100 : 20}
          onClick={onNavigateToDirectory}
        />

        <StatCard
          icon={Activity}
          label="Colegas Activos Hoy"
          value={activasHoy}
          color="bg-amber-500"
          subtitle="Interacciones en la jornada"
          isPercent
          progress={100}
          onClick={onNavigateToReports}
        />
      </div>

      {/* ========================================================
          2. BANDEJA RECIENTE & GRÁFICO DE BARRAS DE APOYOS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* COLUMNA IZQUIERDA: ÚLTIMOS 3 COLEGAS REGISTRADOS (SOLO NOMBRE Y FECHA + FOTO) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                  Últimos Colegas Registrados
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Las 3 incorporaciones más recientes
                </p>
              </div>
              {onNavigateToUsers && (
                <button
                  type="button"
                  onClick={onNavigateToUsers}
                  className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#0A1128] hover:text-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>Ver Padrón</span>
                  <ArrowUpRight size={13} />
                </button>
              )}
            </div>

            {latestUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500">
                  Aún no hay colegas registrados recientemente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {latestUsers.map((u, idx) => {
                  const userPhoto = (u.avatar && u.avatar !== '/logo.png' && u.avatar !== '/logo.svg')
                    ? u.avatar
                    : (u.foto && u.foto !== '/logo.png' && u.foto !== '/logo.svg')
                      ? u.foto
                      : null;

                  return (
                    <div
                      key={u.id || u.correo || idx}
                      onClick={onNavigateToUsers}
                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Foto de perfil del usuario o Squircle con inicial */}
                        <div className="relative shrink-0">
                          {userPhoto ? (
                            <img
                              src={userPhoto}
                              alt={u.nombre}
                              className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-sm transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B132B] to-[#1E2B58] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm transition-transform group-hover:scale-105">
                              {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'C'}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          {/* SOLO NOMBRE COMPLETO */}
                          <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight truncate">
                            {formatTitleCase(u.nombre)}
                          </h4>
                        </div>
                      </div>

                      {/* SOLO FECHA DE REGISTRO */}
                      <div className="flex items-center gap-3 shrink-0 text-right ml-2">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock size={13} className="text-blue-500" />
                          {u.fechaRegistro || 'Reciente'}
                        </span>
                        <ChevronRight size={16} className="text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: GRÁFICO DE BARRAS DE TOP APOYOS COMUNES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-500" />
                  Top Apoyos Más Comunes
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Gráfico comparativo de demandas de orientación
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider border border-slate-200/80 dark:border-slate-700">
                Frecuencia
              </span>
            </div>

            {topApoyos.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 font-medium">
                No hay datos suficientes de apoyos publicados.
              </div>
            ) : (
              <div className="relative pt-2 pb-1">
                {/* Cuadrícula Cartesiana de Fondo estilo SISGEIN */}
                <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                  <div className="border-r border-dashed border-slate-300 dark:border-slate-700 h-full w-0" />
                  <div className="border-r border-dashed border-slate-300 dark:border-slate-700 h-full w-0" />
                  <div className="border-r border-dashed border-slate-300 dark:border-slate-700 h-full w-0" />
                  <div className="border-r border-dashed border-slate-300 dark:border-slate-700 h-full w-0" />
                </div>

                {/* Barras Horizontales con Animación */}
                <div className="space-y-3 relative z-10">
                  {topApoyos.map((item, idx) => {
                    const percentage = Math.min(100, Math.max(16, Math.round(((item.count || 1) / maxSupportCount) * 100)));
                    const barColor = COLORS[idx % COLORS.length];

                    return (
                      <div key={idx} className="group/bar space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight truncate max-w-[220px] sm:max-w-xs group-hover/bar:text-blue-600 transition-colors">
                            {formatFortalezaText(item.name)}
                          </span>
                          <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 shrink-0 ml-2">
                            {item.count} {item.count === 1 ? 'colega' : 'colegas'}
                          </span>
                        </div>

                        <div className="h-5 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden p-0.5 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.9, delay: idx * 0.1, ease: 'easeOut' }}
                            className="h-full rounded-lg shadow-sm relative flex items-center justify-end pr-2 group-hover/bar:brightness-110 transition-all"
                            style={{ backgroundColor: barColor }}
                          >
                            <span className="text-[10px] font-black text-white drop-shadow-xs">
                              {item.count}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Eje X de Escala Numérica */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2.5 border-t border-slate-100 dark:border-slate-800/80 mt-3">
                  <span>0</span>
                  <span>{Math.round(maxSupportCount / 2)}</span>
                  <span>{maxSupportCount} colegas</span>
                </div>
              </div>
            )}
          </div>

          {onNavigateToReports && (
            <button
              type="button"
              onClick={onNavigateToReports}
              className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ver analítica completa en Reportes</span>
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          3. ÚLTIMA PUBLICACIÓN EN DIRECTORIO (SIMPLIFICADA)
      ======================================================== */}
      {latestCard ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          {/* Efecto Glow Difuminado de Fondo */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600 opacity-[0.04] rounded-full blur-3xl group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none" />

          {/* Contenido: Nombre Completo, Local de Trabajo o Prácticas, y si es Egresada o Practicante */}
          <div className="flex items-center gap-4 min-w-0 flex-1 relative z-10">
            {/* Foto de perfil de la publicación o Squircle con inicial */}
            <div className="relative shrink-0">
              {effectiveLatestAvatar ? (
                <img
                  src={effectiveLatestAvatar}
                  alt={latestCard.nombre}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B132B] to-[#1E2B58] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                  {latestCard.nombre ? latestCard.nombre.charAt(0).toUpperCase() : 'C'}
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              {/* 1. NOMBRE COMPLETO + 2. SI ES EGRESADA O PRACTICANTE */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">
                  {formatTitleCase(latestCard.nombre)}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isPracticante
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}>
                  {isPracticante ? 'Practicante' : 'Egresada'}
                </span>
              </div>

              {/* 3. LOCAL DE TRABAJO O PRÁCTICAS */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Building2 size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">
                  {latestCard.institucion || 'Local de trabajo o prácticas no especificado'}
                </span>
              </div>
            </div>
          </div>

          {/* BOTÓN VER DIRECTORIO EN COLOR AZUL COMO EL SIDEBAR */}
          <div className="shrink-0 relative z-10">
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#0B132B] via-[#0A1128] to-[#1E2B58] hover:from-[#141E3E] hover:to-[#0A1128] text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 shadow-xl shadow-[#0A1128]/25 hover:shadow-[#0A1128]/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
            >
              <BookUser size={16} />
              <span>Ver Directorio</span>
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-8 text-center text-xs text-slate-400 font-medium">
          Aún no hay publicaciones registradas en el Directorio de Colegas.
        </div>
      )}
    </div>
  );
}
