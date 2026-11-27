import React, { useState } from 'react';
import {
  User,
  Building2,
  Briefcase,
  Phone,
  MessageSquare,
  MoreVertical,
  Edit3,
  Trash2,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { isMasculineName, formatTitleCase } from '../../utils/genderHelper';

// Limpia el texto para que use mayúsculas/minúsculas naturales y sin "PUEDO"
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

export default function ColleagueCard({
  card,
  user,
  registeredUsers = [],
  openMenuCardId,
  setOpenMenuCardId,
  handleEditCard,
  handleDeleteCard,
  handleContactClick
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const isPracticante = card.condicion === 'practicante' || card.tipo?.toLowerCase().includes('practicante');

  // Buscar avatar del autor en registeredUsers o en el usuario activo si la ficha no tiene foto directa
  const authorUser = (registeredUsers || []).find((u) => {
    const cardEmail = (card.correo || '').toLowerCase().trim();
    const uEmail = (u.correo || '').toLowerCase().trim();
    if (cardEmail && uEmail && cardEmail === uEmail) return true;
    if ((card.user_id && card.user_id === u.id) || (card.usuario_id && card.usuario_id === u.id)) return true;
    const cardName = (card.nombre || '').toLowerCase().replace(/^(lic\.|licenciado|licenciada)\s*/i, '').trim();
    const uName = (u.nombre || '').toLowerCase().replace(/^(lic\.|licenciado|licenciada)\s*/i, '').trim();
    return cardName && uName && (cardName === uName || cardName.includes(uName) || uName.includes(cardName));
  });

  const effectiveAvatar = (card.avatar && card.avatar !== '/logo.png' && card.avatar !== '/logo.svg')
    ? card.avatar
    : (authorUser?.avatar && authorUser.avatar !== '/logo.png' && authorUser.avatar !== '/logo.svg'
        ? authorUser.avatar
        : (user && (
            (card.correo && user.correo?.toLowerCase() === card.correo?.toLowerCase()) ||
            (card.user_id && user.id === card.user_id) ||
            (card.nombre && user.nombre?.toLowerCase() === card.nombre?.toLowerCase())
          ) ? user.avatar : null));

  const hasPhoto = Boolean(effectiveAvatar && effectiveAvatar !== '/logo.png' && effectiveAvatar !== '/logo.svg');

  const rawFortalezas = Array.isArray(card.fortalezas) && card.fortalezas.length > 0
    ? card.fortalezas
    : (card.apoyo ? card.apoyo.split(' · ') : []);

  const fortalezasList = rawFortalezas.map(formatFortalezaText).filter(Boolean);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className="relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#1E2B58]/40 dark:hover:border-slate-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
    >
      {/* Línea superior con gradiente igual al color del sidebar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#1E2B58] via-[#16224D] to-[#0A1128] dark:from-slate-600 dark:to-slate-700"
      />

      <div>
        {/* 1. CABECERA: Avatar (Persona/Foto), Nombre con Badge al lado en el mismo renglón, y Menú Admin */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Avatar: Foto de perfil o silueta de Persona con color del Sidebar */}
            {hasPhoto && !imgFailed ? (
              <img
                src={effectiveAvatar}
                alt={card.nombre}
                onError={() => setImgFailed(true)}
                className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-md transition-all"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105 bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white shadow-[#0A1128]/20 ring-1 ring-white/15"
              >
                <User size={22} className="stroke-[2.2]" />
              </div>
            )}

            {/* Nombre y Badge de Condición debajo del nombre */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base text-[#0A1128] dark:text-white leading-snug break-words transition-colors">
                <span className="font-black group-hover:text-[#1E2B58] dark:group-hover:text-cyan-400">
                  {formatTitleCase(card.nombre)}
                </span>
              </h4>
              {/* Badges debajo del nombre: Condición + Ciclo */}
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider align-middle whitespace-nowrap shadow-xs bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/25"
                >
                  {isPracticante ? 'Practicante' : 'Colega'}
                </span>
                {isPracticante && card.cicloEstudio && (
                  <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold align-middle whitespace-nowrap bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {card.cicloEstudio}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Acciones de cabecera: Menú de Opciones */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Menú de Opciones para Administradora o Propietario(a) de la Ficha */}
            {(user?.rol === 'admin' || (user && (
              (card.correo && user.correo && card.correo.toLowerCase() === user.correo.toLowerCase()) ||
              (card.user_id && card.user_id === user.id) ||
              (card.usuario_id && card.usuario_id === user.id) ||
              (card.creadoPor && card.creadoPor === user.id) ||
              (card.nombre && user.nombre && card.nombre.toLowerCase().replace(/^(lic\.|licenciado|licenciada)\s*/i, '').trim() === user.nombre.toLowerCase().replace(/^(lic\.|licenciado|licenciada)\s*/i, '').trim())
            ))) && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenuCardId(openMenuCardId === card.id ? null : card.id)}
                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
                  title="Opciones"
                >
                  <MoreVertical size={16} />
                </button>

                {openMenuCardId === card.id && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setOpenMenuCardId(null)}
                    />
                    <div className="absolute right-0 top-9 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-xs">
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
        </div>

        {/* 2. DATOS LABORALES (Líneas limpias e íconos con color definido del Sidebar) */}
        <div className="py-2.5 border-y border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs mb-3.5">
          {/* Centro Laboral */}
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <div className="w-5 h-5 rounded-lg bg-[#1E2B58]/10 dark:bg-slate-800 text-[#1E2B58] dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Building2 size={13} />
            </div>
            <span className="font-bold truncate">{card.institucion}</span>
          </div>

          {/* Cargo que ocupa */}
          {card.cargo && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-[11.5px]">
              <div className="w-5 h-5 rounded-lg bg-[#1E2B58]/10 dark:bg-slate-800 text-[#1E2B58] dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Briefcase size={13} />
              </div>
              <span className="font-semibold truncate">{card.cargo}</span>
            </div>
          )}
        </div>

        {/* 3. ÁREAS DE ORIENTACIÓN (Minimalista con viñetas sutiles) */}
        <div className="mb-4">
          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Orientación y Apoyo:
          </span>
          <div className="space-y-1.5">
            {fortalezasList.slice(0, 3).map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BOTÓN WHATSAPP DIRECTO (Diseño exacto de la captura) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleContactClick(card)}
          className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#E6F9F3] dark:bg-emerald-950/40 border-2 border-[#10B981] hover:bg-[#D8F5EC] dark:hover:bg-emerald-950/60 flex items-center justify-between gap-2 transition-all shadow-xs group/btn cursor-pointer"
          title={`Abrir WhatsApp directo con ${card.nombre}`}
        >
          {/* Lado izquierdo: Ícono squircle verde esmeralda y textos */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#00C48C] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Phone size={15} className="fill-white text-white" />
            </div>
            <div className="text-left min-w-0">
              <span className="block text-[9px] font-black uppercase tracking-wider text-[#0F766E] dark:text-emerald-400 leading-none">
                WhatsApp Directo
              </span>
              <span className="text-[13px] font-black text-[#064E3B] dark:text-white tracking-tight leading-snug mt-0.5 block truncate">
                {card.telefono}
              </span>
            </div>
          </div>

          {/* Lado derecho: Pastilla verde redondeada DIRECTO */}
          <span className="px-3 py-1 rounded-full bg-[#00C48C] hover:bg-[#00B07D] text-white text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
            Directo
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
