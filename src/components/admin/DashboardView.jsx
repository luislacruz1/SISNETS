import React from 'react';
import {
  Users,
  Award,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  Briefcase,
  MessageCircle,
  GraduationCap,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Crown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTitleCase, isMasculineName } from '../../utils/genderHelper';

// Limpia el texto de fortalezas para que se lea natural (sin "PUEDO")
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
    <div className="space-y-6 sm:space-y-7">
      {/* SECCIÓN 1: ÚLTIMOS 3 USUARIOS REGISTRADOS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-sm">
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight flex items-center gap-2">
                Últimos 3 Registrados
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                  En vivo
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Las 3 colegas más recientes que se unieron a la red profesional
              </p>
            </div>
          </div>
          {onNavigateToUsers && (
            <button
              type="button"
              onClick={onNavigateToUsers}
              className="text-xs font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-all group active:scale-95"
            >
              <span>Ver padrón completo</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {latestUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestUsers.map((u, idx) => {
              const isAdmin = u.rol === 'admin';
              const isPracticante = u.condicion === 'practicante';
              const avatarUrl = (u.avatar && u.avatar !== '/logo.png' && u.avatar !== '/logo.svg') ? u.avatar : null;

              return (
                <motion.div
                  key={u.id || u.correo || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.06 }}
                  className="relative p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  {/* Barra de acento sutil superior */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
                    isAdmin
                      ? 'from-amber-400 via-orange-400 to-amber-500'
                      : 'from-cyan-400 via-blue-500 to-indigo-600'
                  }`} />

                  <div>
                    {/* Cabecera de la tarjeta: Avatar + Nombre + Role Badge */}
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={u.nombre}
                              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-cyan-500/30 shadow-md"
                            />
                          ) : (
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
                              isAdmin
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/20'
                                : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/20'
                            }`}>
                              {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'C'}
                            </div>
                          )}
                          {/* Indicador de estado activo en vivo */}
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"
                            title="Usuario activo"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-[#0A1128] dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {formatTitleCase(u.nombre)}
                          </h4>
                          <span className="text-[11px] text-slate-400 block truncate font-medium">
                            {u.correo}
                          </span>
                        </div>
                      </div>

                      {/* Badge de Rol */}
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                        isAdmin
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30 shadow-sm'
                          : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-400/30'
                      }`}>
                        {isAdmin && <ShieldCheck size={11} />}
                        {isAdmin ? 'Admin' : 'Colegiada'}
                      </span>
                    </div>

                    {/* Centro Laboral e Institución */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Building2 size={14} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span className="font-bold truncate">
                          {u.centro || 'SISNETS (Comunidad)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer de la tarjeta: Condición y Fecha */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isPracticante
                        ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40'
                    }`}>
                      <GraduationCap size={11} />
                      {isPracticante ? 'Practicante' : 'Egresada'}
                    </span>

                    <span className="flex items-center gap-1 text-slate-400 font-medium text-[10px]">
                      <Clock size={11} /> {u.fechaRegistro || 'Reciente'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center font-medium">
            No hay colegiadas registradas recientemente.
          </p>
        )}
      </div>

      {/* SECCIÓN 2: ÚLTIMA PUBLICACIÓN DEL DIRECTORIO Y TOP DE APOYOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* COLUMNA A: ÚLTIMA PUBLICACIÓN DEL DIRECTORIO (SPOTLIGHT CARD) */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          {/* Línea de acento superior esmeralda */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

          <div>
            {/* Header de la Card */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
                    Última Publicación
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Ficha más reciente publicada en el Directorio de Colegas
                  </p>
                </div>
              </div>

              {/* Badge pulsante "Nueva" */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Nueva Ficha
              </span>
            </div>

            {latestCard ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50/80 dark:from-slate-800/70 dark:via-slate-900 dark:to-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3.5 shadow-sm">
                {/* Perfil del Autor */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      {effectiveLatestAvatar ? (
                        <img
                          src={effectiveLatestAvatar}
                          alt={latestCard.nombre}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-emerald-500/20">
                          {latestCard.nombre ? latestCard.nombre.charAt(0).toUpperCase() : 'C'}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white truncate">
                        {formatTitleCase(latestCard.nombre)}
                      </h4>
                      <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mt-0.5">
                        {latestCard.tipo || (latestCard.condicion === 'practicante' ? 'Practicante' : 'Egresada')}
                      </span>
                    </div>
                  </div>

                  {/* Botón WhatsApp Directo */}
                  {latestCard.telefono && (
                    <a
                      href={`https://wa.me/${latestCard.telefono.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95 transition-all shrink-0"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* Centro Laboral y Cargo */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white/80 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/50 text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold text-[#0A1128] dark:text-white truncate">
                      {latestCard.institucion}
                    </span>
                  </div>
                  {latestCard.cargo && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <Briefcase size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{latestCard.cargo}</span>
                    </div>
                  )}
                </div>

                {/* Apoyos ofrecidos */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Apoyo que brinda:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(latestCard.fortalezas) ? latestCard.fortalezas : (latestCard.apoyo ? latestCard.apoyo.split(' · ') : []))
                      .slice(0, 3)
                      .map((f, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/50 shadow-xs"
                        >
                          {formatFortalezaText(f)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                Aún no hay fichas publicadas en el directorio.
              </div>
            )}
          </div>

          {onNavigateToDirectory && (
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="w-full mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 text-xs font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Explorar todo el Directorio de Colegas</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* COLUMNA B: TOP DE APOYOS MÁS COMUNES */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          {/* Línea de acento superior dorada */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500" />

          <div>
            {/* Header de la Card */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-sm">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
                    Top Apoyos Más Comunes
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Temáticas de orientación más ofrecidas por las colegas
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Crown size={12} />
                Ranking
              </span>
            </div>

            {/* Lista de Apoyos con Barra de Progreso Integrada */}
            <div className="space-y-2.5 mt-2">
              {topApoyos.length > 0 ? (
                topApoyos.map((item, idx) => {
                  const percentage = Math.min(100, Math.round(((item.count || 1) / maxSupportCount) * 100));
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;

                  return (
                    <div
                      key={idx}
                      className="relative p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-amber-400/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 overflow-hidden shadow-xs"
                    >
                      {/* Barra de progreso de fondo muy suave */}
                      <div
                        className={`absolute inset-y-0 left-0 opacity-10 pointer-events-none transition-all duration-500 ${
                          isTop1
                            ? 'bg-amber-500'
                            : isTop2
                              ? 'bg-blue-500'
                              : isTop3
                                ? 'bg-orange-500'
                                : 'bg-cyan-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Badge de Posición */}
                          <span className={`w-6 h-6 rounded-lg font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs ${
                            isTop1
                              ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-500/30 ring-1 ring-amber-300'
                              : isTop2
                                ? 'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 text-white'
                                : isTop3
                                  ? 'bg-gradient-to-br from-orange-400 to-amber-600 text-white'
                                  : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            #{idx + 1}
                          </span>

                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {formatFortalezaText(item.name)}
                          </span>
                        </div>

                        {/* Cantidad de colegas */}
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-black shrink-0 border border-emerald-500/30">
                          {item.count} {item.count === 1 ? 'colega' : 'colegas'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  Las estadísticas de apoyos se calcularán cuando haya publicaciones.
                </div>
              )}
            </div>
          </div>

          {onNavigateToReports && (
            <button
              type="button"
              onClick={onNavigateToReports}
              className="w-full mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 text-xs font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Ver estadísticas completas y descargas en Reportes</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
