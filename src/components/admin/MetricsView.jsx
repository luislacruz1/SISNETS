import React from 'react';
import {
  Users,
  FileText,
  GraduationCap,
  Building2,
  Award,
  Download
} from 'lucide-react';

export default function MetricsView({ metricsData, handleExportCSV }) {
  if (!metricsData) return null;

  return (
    <div className="space-y-5">
      {/* 4 KPIs Superiores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent border-2 border-cyan-500/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Colegiadas en la Red
            </span>
            <Users size={16} className="text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white">
            {metricsData.totalUsers}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mt-1">
            {metricsData.verificadasCount} con Sello Oficial ({metricsData.verificadasPct}%)
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border-2 border-emerald-500/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
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

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-2 border-amber-500/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Egresadas vs Practicantes
            </span>
            <GraduationCap size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white">
            {metricsData.egresadasCount} / {metricsData.practicantesCount}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden flex mt-2">
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

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-transparent border-2 border-purple-500/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Sectores Activos
            </span>
            <Building2 size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0A1128] dark:text-white">
            6 / 6
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-1">
            Salud, Justicia, DEMUNA, etc.
          </span>
        </div>
      </div>

      {/* Distribución por Sectores y Top Fortalezas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sectores Institucionales */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
                Distribución por Sector Institucional
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Centros laborales y de prácticas vinculados en la red
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase">
              En Vivo
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {metricsData.sectorStats.map((sec) => (
              <div key={sec.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{sec.name}</span>
                  <span className="text-slate-900 dark:text-white font-black">
                    {sec.count} colegas ({sec.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sec.barColor} transition-all duration-500`}
                    style={{ width: `${Math.max(sec.pct, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fortalezas / Áreas de Apoyo */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
                Top Áreas de Apoyo & Orientación
              </h3>
              <Award size={18} className="text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">
              Las temáticas más ofrecidas por colegas voluntarias
            </p>

            <div className="space-y-2.5">
              {metricsData.topFortalezas.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-black text-[10px] flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black shrink-0">
                    {item.count} colegas
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de Exportación en Métricas */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-medium">
              ¿Necesitas el directorio consolidado para la directiva?
            </span>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#0A1128] dark:bg-cyan-500 text-white dark:text-[#050B18] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <Download size={13} />
              <span>Descargar CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
