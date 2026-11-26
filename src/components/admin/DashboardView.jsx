import React from 'react';
import {
  Users,
  FileText,
  Award,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  Briefcase,
  Phone,
  MessageCircle,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTitleCase, isMasculineName } from '../../utils/genderHelper';

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

  // 3. Top de apoyos más comunes
  const topApoyos = metricsData?.topFortalezas?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* HEADER INFORMATIVO */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#0A1128] to-[#141E3E] text-white p-6 sm:p-7 border border-cyan-500/30 shadow-lg shadow-[#0A1128]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Panel Informativo en Vivo · SISNETS
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Resumen de Actividad Reciente
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Últimas incorporaciones, la publicación más reciente y las especialidades de apoyo más frecuentes en la red.
          </p>
        </div>

        {/* Mini Contadores Informativos */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-center">
            <span className="block text-xs font-bold text-slate-400">Total Colegiadas</span>
            <span className="text-lg font-black text-cyan-400">{registeredUsers.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-center">
            <span className="block text-xs font-bold text-slate-400">Fichas Activas</span>
            <span className="text-lg font-black text-emerald-400">{mentorCards.length}</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: ÚLTIMOS 3 USUARIOS REGISTRADOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <UserCheck size={17} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
                Últimos 3 Registrados
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Las 3 colegas más recientes que se unieron al sistema
              </p>
            </div>
          </div>
          {onNavigateToUsers && (
            <button
              type="button"
              onClick={onNavigateToUsers}
              className="text-xs font-black text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 group"
            >
              <span>Ver todos</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {latestUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {latestUsers.map((u, idx) => {
              const isAdmin = u.rol === 'admin';
              return (
                <motion.div
                  key={u.id || u.correo || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    isAdmin ? 'from-amber-400 to-orange-500' : 'from-cyan-400 to-blue-600'
                  }`} />

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isAdmin
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-400/30'
                            : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-400/30'
                        }`}>
                          {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-[#0A1128] dark:text-white truncate">
                            {formatTitleCase(u.nombre)}
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {u.correo}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 ${
                        isAdmin
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      }`}>
                        {isAdmin ? 'Admin' : 'Colegiada'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{u.centro || 'SISNETS (Comunidad)'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="capitalize">{u.condicion === 'practicante' ? 'Practicante' : 'Egresada'}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {u.fechaRegistro || 'Reciente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            No hay colegiadas registradas recientemente.
          </p>
        )}
      </div>

      {/* SECCIÓN 2: ÚLTIMA PUBLICACIÓN DEL DIRECTORIO Y TOP DE APOYOS (2 COLUMNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* COLUMNA A: ÚLTIMA PUBLICACIÓN DEL DIRECTORIO */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles size={17} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
                    Última Publicación
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    La ficha más reciente publicada en el Directorio
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Nueva
              </span>
            </div>

            {latestCard ? (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-[#0A1128] dark:text-white">
                      {formatTitleCase(latestCard.nombre)}
                    </h4>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block mt-0.5">
                      {latestCard.tipo || (latestCard.condicion === 'practicante' ? 'Practicante' : 'Egresada')}
                    </span>
                  </div>
                  {latestCard.telefono && (
                    <a
                      href={`https://wa.me/${latestCard.telefono.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all"
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-400 shrink-0" />
                    <span className="font-bold text-[#0A1128] dark:text-white truncate">
                      {latestCard.institucion}
                    </span>
                  </div>
                  {latestCard.cargo && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Briefcase size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{latestCard.cargo}</span>
                    </div>
                  )}
                </div>

                {/* Apoyos ofrecidos */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Apoyo que brinda:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(latestCard.fortalezas) ? latestCard.fortalezas : (latestCard.apoyo ? latestCard.apoyo.split(' · ') : []))
                      .slice(0, 3)
                      .map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold border border-cyan-200 dark:border-cyan-800/40"
                        >
                          {f}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-6 text-center">
                Aún no hay fichas publicadas en el directorio.
              </p>
            )}
          </div>

          {onNavigateToDirectory && (
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="w-full pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center justify-center gap-1.5 transition-colors group"
            >
              <span>Explorar todo el Directorio de Colegas</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* COLUMNA B: TOP DE APOYOS MÁS COMUNES */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Award size={17} />
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
            </div>

            <div className="space-y-2.5 mt-3">
              {topApoyos.length > 0 ? (
                topApoyos.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-cyan-400/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                          : idx === 1
                            ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            : idx === 2
                              ? 'bg-orange-400 text-white'
                              : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-black shrink-0 border border-emerald-500/30">
                      {item.count} {item.count === 1 ? 'colega' : 'colegas'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 p-6 text-center">
                  Las estadísticas de apoyos se calcularán cuando haya publicaciones.
                </p>
              )}
            </div>
          </div>

          {onNavigateToReports && (
            <button
              type="button"
              onClick={onNavigateToReports}
              className="w-full pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center justify-center gap-1.5 transition-colors group"
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
