import React, { useState } from 'react';

/**
 * Componente: SocialWorkerLogin
 * Sistema: Networking de Trabajadores Sociales
 * Paleta: Azul Noche (#0A1128, #050B18) & Blanco (#FFFFFF) con acentos Cyan (#06B6D4)
 * Stack: React + Tailwind CSS
 */

export default function SocialWorkerLogin() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    email: '',
    password: '',
    remember: false,
  });

  const [notification, setNotification] = useState(null);

  const showToast = (type, title, message) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Llamada a tu API de autenticación (Ej. Supabase, Firebase, o Backend Express/FastAPI)
      await new Promise((res) => setTimeout(res, 1200));

      showToast(
        'success',
        '¡Bienvenido de vuelta!',
        `Accediendo a la red con el correo: ${formData.email}`
      );
    } catch (err) {
      showToast('error', 'Error al Iniciar Sesión', 'Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Integración Google OAuth 2.0 (Google Identity Services)
      await new Promise((res) => setTimeout(res, 1000));
      showToast('success', 'Google Auth Exitoso', 'Sesión iniciada con tu cuenta de Google.');
    } catch (err) {
      showToast('error', 'Error', 'No se pudo conectar con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Luces Ambientales */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Contenedor Split-Screen */}
      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col lg:flex-row relative z-10 border border-white/10">
        
        {/* LADO IZQUIERDO: Azul Noche & Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#0A1128] via-[#0E1A3D] to-[#050B18] p-8 lg:p-14 text-white flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10">
          <div>
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide">Networking de Trabajadores Sociales</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              Conectando vocación, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400">
                transformando realidades.
              </span>
            </h1>
            
            <p className="text-slate-300/80 text-sm lg:text-base leading-relaxed mb-8 max-w-md">
              Ecosistema profesional seguro para el intercambio de casos, supervisión técnica, derivaciones institucionales y comunidad de apoyo interdisciplinar.
            </p>

            {/* Ventajas */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3.5 bg-white/[0.04] p-3 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Casos Interdisciplinarios</h4>
                  <p className="text-xs text-slate-400">Criterios técnicos compartidos con rigor ético.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/[0.04] p-3 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Privacidad y Secreto Profesional</h4>
                  <p className="text-xs text-slate-400">Cifrado de extremo a extremo acorde al código deontológico.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-300">
                <strong className="text-cyan-400 font-bold">+12,000</strong> Colegiados Activos
              </span>
            </div>
            <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-slate-300">
              Red Oficial
            </span>
          </div>
        </div>

        {/* LADO DERECHO: Formulario Blanco Puro */}
        <div className="lg:w-1/2 p-8 lg:p-14 bg-white flex flex-col justify-center">
          {/* Selector de Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs mb-8">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#0A1128] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#0A1128] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0A1128] tracking-tight">
              {mode === 'login' ? '¡Bienvenido(a) de nuevo!' : 'Crea tu Cuenta Profesional'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login'
                ? 'Ingresa tus credenciales para acceder a la red.'
                : 'Únete para coordinar casos y colaborar con colegas.'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#0A1128] mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Lic. María Delgado"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1128] transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#0A1128] mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="usuario@trabajosocial.org"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1128] transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#0A1128]">Contraseña</label>
                {mode === 'login' && (
                  <a href="#forgot" className="text-xs text-cyan-600 hover:text-[#0A1128] font-medium transition">
                    ¿Olvidaste tu contraseña?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyUp={handleKeyDown}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1128] transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {capsLockActive && (
                <p className="text-[11px] text-amber-600 font-medium mt-1">⚠️ Bloq Mayús activado</p>
              )}
            </div>

            {mode === 'login' && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-300 text-[#0A1128] focus:ring-[#0A1128]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">
                  Recordarme en este dispositivo
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#0A1128] hover:bg-[#16224D] text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-[#0A1128]/25 hover:shadow-[#0A1128]/40 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{mode === 'login' ? 'Iniciar Sesión' : 'Crear mi Cuenta'}</span>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
              o continuar con
            </span>
          </div>

          {/* Botón de Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-[#0A1128] transition-all shadow-sm active:scale-[0.99]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>
      </div>

      {/* Notificación Toast */}
      {notification && (
        <div className="fixed top-5 right-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-xl flex items-start gap-3 z-50 animate-bounce">
          <div className="text-emerald-500 font-bold">✓</div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">{notification.title}</h5>
            <p className="text-xs text-slate-500">{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
