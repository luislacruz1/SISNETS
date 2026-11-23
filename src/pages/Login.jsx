import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Info,
  ShieldCheck,
  Shield,
  CheckCircle2,
  IdCard,
  Sparkles,
  Users,
  Building2,
  HeartHandshake,
  GraduationCap,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DynamicNetworkCanvas from '../components/DynamicNetworkCanvas';

export default function Login() {
  const { user, login, logout } = useAuth();
  const { isDarkMode } = useTheme();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    tipoPerfil: 'Egresada', // 'Egresada' | 'Estudiante'
    telefono: '',
    centroLaboral: '',
    areaApoyo: '',
    correo: '',
    password: '',
    remember: true
  });

  // Strength password state for registration
  const [passStrength, setPassStrength] = useState({ percent: 0, label: '', color: '' });

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { percent: 0, label: '', color: '' };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { percent: 25, label: 'Débil', color: 'bg-rose-500' };
      case 2:
        return { percent: 50, label: 'Media', color: 'bg-amber-500' };
      case 3:
        return { percent: 75, label: 'Segura', color: 'bg-blue-500' };
      case 4:
        return { percent: 100, label: 'Muy Segura', color: 'bg-emerald-500' };
      default:
        return { percent: 0, label: '', color: '' };
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

  const handleDemoFill = () => {
    setFormData({
      ...formData,
      correo: 'colegiada.social@ts-red.org',
      password: 'VocacionSocial2026!'
    });
    setError(null);
  };

  // Submit Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulación de latencia de API (Backend SISGEIN)
      await new Promise((res) => setTimeout(res, 1000));

      const isRuth = formData.correo.toLowerCase().includes('ruthanastacio') || formData.correo.toLowerCase().includes('ruth');
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
        correo: formData.correo,
        rol: isAdmin ? 'admin' : (mode === 'register' ? (formData.tipoPerfil === 'Egresada' ? 'Egresada' : 'Estudiante / Practicante') : 'Egresada'),
        centro: mode === 'register' && formData.centroLaboral ? formData.centroLaboral : 'SISNETS (Sede Central)',
        apoyo: mode === 'register' && formData.areaApoyo ? formData.areaApoyo : 'Gestión institucional y convenios',
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
              condicion: formData.tipoPerfil === 'Egresada' ? 'egresada' : 'practicante',
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

      login(loggedUser);

      Swal.fire({
        icon: 'success',
        title: '¡Acceso Concedido!',
        text: `Bienvenido(a) al Networking de Trabajadores Sociales, ${loggedUser.nombre}.`,
        confirmButtonColor: '#0A1128',
        background: isDarkMode ? '#0F172A' : '#FFFFFF',
        color: isDarkMode ? '#F8FAFC' : '#0F172A',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Credenciales incorrectas o servidor no disponible.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((res) => setTimeout(res, 900));

      const googleUser = {
        id: 'google_' + Date.now(),
        nombre: 'Lic. Claudia Morales',
        correo: 'claudia.morales.ts@gmail.com',
        matricula: 'COL-TS-94821',
        rol: 'Trabajadora Social Especialista',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        metodo: 'Google OAuth 2.0'
      };

      login(googleUser);

      Swal.fire({
        icon: 'success',
        title: 'Autenticación con Google Exitosa',
        text: `Iniciaste sesión como ${googleUser.correo}`,
        confirmButtonColor: '#0A1128',
        background: isDarkMode ? '#0F172A' : '#FFFFFF',
        color: isDarkMode ? '#F8FAFC' : '#0F172A',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      setError('No se pudo completar la autenticación con Google.');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de sesión activa (Dashboard Preview)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-200 dark:bg-slate-950 overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_50px_150px_-20px_rgba(0,10,30,0.35)] p-10 text-center relative z-10 border border-slate-100 dark:border-white/5"
        >
          <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border-4 border-cyan-500 shadow-xl shadow-cyan-500/20">
            <img src={user.avatar} alt={user.nombre} className="w-full h-full object-cover" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 size={14} /> Colegiación Activa
          </div>

          <h2 className="text-2xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
            {user.nombre}
          </h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 mb-6">
            {user.rol}
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left space-y-2 text-xs font-semibold mb-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Correo Electrónico:</span>
              <span className="text-slate-800 dark:text-slate-200">{user.correo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rol Profesional:</span>
              <span className="text-slate-800 dark:text-slate-200">{user.rol}</span>
            </div>
            {user.centro && (
              <div className="flex justify-between">
                <span className="text-slate-400">Centro / Prácticas:</span>
                <span className="text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">{user.centro}</span>
              </div>
            )}
            {user.apoyo && (
              <div className="flex justify-between">
                <span className="text-slate-400">Apoyo en Red:</span>
                <span className="text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">{user.apoyo}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Método de Acceso:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">{user.metodo}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={logout}
              className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-wider transition"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={() => Swal.fire({ title: 'Módulo en Construcción', text: 'Accediendo al Banco de Casos y Red de Derivaciones...', icon: 'info', confirmButtonColor: '#0A1128' })}
              className="flex-1 py-3.5 bg-[#0A1128] hover:bg-[#16224D] text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-[#0A1128]/30"
            >
              Ir a la Red TS
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-200 dark:bg-slate-950 overflow-hidden relative">

      {/* Botón Volver al Portal Informativo */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all border border-slate-200/50 dark:border-slate-700/50"
        >
          <span>← Portal Informativo</span>
        </Link>
      </div>



      {/* Fondo Minimalista Gris y Gradiente Ambiental */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-950 dark:to-slate-900" />

      {/* Tarjeta Principal Split-Screen SISGEIN Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1050px] min-h-[670px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_50px_150px_-20px_rgba(0,10,30,0.35)] ring-1 ring-black/5 dark:ring-white/5 flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* ==================================================================== */}
        {/* PANEL IZQUIERDO: Azul Noche (#0A1128) & Ecosistema de Red TS          */}
        {/* ==================================================================== */}
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#0D183A] to-[#050B18] text-white p-12 flex-col justify-between border-r border-white/10">

          {/* Canvas Interactivo de Nodos de Red */}
          <DynamicNetworkCanvas />

          {/* Luces Ambientales de Acento */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Contenido Superior */}
          <div className="relative z-10">
            {/* Badge Institucional */}
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-md mb-8">
              <img
                src="/logo.png"
                onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
                alt="Logo"
                className="w-5 h-5 object-contain"
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
                SISNETS · Trabajo Social
              </span>
            </div>

            {/* Titular */}
            <h1 className="text-3xl lg:text-[2.15rem] font-black tracking-tight leading-tight mb-2">
              SISNETS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                TRABAJO SOCIAL
              </span>
            </h1>

            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              Networking Estratégico con Propósito
            </p>

            <p className="text-slate-300/80 text-xs lg:text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Para que ninguna(o) trabaje sola(o) y ninguna(o) empiece desde cero. Crecer juntas, no competir entre nosotras.
            </p>

            {/* Tarjetas de Pilares Profesionales */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5 bg-white/[0.04] p-3 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Centros Laborales & Prácticas</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Conoce las instituciones donde laboran las egresadas.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/[0.04] p-3 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Mentoría y Orientación Fraterna</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Asesoría para informes, casos y vacantes de prácticas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del Panel Azul Noche */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-bold uppercase tracking-wider">
                <strong className="text-cyan-400">+12,400</strong> Colegiados Conectados
              </span>
            </div>
            <span className="text-slate-400 font-semibold">v2.0 SISGEIN Core</span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* PANEL DERECHO: Formulario Blanco Puro / Slate-900 SISGEIN             */}
        {/* ==================================================================== */}
        <div className="w-full md:w-1/2 bg-white dark:bg-slate-900 flex flex-col justify-between p-8 sm:p-12 relative overflow-y-auto">

          <div className="max-w-md w-full mx-auto my-auto">

            {/* Header del Formulario */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mx-auto mb-3">
                <img
                  src="/logo.png"
                  onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
                  alt="Logo Networking"
                  className="w-20 h-20 object-contain drop-shadow-md"
                />
              </div>
              <h2 className="text-2xl font-black text-[#0A1128] dark:text-white tracking-tight uppercase">
                {mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
              </h2>
              <p className="text-slate-400 dark:text-slate-500 mt-0.5 text-[10px] font-bold tracking-[0.15em] uppercase">
                Networking de Trabajadores Sociales
              </p>
            </div>

            {/* Selector de Pestañas (Tabs) */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-[#0A1128] dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-[#0A1128] dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
              >
                Registrarme
              </button>
            </div>

            {/* Alerta de Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 p-3 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase mb-4"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Formulario de Entrada */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Campo Nombre (Solo en Registro) */}
              {mode === 'register' && (
                <>
                  {/* Selector de Rol: Egresada vs Estudiante */}
                  <div className="space-y-1.5 mb-2">
                    <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider ml-1">
                      ¿Cuál es tu rol en la red?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipoPerfil: 'Egresada' })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                          formData.tipoPerfil === 'Egresada'
                            ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-md shadow-[#0A1128]/20'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <GraduationCap size={15} />
                        <span>Soy Egresada</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipoPerfil: 'Estudiante' })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                          formData.tipoPerfil === 'Estudiante'
                            ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-md shadow-[#0A1128]/20'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Users size={15} />
                        <span>Soy Estudiante</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider ml-1">
                      Nombre Completo
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={formData.tipoPerfil === 'Egresada' ? "Ej. Lic. Andrea Rivas" : "Ej. Valeria Sánchez"}
                        value={formData.nombreCompleto}
                        onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Campo WhatsApp de Contacto Profesional con Bandera de Perú */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between ml-1">
                      <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider">
                        WhatsApp de Contacto Profesional
                      </label>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Directorio
                      </span>
                    </div>
                    <div className="flex rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm">
                      <div className="flex items-center gap-1.5 px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shrink-0 select-none">
                        <span className="text-base leading-none">🇵🇪</span>
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
                        className="w-full bg-transparent py-3 px-3.5 outline-none text-sm font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      />
                    </div>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 ml-1 leading-tight">
                      🔒 Se usará para enlazar tu botón de contacto cuando registres tu centro en el directorio.
                    </p>
                  </div>

                  {/* Campo Centro de Trabajo o Prácticas */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider ml-1">
                      {formData.tipoPerfil === 'Egresada' ? 'Centro Laboral o donde realizaste prácticas' : 'Universidad y Ciclo o Centro de Prácticas'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder={formData.tipoPerfil === 'Egresada' ? "Ej. Hospital Regional, DEMUNA, UGEL, Municipalidad..." : "Ej. UNJFSC (8vo Ciclo) / Practicante en ONG..."}
                        value={formData.centroLaboral}
                        onChange={(e) => setFormData({ ...formData, centroLaboral: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Campo En qué puedes apoyar */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider ml-1">
                      {formData.tipoPerfil === 'Egresada' ? '¿En qué puedes servir de apoyo?' : '¿En qué buscas apoyo u orientación?'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HeartHandshake className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder={formData.tipoPerfil === 'Egresada' ? "Ej. Guía para postulaciones, informes sociofamiliares..." : "Ej. Guía para prácticas en sector salud, modelos de informes..."}
                        value={formData.areaApoyo}
                        onChange={(e) => setFormData({ ...formData, areaApoyo: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Campo Correo Institucional */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider ml-1">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="profesional@trabajosocial.org"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider ml-1">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Introduce tu contraseña"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    onKeyUp={handleKeyDown}
                    className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-11 pr-11 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Advertencia Caps Lock */}
                {capsLockActive && (
                  <p className="text-[11px] text-amber-500 font-bold tracking-wide mt-1 ml-1">
                    ⚠️ Bloq Mayús está activado
                  </p>
                )}

                {/* Medidor de Fuerza de Contraseña (Solo en Registro) */}
                {mode === 'register' && formData.password && (
                  <div className="pt-1.5 space-y-1">
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

              {/* Fila de Olvido de Contraseña y Recordarme */}
              {mode === 'login' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                      className="rounded border-slate-300 text-[#0A1128] focus:ring-[#0A1128]"
                    />
                    <span>Recordarme</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setShowForgotModal(true); }}
                    className="text-[12px] font-bold text-[#0A1128] dark:text-cyan-400 hover:text-[#12183d] dark:hover:text-cyan-300 transition-colors"
                  >
                    ¿Olvidó su contraseña?
                  </a>
                </div>
              )}

              {/* Botón Principal (Azul Noche Premium de SISGEIN) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A1128] hover:bg-[#16224D] dark:bg-indigo-950 dark:hover:bg-indigo-900 text-white font-bold py-4 rounded-2xl shadow-[0_8px_25px_-8px_rgba(10,17,40,0.6)] dark:shadow-[0_8px_25px_-8px_rgba(0,0,0,0.6)] border border-transparent dark:border-indigo-800/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-widest group"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'ENTRAR AL SISTEMA' : 'CREAR CUENTA EN LA RED'}
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          {/* Footer Copyright */}
          <div className="pt-6 text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center space-y-0.5">
            <p className="font-bold text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SISNETS
            </p>
          </div>
          </div>

        </div>
      </motion.div>

      {/* ==================================================================== */}
      {/* MODAL RECUPERACIÓN DE CONTRASEÑA (Mismo estilo exacto de SISGEIN)    */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050B18]/60 dark:bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setShowForgotModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 max-w-sm w-full shadow-2xl relative z-10 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 mx-auto mb-6 bg-cyan-50 dark:bg-cyan-950/40 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Info size={30} strokeWidth={2.5} />
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white text-center mb-3 uppercase tracking-tight">
                Recuperar Acceso
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 font-medium leading-relaxed">
                Por motivos de seguridad y secreto profesional, el restablecimiento de credenciales requiere confirmación con el <span className="text-slate-800 dark:text-slate-200 font-bold">Comité de Validación Colegial</span>.
              </p>

              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-4 rounded-2xl transition-all duration-300 text-[11px] uppercase tracking-widest border border-slate-200 dark:border-slate-700"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
