import React from 'react';
import {
  Users,
  GraduationCap,
  Hospital,
  Building2,
  Lock,
  FileText,
  Share2,
  TrendingUp,
  Compass,
  Microscope,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import DynamicNetworkCanvas from '../DynamicNetworkCanvas';

export default function PublicLanding({ setIsAuthModalOpen }) {
  // Los 7 Pilares del Networking Estratégico
  const sietePilares = [
    {
      numero: '01',
      titulo: 'Redes de contacto y aliados institucionales',
      lema: 'Si una(o) tiene un aliado, todas(os) lo tenemos.',
      descripcion: 'Articulación directa con hospitales, CEM, comisarías de familia, UGEL, DEMUNA, Poder Judicial y ONGs para agilizar gestiones de casos reales.',
      icono: Share2,
      badge: 'Alianzas Vivas',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      numero: '02',
      titulo: 'Oportunidades laborales',
      lema: 'Convocatorias CAS, 728, 276, prácticas, empleos y voluntariados.',
      descripcion: 'Bolsa interna de oportunidades laborales y prácticas compartidas por colegas en sus centros de trabajo antes de que se hagan masivas.',
      icono: TrendingUp,
      badge: 'Convocatorias & Prácticas',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      numero: '03',
      titulo: 'Orientación profesional entre colegas',
      lema: 'Orientación en la resolución de casos sociales. Aquí ninguna colega está sola.',
      descripcion: 'Espacio de consultoría solidaria entre colegas con experiencia para destrabar casos complejos de violencia, abandono, salud mental y peritajes.',
      icono: Compass,
      badge: 'Mentoría Fraterna',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
    },
    {
      numero: '04',
      titulo: 'Directorio de Colegas',
      lema: 'Nuestro directorio vivo: quiénes somos, dónde trabajamos y en qué podemos aportar.',
      descripcion: 'Red territorial de trabajadoras sociales organizadas por especialidad, institución laboral y disponibilidad para guiarnos mutuamente.',
      icono: Users,
      badge: 'Comunidad Conectada',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
    },
    {
      numero: '05',
      titulo: 'Banco de Instrumentos',
      lema: 'Modelos y formatos vigentes: fichas sociales, informes sociales, visitas domiciliarias, modelos de intervención.',
      descripcion: 'Repositorio abierto de plantillas editables validadas: informes sociofamiliares periciales, escalas de vulnerabilidad y protocolos éticos.',
      icono: FileText,
      badge: 'Herramientas Vigentes',
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
    },
    {
      numero: '06',
      titulo: 'Invitación a cursos y capacitaciones',
      lema: 'Diplomados, talleres, cursos y eventos que nos hagan crecer profesionalmente.',
      descripcion: 'Actualización técnica constante con ponencias exclusivas, descuentos de red y talleres prácticos en normativas, peritaje y gerencia social.',
      icono: GraduationCap,
      badge: 'Crecimiento Continuo',
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30'
    },
    {
      numero: '07',
      titulo: 'Grupos de investigación',
      lema: 'Apoyo en encuestas y tesis. Entre todos nos apoyamos.',
      descripcion: 'Comunidad solidaria para el llenado de muestras, validación de instrumentos de investigación, coautoría de artículos y tesis de pre y posgrado.',
      icono: Microscope,
      badge: 'Producción Científica',
      color: 'from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30'
    }
  ];

  return (
    <>
      {/* ------------------------------------------------------------------
          1. NAVBAR SUPERIOR PARA VISITANTES
          ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 bg-[#0A1128] text-white border-b border-cyan-500/20 shadow-xl shadow-black/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">

          {/* Logo y Branding SISNETS */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none min-w-0"
          >
            <img
              src="/logo.png"
              onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
              alt="Logo SISNETS"
              className="w-8 h-8 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(6,182,212,0.3)] flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="block font-black text-sm sm:text-lg tracking-wider text-white uppercase leading-none truncate">
                SISNETS
              </span>
              <span className="hidden sm:block text-[8px] sm:text-[10px] font-bold text-cyan-400 tracking-wider uppercase mt-1 truncate">
                Sistema de Networking en Trabajo Social
              </span>
            </div>
          </button>

          {/* Menú de Navegación Exclusivo para la Landing Informativa */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#que-es" className="hover:text-cyan-400 transition-colors">¿Qué es?</a>
            <a href="#pilares" className="hover:text-cyan-400 transition-colors">7 Ejes</a>
          </nav>

          {/* Botón Iniciar Sesión */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-[#050B18] font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 whitespace-nowrap active:scale-95 transition-all"
            >
              INICIAR SESIÓN
            </button>
          </div>

        </div>
      </header>

      {/* ------------------------------------------------------------------
          A. HERO SECTION: DINÁMICO, MODERNO CON FONDO INTEGRADO Y MOVIMIENTO
          ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0E1B42] to-slate-950 text-white pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28 border-b border-cyan-500/20">
        <DynamicNetworkCanvas />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* COLUMNA IZQUIERDA: Presentación e Identidad */}
            <div className="lg:col-span-7 text-center lg:text-left">

              {/* Badge animado SISNETS */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-4 sm:mb-6 backdrop-blur-md shadow-lg shadow-cyan-500/10"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SISNETS · Sistema de Networking en Trabajo Social</span>
              </motion.div>

              {/* Titular de Alto Impacto */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6 uppercase">
                Networking Estratégico <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                  con Propósito
                </span>
              </h1>

              {/* Eslogan Único y Contundente */}
              <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-medium mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Crecer juntas, no competir entre nosotras: <span className="text-cyan-300 font-bold">la red activa de colaboración y respaldo profesional.</span>
              </p>

              {/* Botón Principal de Acción hacia el Login */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-64 max-w-[85%] sm:w-auto px-6 py-3 sm:py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-[#050B18] font-black text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-xl shadow-cyan-500/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>INGRESAR A SISNETS</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#pilares"
                  className="w-64 max-w-[85%] sm:w-auto px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl border border-white/15 backdrop-blur-md transition-all text-center"
                >
                  Conocer los 7 Ejes ↓
                </a>
              </div>

            </div>

            {/* COLUMNA DERECHA: Visualizador del Directorio en Vivo */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative space-y-3 sm:space-y-4 max-w-md mx-auto">

                {/* Tarjeta 1: Colega Egresada - Hospital Regional */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-3.5 sm:gap-4 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold flex-shrink-0">
                    <Hospital size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-white uppercase truncate">Hospital Regional</h4>
                      <span className="text-[9px] font-black text-rose-300 bg-rose-500/15 border border-rose-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">Egresada</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">Lic. Claudia Morales · Salud Mental</p>
                    <span className="text-[10px] text-cyan-300 font-semibold block mt-0.5 truncate">🤝 Orientación en internado hospitalario</span>
                  </div>
                </motion.div>

                {/* Tarjeta 2: Colega Egresada - Centro Emergencia Mujer */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-3.5 sm:gap-4 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold flex-shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-white uppercase truncate">Centro Emergencia Mujer (CEM)</h4>
                      <span className="text-[9px] font-black text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">Egresada</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">Lic. Mariana Gómez · Juzgado de Familia</p>
                    <span className="text-[10px] text-cyan-300 font-semibold block mt-0.5 truncate">⚖️ Asesoría en peritajes e informes</span>
                  </div>
                </motion.div>

                {/* Tarjeta 3: Colega Practicante - Centro de Salud */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-3.5 sm:gap-4 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold flex-shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-white uppercase truncate">Centro de Salud San Jerónimo</h4>
                      <span className="text-[9px] font-black text-violet-300 bg-violet-500/15 border border-violet-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">Practicante</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">Valeria Sánchez · 9no Ciclo</p>
                    <span className="text-[10px] text-violet-300 font-semibold block mt-0.5 truncate">🎓 Apoyo en encuestas e investigación</span>
                  </div>
                </motion.div>

                {/* Banner del candado */}
                <div className="text-center pt-2">
                  <p className="text-[11px] text-cyan-300/80 font-bold tracking-wider uppercase flex items-center justify-center gap-1.5">
                    <Lock size={12} /> Directorio completo disponible al iniciar sesión
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          B. SECCIÓN: ¿QUÉ ES EL NETWORKING DE TRABAJADORES SOCIALES?
          ------------------------------------------------------------------ */}
      <section id="que-es" className="py-12 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-2 block">
              Propósito Institucional
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
              ¿Qué es Networking en Trabajo Social?
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-cyan-500 mx-auto mt-3 sm:mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">

            {/* La Práctica Tradicional Aislada */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-lg mb-5 sm:mb-6">
                  ✕
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200 uppercase mb-3 sm:mb-4">
                  El Ejercicio Profesional Aislado
                </h3>
                <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Trabajar en soledad frente a casos de alta complejidad institucional.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Empezar desde cero cada vez que asumes un centro laboral o tus primeras prácticas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Enterarte a destiempo de las convocatorias laborales CAS y requerimientos periciales.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Buscar contactos institucionales a ciegas cuando urge una derivación familiar o médica.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                Competencia innecesaria y sobrecarga individual
              </div>
            </div>

            {/* Networking Estratégico en Red */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0A1128] via-[#0E1A3D] to-[#050B18] text-white border border-cyan-500/30 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <DynamicNetworkCanvas />

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-5 sm:mb-6">
                  ✓
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase mb-3 sm:mb-4">
                  Networking Estratégico en Red
                </h3>
                <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold">✔</span>
                    <span><strong>Apoyarnos y recomendarnos:</strong> resolución conjunta de casos y orientación colegiada.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold">✔</span>
                    <span><strong>Compartir oportunidades:</strong> convocatorias CAS, 728, 276 y prácticas inmediatas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold">✔</span>
                    <span><strong>Banco de instrumentos vigentes:</strong> fichas sociales, informes periciales y visitas éticas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyan-400 font-bold">✔</span>
                    <span><strong>Red de contactos institucional:</strong> si una colega tiene el nexo, lo tenemos todas.</span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10 mt-6 sm:mt-8 pt-4 border-t border-white/10 text-[11px] font-black text-cyan-400 uppercase tracking-wider">
                🌟 Articulación territorial, mentoría fraterna y respaldo colegiado
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------
          D. LOS 7 PILARES DEL NETWORKING ESTRATÉGICO (PRESENTACIÓN DE EJES)
          ------------------------------------------------------------------ */}
      <section id="pilares" className="py-12 sm:py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-2 block">
              Ejes Estratégicos que Compartimos
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
              7 Pilares de SISNETS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 sm:mt-3 font-medium">
              Los ejes de articulación que potencian el ejercicio profesional en Trabajo Social.
            </p>
            <div className="w-16 sm:w-20 h-1 bg-cyan-500 mx-auto mt-3 sm:mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {sietePilares.map((pilar) => {
              const Icon = pilar.icono;
              return (
                <div
                  key={pilar.numero}
                  className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className="text-2xl sm:text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-cyan-500 transition-colors">
                        {pilar.numero}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                        {pilar.badge}
                      </span>
                    </div>

                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0A1128] text-cyan-400 flex items-center justify-center mb-4 sm:mb-5 shadow-md shadow-black/10 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>

                    <h3 className="text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight mb-2">
                      {pilar.titulo}
                    </h3>

                    <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-2.5 sm:mb-3 italic">
                      "{pilar.lema}"
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {pilar.descripcion}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-cyan-500 transition-colors">
                    <span>Disponible en la Red</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------
          E. BANNER FINAL CTA (LLAMADO A INICIAR SESIÓN)
          ------------------------------------------------------------------ */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-[#0A1128] via-[#0E1A3D] to-[#050B18] text-white relative overflow-hidden">
        <DynamicNetworkCanvas />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="px-3.5 sm:px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-400/30 inline-block mb-4 sm:mb-6">
            ¡Bienvenidas a SISNETS!
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 sm:mb-6">
            El Trabajo Social es más fuerte cuando trabajamos unidas.
          </h2>

          <p className="text-xs sm:text-base text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto font-medium">
            Únete a nuestra comunidad. Inicia sesión para acceder al Directorio de Colegas con WhatsApp directo.
          </p>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="w-64 max-w-[85%] sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#050B18] font-black text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all inline-block"
          >
            INGRESAR A SISNETS →
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          F. FOOTER INSTITUCIONAL PARA VISITANTES (NO LOGUEADOS)
          ------------------------------------------------------------------ */}
      <footer className="bg-[#050B18] text-slate-400 py-8 sm:py-12 border-t border-white/10 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
              alt="Logo SISNETS"
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div className="text-left">
              <span className="font-black text-white uppercase tracking-wider block text-sm">
                SISNETS
              </span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                Sistema de Networking en Trabajo Social
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] space-y-1">
            <p className="text-slate-400">
              © 2026. Todos los derechos reservados.
            </p>
            <p className="text-slate-500 font-medium">
              SISNETS v1.0
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
