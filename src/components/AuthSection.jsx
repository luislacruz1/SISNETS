import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PeruFlag from './common/PeruFlag';
import { supabase } from '../lib/supabaseClient';

export default function AuthSection({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const { login } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
    correo: '',
    password: '',
    remember: true
  });

  // Cargar correo recordado si existe
  useEffect(() => {
    const remembered = localStorage.getItem('sisnets_remember_correo');
    if (remembered) {
      setFormData((prev) => ({ ...prev, correo: remembered, remember: true }));
    }
  }, []);

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Recuperar Contraseña',
      text: 'Ingresa tu correo electrónico registrado y te enviaremos un enlace seguro para crear una nueva clave:',
      input: 'email',
      inputValue: formData.correo || '',
      inputPlaceholder: 'tu.correo@ejemplo.com',
      showCancelButton: true,
      confirmButtonText: 'Enviar Enlace',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0A1128',
      cancelButtonColor: '#94a3b8',
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor ingresa tu correo electrónico';
        }
      }
    });

    if (email) {
      Swal.fire({
        title: 'Enviando enlace...',
        text: 'Por favor espera un momento.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const redirectUrl = `${window.location.origin}/reset-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: redirectUrl
        });

        if (error) {
          throw error;
        }

        Swal.fire({
          icon: 'success',
          title: '¡Correo Enviado!',
          html: `
            <div class="text-left text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p>Hemos enviado un enlace de recuperación a: <strong>${email}</strong>.</p>
              <p>Revisa tu bandeja de entrada (y la carpeta de spam o no deseados) y haz clic en el botón para crear tu nueva contraseña.</p>
            </div>
          `,
          confirmButtonColor: '#0A1128',
          confirmButtonText: 'Entendido'
        });
      } catch (err) {
        console.error('Error al enviar correo de recuperación:', err);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo enviar',
          text: err.message || 'Verifica que el correo esté registrado o intenta de nuevo.',
          confirmButtonColor: '#0A1128'
        });
      }
    }
  };

  const [passStrength, setPassStrength] = useState({ percent: 0, label: '', color: '' });

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { percent: 0, label: '', color: '' };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1: return { percent: 25, label: 'Débil', color: 'bg-rose-500' };
      case 2: return { percent: 50, label: 'Media', color: 'bg-amber-500' };
      case 3: return { percent: 75, label: 'Segura', color: 'bg-blue-500' };
      case 4: return { percent: 100, label: 'Muy Segura', color: 'bg-emerald-500' };
      default: return { percent: 0, label: '', color: '' };
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });
    if (mode === 'register') {
      setPassStrength(calculatePasswordStrength(val));
    }
  };

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise((res) => setTimeout(res, 800));

      const isRuth = formData.correo.toLowerCase().includes('ruthanastacio') || formData.correo.toLowerCase().includes('ruth') || formData.correo.toLowerCase() === 'ruthanastacio191202@gmail.com';
      const isAdmin = isRuth || formData.correo.toLowerCase().includes('admin');

      const rawTel = formData.telefono ? formData.telefono.replace(/[^0-9]/g, '') : '';
      const formattedTel = rawTel
        ? `+51 ${rawTel.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').trim()}`
        : '+51 987 654 321';

      const loggedUser = {
        id: isRuth ? 'admin_ruth' : (isAdmin ? 'admin_user' : ('ts_' + Date.now())),
        nombre: isRuth
          ? 'Ruth Anastacio'
          : (mode === 'register' ? (formData.nombreCompleto || 'Ruth Anastacio') : 'Ruth Anastacio'),
        correo: isRuth ? 'ruthanastacio191202@gmail.com' : formData.correo,
        rol: (isRuth || isAdmin) ? 'admin' : 'colegiada',
        cargo: (isRuth || isAdmin) ? 'Administradora General' : 'Trabajadora Social',
        centro: 'SISNETS (Sede Central)',
        apoyo: 'Gestión institucional y convenios',
        telefono: mode === 'register' ? formattedTel : '+51 987 654 321',
        avatar: '/logo.png',
        metodo: 'Credenciales Directas'
      };

      if (mode === 'register') {
        try {
          const rawUsers = localStorage.getItem('usuarios_colegio');
          const usersList = rawUsers ? JSON.parse(rawUsers) : [];
          const exists = usersList.some(u => u.correo?.toLowerCase() === loggedUser.correo?.toLowerCase());
          if (!exists) {
            usersList.unshift({
              id: loggedUser.id,
              nombre: loggedUser.nombre,
              correo: loggedUser.correo,
              telefono: loggedUser.telefono,
              rol: loggedUser.rol,
              condicion: 'egresada',
              centro: loggedUser.centro,
              sector: 'Comunitario / ONGs',
              estado: 'activa',
              fechaIngreso: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
            });
            localStorage.setItem('usuarios_colegio', JSON.stringify(usersList));
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (formData.remember && formData.correo) {
        localStorage.setItem('sisnets_remember_correo', formData.correo);
      } else if (!formData.remember) {
        localStorage.removeItem('sisnets_remember_correo');
      }

      login(loggedUser);
      if (onClose) onClose();
    } catch (err) {
      setError('Credenciales incorrectas o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop con Blur que sobrepone al Navbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#050B18]/85 backdrop-blur-md"
      />

      {/* Tarjeta Principal del Modal - Borde oscuro corregido sin borde blanco */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="w-full max-w-[960px] bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col md:flex-row overflow-hidden relative z-10 border border-slate-800/80 dark:border-slate-800 max-h-[92vh] my-auto"
      >
        {/* Botón de Cierre (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition shadow-sm"
          title="Cerrar ventana"
        >
          <X size={18} />
        </button>

        {/* PANEL IZQUIERDO: Imagen Profesional + Branding SISNETS */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#0A1128] text-white p-8 lg:p-10 flex-col justify-between border-r border-slate-800/60 dark:border-slate-800/80 min-h-[580px]">
          {/* Imagen de Fondo: Colega Profesional */}
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
            alt="Comunidad SISNETS"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700"
          />

          {/* Gradiente Oscuro para Legibilidad y Elegancia */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/70 to-[#0A1128]/35" />

          {/* Badge Superior: Solo SISNETS */}
          <div className="relative z-10 self-start">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg">
              <img
                src="/logo.png"
                onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
                alt="Logo SISNETS"
                className="w-5 h-5 object-contain"
              />
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                SISNETS
              </span>
            </div>
          </div>

          {/* Tarjeta de Contenido Inferior con Vidrio Esmerilado */}
          <div className="relative z-10 space-y-3.5">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1128]/85 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/15 border border-cyan-400/30 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Networking Estratégico
              </div>
              <h4 className="text-base sm:text-lg font-black text-white leading-tight uppercase">
                Crecer juntas, no competir entre nosotras
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Accede al Directorio de Colegas de Trabajo Social con números de contacto directo y red de respaldo profesional.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 px-1 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Directorio en Tiempo Real
              </span>
              <span className="text-slate-400 font-medium">Acceso Protegido</span>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: Formulario Moderno SISNETS */}
        <div className="w-full md:w-1/2 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 sm:p-10 relative overflow-y-auto">

          <div className="max-w-md w-full mx-auto my-auto">

            {/* Header del Formulario: Solo SISNETS */}
            <div className="text-center mb-5">
              <div className="flex items-center justify-center mx-auto mb-2">
                <img
                  src="/logo.png"
                  onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
                  alt="Logo SISNETS"
                  className="w-14 h-14 object-contain drop-shadow"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-[0.15em] uppercase mt-0.5">
                SISNETS
              </p>
            </div>

            {/* Selector de Pestañas Moderno */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  const remembered = localStorage.getItem('sisnets_remember_correo');
                  setFormData({ nombreCompleto: '', telefono: '', correo: remembered || '', password: '', remember: !!remembered });
                  setPassStrength({ percent: 0, label: '', color: '' });
                }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setFormData({ nombreCompleto: '', telefono: '', correo: '', password: '', remember: true });
                  setPassStrength({ percent: 0, label: '', color: '' });
                }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
              >
                Registrarme
              </button>
            </div>

            {/* Alerta de Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 p-3 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase mb-4"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {mode === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Nombre Completo
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Mariana Gómez Sanchez"
                        value={formData.nombreCompleto}
                        onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-cyan-500/15 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Número de WhatsApp Profesional para Directorio con Bandera de Perú */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        WhatsApp de Contacto
                      </label>

                    </div>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus-within:ring-4 focus-within:ring-emerald-500/15 focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-sm">
                      <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shrink-0 select-none">
                        <PeruFlag className="w-[19px] h-[13px]" />
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 tracking-wide">+51</span>
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={12}
                        placeholder="987 654 321"
                        value={formData.telefono}
                        onChange={(e) => {
                          let val = e.target.value.replace(/^\+?51\s*/, '');
                          val = val.replace(/[^0-9 ]/g, '');
                          setFormData({ ...formData, telefono: val });
                        }}
                        className="w-full bg-transparent py-3 px-3.5 outline-none text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    </div>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                      🔒 Se usará para enlazar tu botón de contacto con el directorio.
                    </p>
                  </div>
                </>
              )}

              {/* Correo Electrónico */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="profesional@trabajosocial.org"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-cyan-500/15 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Contraseña
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Introduce tu contraseña"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    onKeyUp={handleKeyDown}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-11 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-cyan-500/15 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {capsLockActive && (
                  <p className="text-[11px] text-amber-500 font-bold tracking-wide mt-1">
                    ⚠️ Bloq Mayús está activado
                  </p>
                )}

                {mode === 'register' && formData.password && (
                  <div className="pt-1 space-y-1">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passStrength.color}`}
                        style={{ width: `${passStrength.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Fuerza:</span>
                      <span className="uppercase">{passStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fila Recordar datos y Olvidé contraseña en Iniciar Sesión */}
              {mode === 'login' && (
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 font-semibold group">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500/20 dark:bg-slate-800 transition cursor-pointer"
                    />
                    <span className="group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      Recordar datos
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11.5px] font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {/* Botón Principal Gradient SISNETS */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-[#050B18] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin text-[#050B18]" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'INGRESAR A SISNETS' : 'CREAR MI CUENTA EN LA RED'}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>

          {/* Footer Copyright: Solo SISNETS */}
          <div className="pt-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center">
            <p className="font-bold text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SISNETS
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
