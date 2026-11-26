import React from 'react';
import {
  Users,
  FileText,
  GraduationCap,
  Building2,
  Award,
  Download,
  Plus,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  ExternalLink,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTitleCase } from '../../utils/genderHelper';

export default function DashboardView({
  metricsData,
  registeredUsers = [],
  mentorCards = [],
  handleExportCSV,
  handleExportUsersCSV,
  onOpenCreateUser,
  onOpenPublishModal,
  onNavigateToUsers,
  onNavigateToDirectory
}) {
  if (!metricsData) return null;

  // Colegas más recientes para el feed de actividad
  const recentUsers = registeredUsers.slice(0, 5);
  const recentCards = mentorCards.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. BANNER EJECUTIVO ESTILO SISGEIN */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#0A1128] to-[#141E3E] text-white p-6 sm:p-8 border border-cyan-500/30 shadow-xl shadow-[#0A1128]/20">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Panel de Control en Tiempo Real · SISNETS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Resumen Estratégico de la Red
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Supervisión general de miembros activas, vinculación en centros laborales y cobertura institucional de Trabajo Social en todo el país.
            </p>
          </div>

          {/* Acciones Rápidas en el Banner */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            {onOpenCreateUser && (
              <button
                type="button"
                onClick={onOpenCreateUser}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#050B18] font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus size={16} className="stroke-[2.5]" />
                <span>Registrar Colegiada</span>
              </button>
            )}
            {onOpenPublishModal && (
              <button
                type="button"
                onClick={onOpenPublishModal}
                className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <FileText size={16} />
                <span>Publicar Ficha</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. KPIS SUPERIORES ESTRATÉGICOS (4 TARJETAS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* KPI 1: Total Colegiadas */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Colegiadas en la Red
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white tracking-tight">
            {metricsData.totalUsers}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
            <ShieldCheck size={14} />
            <span>{metricsData.verificadasCount} con Sello Oficial ({metricsData.verificadasPct}%)</span>
          </div>
        </motion.div>

        {/* KPI 2: Fichas de Directorio */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fichas Publicadas
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white tracking-tight">
            {metricsData.totalCards}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <PhoneCall size={14} />
            <span>100% con WhatsApp Directo</span>
          </div>
        </motion.div>

        {/* KPI 3: Egresadas vs Practicantes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Egresadas / Practicantes
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white tracking-tight">
            {metricsData.egresadasCount} <span className="text-sm font-semibold text-slate-400">/</span> {metricsData.practicantesCount}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex mt-2.5">
            <div
              className="bg-cyan-500 h-full transition-all duration-500"
              style={{ width: `${metricsData.totalCards > 0 ? (metricsData.egresadasCount / metricsData.totalCards) * 100 : 50}%` }}
              title="Egresadas"
            />
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${metricsData.totalCards > 0 ? (metricsData.practicantesCount / metricsData.totalCards) * 100 : 50}%` }}
              title="Practicantes"
            />
          </div>
        </motion.div>

        {/* KPI 4: Sectores Institucionales */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sectores Activos
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white tracking-tight">
            {metricsData.sectorStats?.length || 6} Sectores
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400">
            <TrendingUp size={14} />
            <span>Salud, Justicia, DEMUNA, etc.</span>
          </div>
        </motion.div>
      </div>

      {/* 3. GRÁFICOS Y DISTRIBUCIÓN ESTRATÉGICA (2 COLUMNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Columna A: Distribución por Sector Institucional */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span>Distribución por Sector</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                  En Vivo
                </span>
              </h3>
              <Building2 size={18} className="text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Centros laborales y de prácticas vinculados en la red nacional.
            </p>

            <div className="space-y-3.5 pt-4">
              {metricsData.sectorStats.map((sec) => (
                <div key={sec.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{sec.name}</span>
                    <span className="text-[#0A1128] dark:text-white font-black">
                      {sec.count} colegas ({sec.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${sec.barColor} transition-all duration-500`}
                      style={{ width: `${Math.max(sec.pct, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {onNavigateToDirectory && (
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="w-full pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center justify-center gap-1.5 transition-colors group"
            >
              <span>Ver todas las fichas en el Directorio</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Columna B: Top Áreas de Apoyo y Fortalezas */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight flex items-center gap-2">
                <span>Top Fortalezas de Apoyo</span>
                <Award size={18} className="text-amber-500" />
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Especialidades y materias donde las colegas brindan orientación fraterna.
            </p>

            <div className="space-y-2.5 pt-4">
              {metricsData.topFortalezas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/20">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black shrink-0 border border-emerald-500/30">
                    {item.count} {item.count === 1 ? 'colega' : 'colegas'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {onNavigateToUsers && (
            <button
              type="button"
              onClick={onNavigateToUsers}
              className="w-full pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center justify-center gap-1.5 transition-colors group"
            >
              <span>Gestionar miembros en el Módulo de Usuarios</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* 4. FEED DE ACTIVIDAD RECIENTE (TABLA RESUMEN) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-cyan-500" />
              <span>Colegiadas Incorporadas Recientemente</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Últimas profesionales validadas en el ecosistema SISNETS.
            </p>
          </div>
          {onNavigateToUsers && (
            <button
              type="button"
              onClick={onNavigateToUsers}
              className="text-xs font-black text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Ver padrón completo</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Colegiada</th>
                  <th className="py-3 px-3">Condición</th>
                  <th className="py-3 px-3">Centro Institucional</th>
                  <th className="py-3 px-3">Rol</th>
                  <th className="py-3 px-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {recentUsers.map((u) => {
                  const isAdmin = u.rol === 'admin';
                  return (
                    <tr key={u.id || u.correo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                            isAdmin
                              ? 'bg-amber-500/15 text-amber-600 border border-amber-400/30'
                              : 'bg-cyan-500/15 text-cyan-600 border border-cyan-400/30'
                          }`}>
                            {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[200px]">
                              {formatTitleCase(u.nombre)}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                              {u.correo}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          u.condicion === 'practicante'
                            ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        }`}>
                          {u.condicion === 'practicante' ? 'Practicante' : 'Egresada'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                        {u.centro || 'SISNETS (Comunidad)'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          isAdmin
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {isAdmin ? 'Admin' : 'Colegiada'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        {u.fechaRegistro || 'Reciente'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">No hay registros recientes.</p>
        )}
      </div>

      {/* 5. CENTRO DE REPORTES Y DESCARGAS OFICIALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exportar Directorio */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0A1128] text-white border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
              Reporte Oficial
            </span>
            <h4 className="text-sm font-black text-white">
              Exportar Directorio Consolidado
            </h4>
            <p className="text-[11px] text-slate-400">
              Descarga en Excel / CSV con WhatsApp directo, centros y temáticas.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#050B18] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 active:scale-95 shadow-md shadow-cyan-500/20"
          >
            <Download size={14} />
            <span>Excel / CSV</span>
          </button>
        </div>

        {/* Exportar Padrón de Usuarias */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0A1128] text-white border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Padrón Institucional
            </span>
            <h4 className="text-sm font-black text-white">
              Exportar Padrón de Miembros
            </h4>
            <p className="text-[11px] text-slate-400">
              Lista completa de miembros registrados, roles y fechas de ingreso.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportUsersCSV}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-[#050B18] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 active:scale-95 shadow-md shadow-emerald-500/20"
          >
            <Download size={14} />
            <span>Excel / CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
