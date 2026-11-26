import React from 'react';
import {
  Users,
  BookUser,
  Sparkles,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Building2,
  Briefcase,
  MessageCircle,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Crown,
  Award,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTitleCase } from '../../utils/genderHelper';

// Paleta oficial de colores gráficos idéntica a SISGEIN
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'];

// Formateador de tiempo relativo idéntico al de SISGEIN
const timeAgo = (dateString) => {
  if (!dateString) return 'Reciente';
  try {
    let date;
    if (typeof dateString === 'string' && dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    } else {
      date = new Date(dateString);
    }
    if (!date || isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return 'Ayer';
    if (days < 30) return `Hace ${days} días`;
    return dateString;
  } catch (e) {
    return dateString;
  }
};

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
  // 1. Los últimos 3 usuarios registrados
  const latestUsers = registeredUsers.slice(0, 3);

  // 2. La última publicación del directorio
  const latestCard = mentorCards.length > 0 ? mentorCards[0] : null;

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
    : (latestCardAuthor?.avatar && latestCardAuthor.avatar !== '/logo.png' && latestCardAuthor.avatar !== '/logo.svg')
      ? latestCardAuthor.avatar
      : null;

  // 3. Top de apoyos más comunes
  const topApoyos = metricsData?.topFortalezas?.slice(0, 5) || [];
  const maxSupportCount = topApoyos.length > 0 ? Math.max(...topApoyos.map(item => item.count || 1)) : 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ========================================================
          1. STATCARDS SUPERIORES ESTILO SISGEIN
      ======================================================== */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-lg font-bold text-[#0A1128] dark:text-slate-200">
            Resumen General de la Red
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Users}
            label="Colegiadas Registradas"
            value={registeredUsers.length}
            color="bg-blue-500"
            subtitle="Padrón oficial activo"
            progress={100}
            onClick={onNavigateToUsers}
          />

          <StatCard
            icon={BookUser}
            label="Fichas Publicadas"
            value={mentorCards.length}
            color="bg-emerald-500"
            subtitle="Perfiles en el directorio"
            progress={mentorCards.length > 0 ? 100 : 0}
            onClick={onNavigateToDirectory}
          />

          <StatCard
            icon={Sparkles}
            label="Especialidades de Apoyo"
            value={topApoyos.length}
            color="bg-amber-500"
            subtitle="Temáticas de orientación"
            isPercent
            progress={100}
            onClick={onNavigateToReports}
          />
        </div>
      </div>

      {/* ========================================================
          2. BANDEJA RECIENTE & RANKING (GRID DE 2 COLUMNAS ESTILO SISGEIN)
      ======================================================== */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
          <h2 className="text-lg font-bold text-[#0A1128] dark:text-slate-200">
            Actividad y Orientaciones Frecuentes
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* COLUMNA IZQUIERDA (lg:col-span-2): BANDEJA DE ÚLTIMOS 3 REGISTRADOS */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className="flex items-center justify-between mb-5 shrink-0">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                    Últimas Colegiadas Registradas
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Las 3 incorporaciones más recientes al sistema
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
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-3">
                    <Users size={28} className="text-blue-500" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                    Sin registros recientes
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Aún no se han registrado nuevos usuarios en la plataforma.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {latestUsers.map((u, idx) => {
                    const isAdmin = u.rol === 'admin';
                    const isPracticante = u.condicion === 'practicante';
                    const avatarUrl = (u.avatar && u.avatar !== '/logo.png' && u.avatar !== '/logo.svg') ? u.avatar : null;

                    return (
                      <div
                        key={u.id || u.correo || idx}
                        onClick={onNavigateToUsers}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Avatar Squircle con estilo SISGEIN */}
                          <div className="relative shrink-0">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={u.nombre}
                                className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-sm"
                              />
                            ) : (
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-transform group-hover:scale-105 shadow-sm ${
                                isAdmin
                                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                                  : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                              }`}>
                                {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'C'}
                              </div>
                            )}
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight truncate">
                                {formatTitleCase(u.nombre)}
                              </h4>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 ${
                                isAdmin
                                  ? 'text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300'
                                  : 'text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300'
                              }`}>
                                {isAdmin ? 'Admin' : 'Colegiada'}
                              </span>
                              <span className={`hidden sm:inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 ${
                                isPracticante
                                  ? 'text-violet-700 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300'
                                  : 'text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
                              }`}>
                                {isPracticante ? 'Practicante' : 'Egresada'}
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate flex items-center gap-1.5">
                              <Building2 size={12} className="text-slate-400 shrink-0" />
                              <span className="truncate">{u.centro || 'SISNETS (Comunidad)'}</span>
                              <span className="text-slate-300 dark:text-slate-600">·</span>
                              <span className="text-slate-400 truncate">{u.correo}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-right ml-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:flex items-center gap-1">
                            <Clock size={12} />
                            {timeAgo(u.fechaRegistro)}
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

          {/* COLUMNA DERECHA (lg:col-span-1): TOP APOYOS CON BARRAS ESTILO SISGEIN */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                    Top Apoyos Comunes
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Orientaciones más frecuentes
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Crown size={12} />
                  Top 5
                </span>
              </div>

              {topApoyos.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-medium">
                  No hay datos suficientes de apoyos publicados.
                </div>
              ) : (
                <div className="space-y-4 my-2">
                  {topApoyos.map((item, idx) => {
                    const percentage = Math.min(100, Math.round(((item.count || 1) / maxSupportCount) * 100));
                    const barColor = COLORS[idx % COLORS.length];

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-5 h-5 rounded-md font-black text-[10px] flex items-center justify-center shrink-0 ${
                              idx === 0
                                ? 'bg-amber-500 text-white shadow-xs'
                                : idx === 1
                                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                                  : idx === 2
                                    ? 'bg-orange-400 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight truncate">
                              {formatFortalezaText(item.name)}
                            </span>
                          </div>
                          <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 shrink-0 ml-2">
                            {item.count} {item.count === 1 ? 'colega' : 'colegas'}
                          </span>
                        </div>

                        {/* Barra animada idéntica a la de facultades de SISGEIN */}
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-slate-800 p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
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
      </div>

      {/* ========================================================
          3. ÚLTIMA PUBLICACIÓN EN DIRECTORIO (SPOTLIGHT CARD)
      ======================================================== */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-lg font-bold text-[#0A1128] dark:text-slate-200">
            Última Publicación en el Directorio
          </h2>
        </div>

        {latestCard ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            {/* Efecto Glow Difuminado de Fondo */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500 opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none" />

            {/* Información de la Colega */}
            <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1 relative z-10">
              <div className="relative shrink-0">
                {effectiveLatestAvatar ? (
                  <img
                    src={effectiveLatestAvatar}
                    alt={latestCard.nombre}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] object-cover ring-2 ring-emerald-500/30 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    {latestCard.nombre ? latestCard.nombre.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>

              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Publicación Reciente
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {latestCard.tipo || (latestCard.condicion === 'practicante' ? 'Practicante' : 'Egresada')}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  {formatTitleCase(latestCard.nombre)}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{latestCard.institucion}</span>
                  </div>
                  {latestCard.cargo && (
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Briefcase size={13} className="text-slate-400 shrink-0" />
                      <span>{latestCard.cargo}</span>
                    </div>
                  )}
                </div>

                {/* Tags de Apoyo que brinda */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {(Array.isArray(latestCard.fortalezas) ? latestCard.fortalezas : (latestCard.apoyo ? latestCard.apoyo.split(' · ') : []))
                    .slice(0, 3)
                    .map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200/80 dark:border-slate-700"
                      >
                        {formatFortalezaText(f)}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Acciones de Contacto & Exploración */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 relative z-10">
              {latestCard.telefono && (
                <a
                  href={`https://wa.me/${latestCard.telefono.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Contactar WhatsApp</span>
                  <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              )}

              {onNavigateToDirectory && (
                <button
                  type="button"
                  onClick={onNavigateToDirectory}
                  className="px-5 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-[#0A1128] hover:text-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <BookUser size={15} />
                  <span>Ver en Directorio</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] p-8 text-center text-xs text-slate-400 font-medium">
            Aún no hay publicaciones registradas en el Directorio de Colegas.
          </div>
        )}
      </div>
    </div>
  );
}
