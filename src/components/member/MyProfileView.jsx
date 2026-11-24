import React from 'react';
import {
  User,
  Building2,
  Briefcase,
  Phone,
  MessageSquare,
  ShieldCheck,
  Edit3,
  Sparkles,
  Share2,
  ExternalLink,
  Plus,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { formatTitleCase } from '../../utils/genderHelper';

export default function MyProfileView({
  user,
  miFicha,
  onOpenPublishModal
}) {
  const isPracticante = miFicha?.condicion === 'practicante';

  const fortalezasList = Array.isArray(miFicha?.fortalezas)
    ? miFicha.fortalezas
    : (miFicha?.apoyo ? miFicha.apoyo.split(' · ') : []);

  const handleCopyWhatsAppLink = () => {
    if (!miFicha?.telefono) return;
    const cleanDigits = miFicha.telefono.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanDigits}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      icon: 'success',
      title: '¡Enlace Copiado!',
      text: 'Tu enlace directo de WhatsApp ha sido copiado al portapapeles.',
      confirmButtonColor: '#0A1128',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Informativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center font-black shadow-lg shadow-[#0A1128]/20 shrink-0 border border-white/10">
            <User size={26} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight flex items-center gap-2">
              Mi Ficha Profesional
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Gestiona tu presencia oficial en la Red Nacional de Trabajo Social (SISNETS)
            </p>
          </div>
        </div>

        {miFicha ? (
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#1E2B58] via-[#141E3E] to-[#0A1128] hover:from-[#25366D] hover:to-[#0D1533] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#0A1128]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Edit3 size={15} className="text-amber-400" />
            Editar Mi Ficha
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} />
            Publicar Mi Ficha Ahora
          </button>
        )}
      </div>

      {/* Si tiene ficha publicada: Tarjeta de Presentación Oficial */}
      {miFicha ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden relative"
        >
          {/* Banda Superior con Acento Azul Institucional */}
          <div className="h-3 bg-gradient-to-r from-[#1E2B58] via-[#16224D] to-[#0A1128]" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Cabecera con Foto, Nombre y Sello */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center font-bold text-xl shadow-md border border-white/10 shrink-0">
                  {user?.avatar && user.avatar !== '/logo.png' ? (
                    <img src={user.avatar} alt={miFicha.nombre} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <User size={30} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white uppercase">
                      {formatTitleCase(miFicha.nombre)}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs shadow-blue-500/25">
                      {isPracticante ? 'Practicante' : 'Egresada'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-1 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                    <span>Colegiada Verificada en SISNETS</span>
                  </p>
                </div>
              </div>

              {/* Botón compartir WhatsApp */}
              <button
                type="button"
                onClick={handleCopyWhatsAppLink}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition shrink-0 self-start sm:self-auto"
                title="Copiar link directo de contacto"
              >
                <Share2 size={14} />
                <span>Copiar Enlace Directo</span>
              </button>
            </div>

            {/* Grilla con Datos Clave de Articulación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
                  <Building2 size={13} className="text-[#1E2B58] dark:text-blue-400" />
                  {isPracticante ? 'Centro de Prácticas' : 'Centro Laboral'}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
                  {miFicha.institucion}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
                  <Briefcase size={13} className="text-cyan-600" />
                  Cargo Desempeñado
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
                  {miFicha.cargo || (isPracticante ? 'Practicante Pre-Profesional' : 'Trabajadora Social')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1">
                  <Phone size={13} className="text-emerald-500" />
                  WhatsApp de Contacto
                </span>
                <a
                  href={`https://wa.me/${miFicha.telefono.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {miFicha.telefono}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Temáticas de Apoyo y Fortalezas para otras colegas */}
            <div>
              <span className="text-xs font-black text-[#0A1128] dark:text-slate-200 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <HeartHandshake size={15} className="text-cyan-600" />
                En qué puedo brindar orientación o apoyo a otras colegas:
              </span>
              <div className="flex flex-wrap gap-2">
                {fortalezasList.map((f, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/60 shadow-xs"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Banner de Garantía */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>
                Tu ficha está activa y visible en el Directorio Nacional para más de 500 colegas que utilizan la red día a día.
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Si NO tiene ficha publicada aún */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-inner">
            <Sparkles size={32} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
            Aún no has registrado tu centro laboral
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Publica tu institución actual y en qué áreas puedes brindar orientación. Colegas de todo el país podrán conectarse contigo para resolver casos sociales y generar alianzas.
          </p>
          <button
            type="button"
            onClick={onOpenPublishModal}
            className="px-6 py-3.5 rounded-2xl bg-[#0A1128] hover:bg-[#16224D] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#0A1128]/20 transition-all inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Publicar Mi Ficha en 1 Minuto
          </button>
        </div>
      )}
    </div>
  );
}
