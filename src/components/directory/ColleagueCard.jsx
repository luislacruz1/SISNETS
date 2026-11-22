import React from 'react';
import {
  GraduationCap,
  Building2,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageSquare,
  MoreVertical,
  Edit3,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { isMasculineName } from '../../utils/genderHelper';

export default function ColleagueCard({
  card,
  user,
  openMenuCardId,
  setOpenMenuCardId,
  handleEditCard,
  handleDeleteCard,
  handleContactClick
}) {
  const isPracticante = card.condicion === 'practicante' || card.tipo?.toLowerCase().includes('practicante');
  const Icon = isPracticante ? GraduationCap : Building2;
  const fortalezasList = Array.isArray(card.fortalezas) && card.fortalezas.length > 0
    ? card.fortalezas
    : (card.apoyo ? card.apoyo.split(' · ') : []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ 
        duration: 0.24, 
        ease: [0.25, 0.1, 0.25, 1],
        layout: { duration: 0.28, ease: 'easeOut' }
      }}
      whileHover={{ 
        y: -6, 
        transition: { type: 'spring', stiffness: 380, damping: 25 } 
      }}
      className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-400/80 dark:hover:border-cyan-500/80 shadow-md hover:shadow-2xl hover:shadow-cyan-500/10 transition-colors flex flex-col h-full group"
    >
      {/* Barra superior de acento dinámico interactivo con esquinas redondeadas */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isPracticante 
          ? 'from-violet-500 via-indigo-500 to-cyan-400' 
          : 'from-fuchsia-500 via-pink-500 to-rose-400'
      }`} />

      {/* 1. Encabezado: Avatar con micro-animación, Nombre, Condición y Menú de Opciones */}
      <div className="flex items-start justify-between gap-2.5 sm:gap-3 min-h-[50px] sm:min-h-[56px] mb-3 sm:mb-4 relative">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold border-2 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shrink-0 shadow-lg ${
            isPracticante
              ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-violet-500/35 border-violet-300/50 group-hover:shadow-violet-500/60'
              : 'bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-fuchsia-500/35 border-fuchsia-300/50 group-hover:shadow-fuchsia-500/60'
          }`}>
            <Icon size={19} className="sm:w-[22px] sm:h-[22px] transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm sm:text-base text-[#0A1128] dark:text-white uppercase leading-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {card.nombre}
            </h4>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
              {isPracticante ? (
                <>
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-md bg-violet-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm shadow-violet-500/25">
                    Practicante
                  </span>
                  {card.cicloEstudio && (
                    <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-950 dark:bg-violet-950/70 dark:text-violet-300 border border-violet-300 dark:border-violet-700 text-[9px] sm:text-[10px] font-black">
                      {card.cicloEstudio}
                    </span>
                  )}
                </>
              ) : (
                <span className="px-2 sm:px-2.5 py-0.5 rounded-md bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm shadow-fuchsia-500/25">
                  {card.tipo === 'Egresado' || isMasculineName(card.nombre) ? 'Egresado' : 'Egresada'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menú de 3 Puntos Discreto para Administradora */}
        {user?.rol === 'admin' && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setOpenMenuCardId(openMenuCardId === card.id ? null : card.id)}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition active:scale-90"
              title="Opciones de ficha"
            >
              <MoreVertical size={16} />
            </button>

            {openMenuCardId === card.id && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setOpenMenuCardId(null)}
                />
                <div className="absolute right-0 top-9 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuCardId(null);
                      handleEditCard(card);
                    }}
                    className="w-full px-3 py-2 text-left font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                  >
                    <Edit3 size={13} className="text-amber-500" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuCardId(null);
                      handleDeleteCard(card);
                    }}
                    className="w-full px-3 py-2 text-left font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition"
                  >
                    <Trash2 size={13} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 2. Centro Laboral y Cargo Actual */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 mb-3 sm:mb-4 border border-slate-200/70 dark:border-slate-700/70 shadow-2xs space-y-2.5">
        {/* Institución */}
        <div className="flex items-start gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
            isPracticante
              ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border-violet-200/60 dark:border-violet-800/40'
              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40'
          }`}>
            {isPracticante ? <GraduationCap size={15} /> : <Building2 size={15} />}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[9.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 leading-none">
              {isPracticante ? 'Centro de Prácticas' : 'Centro Laboral Actual'}
            </span>
            <p className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-snug line-clamp-2 mt-1">
              {card.institucion}
            </p>
          </div>
        </div>

        {/* Cargo si existe */}
        {card.cargo && (
          <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-200/60 dark:border-cyan-800/40 shadow-2xs">
              <Briefcase size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[9.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 leading-none">
                Cargo que Ocupa
              </span>
              <p className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-snug truncate mt-1">
                {card.cargo}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Fortalezas estructuradas con microinteracciones dinámicas */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent border-l-4 border-l-cyan-500 border border-cyan-400/30 text-cyan-900 dark:text-cyan-300 font-black text-[10px] sm:text-[11px] uppercase tracking-wider mb-2 sm:mb-2.5 shadow-sm">
          <Sparkles size={13} className="text-cyan-500 shrink-0 animate-pulse" />
          <span>En qué te puede orientar y apoyar:</span>
        </div>
        <div className="h-[125px] sm:h-[156px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
          {fortalezasList.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-[10.5px] sm:text-[11px] font-bold bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 p-2 sm:p-2.5 rounded-xl border border-cyan-500/30 shadow-2xs leading-snug hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-slate-800 hover:translate-x-1.5 transition-all duration-200 cursor-default"
            >
              <CheckCircle2 size={14} className="text-cyan-500 shrink-0 mt-0.5 group-hover:text-cyan-400 transition-colors" />
              <span className="line-clamp-2">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bloque Inferior Pinned al Fondo: Tarjeta WhatsApp Directo con Efectos Reactivos */}
      <div className="mt-auto space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleContactClick(card)}
          className="w-full p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 hover:from-emerald-500/25 hover:to-teal-500/20 border-2 border-emerald-500/70 hover:border-emerald-500 dark:border-emerald-400/80 dark:hover:border-emerald-400 flex items-center justify-between gap-2 shadow-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-left cursor-pointer group/wa relative overflow-hidden"
          title={`Abrir WhatsApp directo con ${card.nombre}`}
        >
          <div className="flex items-center gap-2.5 min-w-0 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/40 shrink-0 group-hover/wa:scale-110 group-hover/wa:rotate-6 transition-all duration-300">
              <Phone size={14} className="fill-white" />
            </div>
            <div className="min-w-0">
              <span className="block text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 leading-none">
                WhatsApp Directo
              </span>
              <strong className="text-xs sm:text-[13px] font-black text-emerald-950 dark:text-white tracking-wide mt-0.5 block truncate">
                {card.telefono}
              </strong>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500 group-hover/wa:bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm shrink-0 flex items-center gap-1 transition-all group-hover/wa:scale-105 relative z-10">
            <span>Directo</span>
            <MessageSquare size={11} className="transition-transform group-hover/wa:translate-x-0.5" />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
