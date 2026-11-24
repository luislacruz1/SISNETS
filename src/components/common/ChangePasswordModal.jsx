import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { hashPassword, verifyPassword, evaluatePasswordStrength } from '../../utils/security';
import { updateRemoteUser } from '../../lib/dataSyncService';

/**
 * MODAL DE CAMBIO SEGURO DE CONTRASEÑA
 * Inspirado en ChangePasswordModal.jsx de SIMEC (Mantenimiento de Equipos)
 * Encripta con SHA-256 antes de persistir en Supabase / LocalStorage
 */
export default function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passStrength, setPassStrength] = useState({ score: 0, percent: 0, label: '', color: '' });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        passwordActual: '',
        passwordNuevo: '',
        confirmarPassword: ''
      });
      setError(null);
      setSuccess(false);
      setShowNewPassword(false);
      setPassStrength({ score: 0, percent: 0, label: '', color: '' });
    }
  }, [isOpen]);

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, passwordNuevo: val });
    setPassStrength(evaluatePasswordStrength(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.passwordNuevo !== formData.confirmarPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (formData.passwordNuevo.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      // Si el usuario ya tenía contraseña previa, validar la actual
      if (user?.password) {
        const isCurrentValid = await verifyPassword(formData.passwordActual, user.password);
        if (!isCurrentValid) {
          setError('La contraseña actual ingresada es incorrecta.');
          setLoading(false);
          return;
        }
      }

      // Generar Hash criptográfico SHA-256
      const hashedPass = await hashPassword(formData.passwordNuevo);

      // Actualizar en base de datos en la nube (Supabase)
      if (user?.id) {
        await updateRemoteUser(user.id, {
          password: hashedPass,
          debeCambiarPassword: false
        });
      }

      // Actualizar sesión local y AuthContext
      updateUser({
        password: hashedPass,
        debeCambiarPassword: false
      });

      // Actualizar en lista local si existe
      try {
        const storedUsers = JSON.parse(localStorage.getItem('usuarios_colegio') || '[]');
        const updatedUsers = storedUsers.map((u) =>
          u.id === user.id ? { ...u, password: hashedPass, debeCambiarPassword: false } : u
        );
        localStorage.setItem('usuarios_colegio', JSON.stringify(updatedUsers));
      } catch (err) {
        console.error('Error actualizando usuarios_colegio:', err);
      }

      setSuccess(true);
      if (typeof onSuccess === 'function') onSuccess();

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' });
      }, 1800);
    } catch (err) {
      setError(err?.message || 'Error al cambiar la contraseña. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A1128]/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-[210] overflow-hidden border border-slate-100 dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center shadow-sm">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    Cambiar Contraseña
                  </h2>
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold tracking-wider uppercase">
                    Seguridad Criptográfica SHA-256
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success ? (
                <div className="py-8 flex flex-col items-center text-center gap-3 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    ¡Contraseña Actualizada!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tu contraseña ha sido cifrada y actualizada con éxito en la nube.
                  </p>
                </div>
              ) : (
                <>
                  {/* Contraseña Actual */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Contraseña Actual
                    </label>
                    <input
                      required
                      type="password"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm text-slate-800 dark:text-slate-200 transition-all"
                      placeholder="Ingresa tu contraseña actual"
                      value={formData.passwordActual}
                      onChange={(e) => setFormData({ ...formData, passwordActual: e.target.value })}
                    />
                  </div>

                  {/* Nueva Contraseña */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm text-slate-800 dark:text-slate-200 transition-all"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.passwordNuevo}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-300 focus:outline-none"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Medidor de Fuerza */}
                    {formData.passwordNuevo && (
                      <div className="pt-2 space-y-1">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passStrength.color} transition-all duration-300`}
                            style={{ width: `${passStrength.percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Seguridad:</span>
                          <span>{passStrength.label}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirmar Nueva Contraseña */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      required
                      type={showNewPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm text-slate-800 dark:text-slate-200 transition-all"
                      placeholder="Repite la nueva contraseña"
                      value={formData.confirmarPassword}
                      onChange={(e) => setFormData({ ...formData, confirmarPassword: e.target.value })}
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#0A1128] hover:bg-[#16224D] dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-[#0A1128]/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 text-xs uppercase tracking-wider"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Actualizar y Cifrar Contraseña</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
