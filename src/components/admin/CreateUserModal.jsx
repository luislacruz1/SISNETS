import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  RotateCw,
  Copy,
  Check,
  UserPlus,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { formatTitleCase } from '../../utils/genderHelper';

// Generador de clave temporal aleatoria (ej: Sisnets1, Sisnets7, Sisnets42)
const generateTempPassword = () => {
  const randomNum = Math.floor(1 + Math.random() * 99);
  return `Sisnets${randomNum}`;
};

export default function CreateUserModal({ isOpen, onClose, onUserCreated, existingUsers = [] }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: ''
  });

  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Al abrir el modal, generar una clave temporal fresca
  useEffect(() => {
    if (isOpen) {
      setTempPassword(generateTempPassword());
      setCopied(false);
      setFormData({
        nombre: '',
        correo: '',
        telefono: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyPassword = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleRegeneratePassword = () => {
    setTempPassword(generateTempPassword());
    setCopied(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanNombre = formData.nombre.trim();
    const cleanCorreo = formData.correo.trim().toLowerCase();
    const cleanTelefono = formData.telefono.trim();
    const cleanPassword = (tempPassword || generateTempPassword()).trim();

    if (!cleanNombre || !cleanCorreo || !cleanTelefono) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Por favor completa el nombre, correo y teléfono del usuario.',
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    // Validar si el correo ya existe
    const correoExiste = existingUsers.some(
      (u) => u.correo && u.correo.toLowerCase() === cleanCorreo
    );

    if (correoExiste) {
      Swal.fire({
        icon: 'error',
        title: 'Correo ya Registrado',
        text: `El correo "${cleanCorreo}" ya pertenece a un usuario en el sistema.`,
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    setLoading(true);

    const formattedNombre = formatTitleCase(cleanNombre);
    const formattedTel = cleanTelefono.startsWith('+')
      ? cleanTelefono
      : `+51 ${cleanTelefono.replace(/^51\s*/, '')}`;

    const newUser = {
      id: `usr_${Date.now()}`,
      nombre: formattedNombre,
      correo: cleanCorreo,
      telefono: formattedTel,
      password: cleanPassword,
      debeCambiarPassword: true, // Flag de primer acceso con clave temporal
      rol: 'colegiada',
      condicion: 'egresada',
      centro: 'SISNETS (Comunidad)',
      sector: 'Comunitario / Trabajo Social',
      estado: 'activa',
      verificada: true,
      fechaRegistro: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };

    if (onUserCreated) {
      onUserCreated(newUser);
    }

    // Alerta con las credenciales creadas para que el admin las copie y entregue
    Swal.fire({
      icon: 'success',
      title: '¡Usuario Registrado Exitosamente!',
      html: `
        <div style="text-align: left; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin-top: 10px;">
          <p style="font-size: 13px; font-weight: 700; color: #0A1128; margin-bottom: 6px;">
            ${newUser.nombre}
          </p>
          <p style="font-size: 12px; color: #475569; margin: 4px 0;">
            <strong>Correo:</strong> ${newUser.correo}
          </p>
          <p style="font-size: 12px; color: #475569; margin: 4px 0;">
            <strong>Clave Temporal:</strong> <span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 6px; font-weight: 900; font-family: monospace;">${cleanPassword}</span>
          </p>
        </div>
        <p style="font-size: 11px; color: #64748b; margin-top: 12px;">
          Comparte esta clave temporal con la colega. Al ingresar por primera vez, el sistema le solicitará cambiar su contraseña.
        </p>
      `,
      confirmButtonText: 'Entendido y Cerrar',
      confirmButtonColor: '#0A1128',
      customClass: {
        popup: 'rounded-3xl',
        title: 'text-base font-black',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-xs uppercase'
      }
    });

    setFormData({
      nombre: '',
      correo: '',
      telefono: ''
    });

    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Fondo con desenfoque suave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050B18]/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden relative z-10 flex flex-col"
        >
          {/* Barra superior con gradiente corporativo (Sidebar midnight navy) */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1E2B58] via-[#141E3E] to-[#0A1128] shrink-0" />

          {/* Cabecera del Modal */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center shadow-md shadow-[#0A1128]/20 shrink-0">
                <UserPlus size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0A1128] dark:text-white tracking-tight">
                  Registrar Nuevo Usuario
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Crea y habilita una nueva cuenta en SISNETS
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Campo: Nombre Completo */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-[#1E2B58] dark:text-blue-400" />
                <span>Nombre Completo <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Lic. Carmen Delgado Ruiz"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 focus:border-[#1E2B58] dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition"
              />
            </div>

            {/* Fila de 2 columnas: WhatsApp y Correo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp de Contacto */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-500" />
                  <span>WhatsApp <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+51 987 654 321"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} className="text-[#1E2B58] dark:text-blue-400" />
                  <span>Correo Electrónico <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@ejemplo.com"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 focus:border-[#1E2B58] dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Campo Clave Temporal (Generada automáticamente) */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound size={13} className="text-amber-500" />
                  <span>Clave Temporal de Acceso</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">Primer ingreso</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono font-bold text-[#0A1128] dark:text-cyan-400 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition tracking-wider"
                  />
                </div>

                {/* Botón Regenerar Clave */}
                <button
                  type="button"
                  onClick={handleRegeneratePassword}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition flex items-center justify-center shrink-0"
                  title="Generar otra clave aleatoria"
                >
                  <RotateCw size={15} />
                </button>

                {/* Botón Copiar Clave */}
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                  title="Copiar clave al portapapeles"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mensaje informativo */}
              <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[10.5px] font-medium text-amber-800 dark:text-amber-300 leading-snug">
                  La usuaria utilizará esta clave temporal para ingresar y el sistema le solicitará cambiar su contraseña.
                </p>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1E2B58] via-[#141E3E] to-[#0A1128] hover:from-[#25366D] hover:via-[#1A264F] hover:to-[#0D1533] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#0A1128]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={14} />
                Registrar Usuario
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
