import React from 'react';
import {
  Users,
  FileText,
  GraduationCap,
  Building2,
  Award,
  Download,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsView({
  metricsData,
  handleExportCSV,
  handleExportUsersCSV
}) {
  if (!metricsData) return null;

  return (
    <div className="space-y-6">
      {/* HEADER DEL APARTADO DE REPORTES */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#0A1128] to-[#141E3E] text-white p-6 sm:p-7 border border-cyan-500/30 shadow-lg shadow-[#0A1128]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
            <BarChart3 size={13} className="text-cyan-400" />
            Apartado Oficial de Reportes · SISNETS
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Analítica y Descargas Institucionales
          </h2>
          <p className="text-xs text-slate-300 font-medium max-w-xl">
            Estadísticas consolidadas, distribución sectorial de centros laborales y exportación oficial de datos para la directiva.
          </p>
        </div>

        {/* Botones de Exportación Rápida */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#050B18] font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            title="Exportar Directorio de Colegas"
          >
            <Download size={14} />
            <span>Directorio (CSV)</span>
          </button>
          <button
            type="button"
            onClick={handleExportUsersCSV}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-[#050B18] font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            title="Exportar Padrón de Miembros"
          >
            <Download size={14} />
            <span>Padrón (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 KPIS ANALÍTICOS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Colegiadas en la Red
            </span>
            <Users size={16} className="text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white">
            {metricsData.totalUsers}
          </div>
          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block mt-1">
            {metricsData.verificadasCount} con Sello Oficial ({metricsData.verificadasPct}%)
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fichas Publicadas
            </span>
            <FileText size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white">
            {metricsData.totalCards}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
            100% con WhatsApp Directo
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Egresadas vs Practicantes
            </span>
            <GraduationCap size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white">
            {metricsData.egresadasCount} / {metricsData.practicantesCount}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex mt-2">
            <div
              className="bg-cyan-500 h-full"
              style={{ width: `${metricsData.totalCards > 0 ? (metricsData.egresadasCount / metricsData.totalCards) * 100 : 50}%` }}
              title="Egresadas"
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${metricsData.totalCards > 0 ? (metricsData.practicantesCount / metricsData.totalCards) * 100 : 50}%` }}
              title="Practicantes"
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sectores Activos
            </span>
            <Building2 size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white">
            {metricsData.sectorStats?.length || 6} Sectores
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-1">
            Salud, Justicia, DEMUNA, etc.
          </span>
        </div>
      </div>

      {/* DISTRIBUCIÓN POR SECTOR INSTITUCIONAL */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
              Distribución por Sector Institucional
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Centros laborales y de prácticas vinculados en la red nacional
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-wider">
            Consolidado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {metricsData.sectorStats.map((sec) => (
            <div key={sec.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200 font-black">{sec.name}</span>
                <span className="text-slate-900 dark:text-white font-black text-sm">
                  {sec.count} <span className="text-xs font-normal text-slate-400">({sec.pct}%)</span>
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${sec.barColor} transition-all duration-500`}
                  style={{ width: `${Math.max(sec.pct, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTRO DE DESCARGAS OFICIALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B132B] to-[#141E3E] text-white border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
              Reporte Oficial
            </span>
            <h4 className="text-sm font-black text-white">
              Directorio Consolidado Completo
            </h4>
            <p className="text-[11px] text-slate-400">
              Descarga en Excel / CSV con WhatsApp directo, centros, cargos y apoyos.
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

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B132B] to-[#141E3E] text-white border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Padrón Institucional
            </span>
            <h4 className="text-sm font-black text-white">
              Padrón Oficial de Colegiadas
            </h4>
            <p className="text-[11px] text-slate-400">
              Lista completa de miembros registrados, roles, condiciones y fechas.
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
