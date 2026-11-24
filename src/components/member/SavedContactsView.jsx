import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  Building2,
  Phone,
  MessageSquare,
  Trash2,
  ExternalLink,
  BookUser,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTitleCase, isMasculineName } from '../../utils/genderHelper';

export default function SavedContactsView({
  mentorCards = [],
  favoriteIds = [],
  onToggleFavorite,
  onNavigateToDirectorio
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('Todos');

  // Filtrar solo las tarjetas que están guardadas como favoritas
  const savedCards = useMemo(() => {
    const favSet = new Set(favoriteIds.map(String));
    return mentorCards.filter((c) => favSet.has(String(c.id)));
  }, [mentorCards, favoriteIds]);

  // Lista de sectores detectados en las favoritas
  const sectorsList = useMemo(() => {
    const set = new Set();
    savedCards.forEach((c) => {
      if (c.sector && c.sector.trim()) set.add(c.sector.trim());
    });
    return ['Todos', ...Array.from(set)];
  }, [savedCards]);

  // Filtrado final por término y sector
  const filteredSavedCards = useMemo(() => {
    return savedCards.filter((c) => {
      const matchSector = selectedSector === 'Todos' || c.sector === selectedSector;
      const term = searchTerm.trim().toLowerCase();
      const matchSearch = !term ||
        (c.nombre && c.nombre.toLowerCase().includes(term)) ||
        (c.institucion && c.institucion.toLowerCase().includes(term)) ||
        (c.cargo && c.cargo.toLowerCase().includes(term)) ||
        (c.apoyo && c.apoyo.toLowerCase().includes(term));
      return matchSector && matchSearch;
    });
  }, [savedCards, selectedSector, searchTerm]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Cabecera Informativa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/10">
            <Star size={26} className="fill-amber-400 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight flex items-center gap-2">
              Mis Contactos Clave
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                {savedCards.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Tus colegas favoritas organizadas para derivación y coordinación rápida de casos sociales
            </p>
          </div>
        </div>

        {savedCards.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en mis guardadas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        )}
      </div>

      {/* Si hay guardadas: Pestañas de Sectores */}
      {savedCards.length > 0 && sectorsList.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {sectorsList.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSector(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      {/* Grilla de Colegas Guardadas */}
      {savedCards.length > 0 ? (
        filteredSavedCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredSavedCards.map((card) => {
                const isPracticante = card.condicion === 'practicante';
                const cleanDigits = card.telefono.replace(/[^0-9]/g, '');

                return (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative group"
                  >
                    <div>
                      {/* Cabecera con Estrella para desmarcar */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base font-black text-[#0A1128] dark:text-white leading-snug break-words">
                            {formatTitleCase(card.nombre)}
                          </h4>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs shadow-blue-500/25">
                            {isPracticante ? 'Practicante' : 'Egresada'}
                          </span>
                        </div>

                        {/* Botón Quitar de Favoritas */}
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(card.id)}
                          className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-all shrink-0"
                          title="Quitar de mis contactos clave"
                        >
                          <Star size={16} className="fill-amber-400 group-hover:fill-rose-500 transition-colors" />
                        </button>
                      </div>

                      {/* Institución y Cargo */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
                        <p className="flex items-center gap-1.5 font-bold">
                          <Building2 size={13} className="text-[#1E2B58] dark:text-blue-400 shrink-0" />
                          <span className="truncate">{card.institucion}</span>
                        </p>
                        {card.cargo && (
                          <p className="text-[11px] text-slate-400 truncate pl-4">
                            {card.cargo}
                          </p>
                        )}
                        {card.apoyo && (
                          <p className="text-[11px] text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/30 p-2 rounded-xl mt-2 line-clamp-2">
                            💡 {card.apoyo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botón WhatsApp Directo */}
                    <a
                      href={`https://wa.me/${cleanDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98"
                    >
                      <MessageSquare size={14} className="fill-white" />
                      <span>Coordinar por WhatsApp</span>
                    </a>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold">No se encontraron colegas guardadas con este filtro.</p>
          </div>
        )
      ) : (
        /* Estado vacío cuando no tiene ninguna guardada */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shadow-inner">
            <Star size={32} className="fill-amber-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
            Aún no has guardado colegas clave
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Cuando revises el Directorio Nacional, haz clic en el icono de <strong>Estrella (⭐)</strong> en cualquier ficha para guardarla aquí. Tendrás a la mano sus teléfonos y centros para derivación y resolución rápida de casos.
          </p>
          {onNavigateToDirectorio && (
            <button
              type="button"
              onClick={onNavigateToDirectorio}
              className="px-6 py-3.5 rounded-2xl bg-[#0A1128] hover:bg-[#16224D] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#0A1128]/20 transition-all inline-flex items-center gap-2"
            >
              <BookUser size={16} />
              Explorar el Directorio Nacional
            </button>
          )}
        </div>
      )}
    </div>
  );
}
