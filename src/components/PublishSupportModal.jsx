import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  GraduationCap, 
  Phone, 
  Mail, 
  User, 
  ChevronDown, 
  Check, 
  CheckSquare, 
  Square, 
  Sparkles,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isMasculineName } from '../utils/genderHelper';
import PeruFlag from './common/PeruFlag';

const OPCIONES_FORTALEZAS = [
  'PUEDO DAR ORIENTACION Y RESOLUCION DE CASOS SOCIALES',
  'TENGO ALIADOS ESTRATEGICOS EN EMPRESAS PRIVADAS/PUBLICAS',
  'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS)',
  'PUEDO SER MENTORA/DAR ORIENTACION A ESTUDIANTES Y NUEVAS COLEGAS',
  'PUEDO COMPARTIR OPORTUNIDADES LABORALES DESDE MI SECTOR',
  'PUEDO SER UN ALIADO ESTRATEGICO DESDE MI SECTOR',
  'PUEDO HACER INCIDENCIA PUBLICA Y ALIANZAS ESTRATEGICAS',
  'PUEDO APOYAR EN INVESTIGACION/TESIS/ENCUESTAS',
  'PUEDO COMPARTIR CURSOS Y CAPACITACIONES DESDE MI SECTOR',
  'PUEDO SER EXPOSITORA/CAPACITADORA',
  'PUEDO CONSEGUIR PONENTES ALIADOS',
  'OTRO'
];

export default function PublishSupportModal({ isOpen, onClose, onPublish, initialCard = null }) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const isEditing = Boolean(initialCard);

  // Estados del Formulario
  const [condicion, setCondicion] = useState('egresada'); // 'egresada' | 'practicante'
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [centroLaboral, setCentroLaboral] = useState('');
  const [centroPracticas, setCentroPracticas] = useState('');
  const [cargo, setCargo] = useState('');
  const [cicloEstudio, setCicloEstudio] = useState('8vo Ciclo');
  
  // Selección de Fortalezas (Checkbox desplegable)
  const [fortalezasSeleccionadas, setFortalezasSeleccionadas] = useState([]);
  const [otroTexto, setOtroTexto] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Inicialización o Autocompletado de datos
  useEffect(() => {
    if (isOpen) {
      if (initialCard) {
        const isPract = initialCard.condicion === 'practicante' || initialCard.tipo?.toLowerCase().includes('practicante');
        setCondicion(isPract ? 'practicante' : 'egresada');
        setNombre(initialCard.nombre || '');
        const cleanTel = (initialCard.telefono || '').replace(/^\+?51\s*/, '').trim();
        setTelefono(cleanTel);
        if (isPract) {
          setCentroPracticas(initialCard.institucion || '');
          setCentroLaboral('');
        } else {
          setCentroLaboral(initialCard.institucion || '');
          setCentroPracticas('');
        }
        setCargo(initialCard.cargo || '');
        setCicloEstudio(initialCard.cicloEstudio || '8vo Ciclo');

        let rawFort = [];
        if (Array.isArray(initialCard.fortalezas) && initialCard.fortalezas.length > 0) {
          rawFort = initialCard.fortalezas;
        } else if (initialCard.apoyo) {
          rawFort = initialCard.apoyo.split(' · ');
        }

        const standard = [];
        let custom = '';
        rawFort.forEach((f) => {
          const matched = OPCIONES_FORTALEZAS.find((op) => op.toLowerCase() === f.trim().toLowerCase());
          if (matched && matched !== 'OTRO') {
            standard.push(matched);
          } else if (f.trim()) {
            standard.push('OTRO');
            custom = f.trim();
          }
        });
        setFortalezasSeleccionadas([...new Set(standard)]);
        setOtroTexto(custom);
      } else if (user) {
        setCondicion(user.condicion === 'practicante' ? 'practicante' : 'egresada');
        setNombre(user.nombreCompleto || user.nombre || '');
        if (user.telefono && user.telefono.trim() !== '') {
          const clean = user.telefono.replace(/^\+?51\s*/, '').trim();
          setTelefono(clean);
        } else {
          setTelefono('');
        }
        setCentroLaboral('');
        setCentroPracticas('');
        setCargo('');
        setCicloEstudio('VIII Ciclo');
        setFortalezasSeleccionadas([]);
        setOtroTexto('');
      } else {
        setTelefono('');
        setCentroLaboral('');
        setCentroPracticas('');
        setCargo('');
        setFortalezasSeleccionadas([]);
        setOtroTexto('');
      }
    }
  }, [user, isOpen, initialCard]);

  if (!isOpen) return null;

  const toggleFortaleza = (opcion) => {
    if (fortalezasSeleccionadas.includes(opcion)) {
      setFortalezasSeleccionadas(fortalezasSeleccionadas.filter((item) => item !== opcion));
    } else {
      setFortalezasSeleccionadas([...fortalezasSeleccionadas, opcion]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanDigits = telefono.replace(/[^0-9]/g, '');
    if (!nombre.trim() || cleanDigits.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Número Incompleto',
        text: 'Por favor completa tu número de WhatsApp para que las colegas puedan contactarte.',
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    const formattedTelefono = `+51 ${cleanDigits.replace(/(\d{3})(\d{3})/, '$1 $2 ').trim()}`;

    const institucionFinal = condicion === 'egresada' ? centroLaboral.trim() : centroPracticas.trim();
    if (!institucionFinal) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta Centro Institucional',
        text: condicion === 'egresada' 
          ? 'Por favor indica dónde laboras actualmente.' 
          : 'Por favor indica dónde realizas tus prácticas pre-profesionales.',
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    if (!cargo.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta Cargo o Puesto',
        text: condicion === 'egresada'
          ? 'Por favor indica el cargo o puesto que ocupas actualmente.'
          : 'Por favor indica el cargo o rol de prácticas que ocupas.',
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    if (fortalezasSeleccionadas.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona tus Fortalezas',
        text: 'Por favor marca al menos una opción en la que te consideras buena y puedas orientar a colegas.',
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    // Armar la lista final de apoyo
    const listaApoyo = fortalezasSeleccionadas
      .map((f) => (f === 'OTRO' && otroTexto.trim() ? otroTexto.trim() : f))
      .filter(Boolean);

    const textoApoyoFinal = listaApoyo.join(' · ');

    const isMale = isMasculineName(nombre);
    const tipoCalculado = condicion === 'egresada' 
      ? (isMale ? 'Egresado' : 'Egresada') 
      : 'Practicante';

    const newCard = {
      ...(initialCard || {}),
      id: initialCard?.id || ('col_' + Date.now()),
      user_id: initialCard?.user_id || user?.id,
      nombre: nombre.trim(),
      condicion: condicion, // 'egresada' | 'practicante'
      tipo: tipoCalculado,
      cicloEstudio: condicion === 'practicante' ? cicloEstudio : null,
      institucion: institucionFinal,
      centroTipo: condicion === 'egresada' 
        ? 'Centro Laboral'
        : 'Centro de Prácticas',
      cargo: cargo.trim(),
      sector: initialCard?.sector || 'General',
      apoyo: textoApoyoFinal,
      fortalezas: listaApoyo,
      telefono: formattedTelefono,
      correo: initialCard?.correo || user?.correo || '',
      avatar: initialCard?.avatar || user?.avatar || '/logo.png'
    };

    onPublish(newCard);

    // Resetear formulario
    const userClean = user?.telefono ? user.telefono.replace(/^\+?51\s*/, '').trim() : '';
    setTelefono(userClean);
    setCentroLaboral('');
    setCentroPracticas('');
    setCargo('');
    setFortalezasSeleccionadas([]);
    setOtroTexto('');
    setIsDropdownOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#050B18]/75 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] p-5 sm:p-8 shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800 my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] flex items-center justify-center font-black shadow-md shadow-cyan-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
              {isEditing ? 'Editar Ficha del Directorio' : 'Registrar Directorio'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isEditing
                ? 'Actualiza los datos institucionales, cargo, ciclo y tus temáticas de orientación.'
                : 'Conéctate con la red: comparte tu centro y en qué puedes brindar orientación a otras colegas.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          
          {/* Fila 1: Nombre y WhatsApp (Correo eliminado según indicación) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center justify-between text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
                <span>Nombre Completo</span>
                <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-black">Autocompletado</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Lic. Mariana Gómez"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
                <span>Número de WhatsApp</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {user?.telefono && telefono.replace(/\s/g, '') === user.telefono.replace(/[^0-9]/g, '').replace(/^51/, '') ? '✨ Autocompletado' : 'Para enlace directo'}
                </span>
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shrink-0 select-none">
                  <PeruFlag className="w-[19px] h-[13px]" />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 tracking-wide">+51</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={12}
                  value={telefono}
                  onChange={(e) => {
                    let val = e.target.value.replace(/^\+?51\s*/, '');
                    val = val.replace(/[^0-9 ]/g, '');
                    setTelefono(val);
                  }}
                  placeholder="987 654 321"
                  className="w-full px-3 py-2.5 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Fila 2: Selector Renovado y Pulido: Egresada vs Practicante */}
          <div>
            <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-2">
              ¿Cuál es tu condición actual en Trabajo Social?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción Soy Egresada */}
              <button
                type="button"
                onClick={() => setCondicion('egresada')}
                className={`p-3 sm:p-3.5 min-h-[64px] rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 group relative overflow-hidden ${
                  condicion === 'egresada'
                    ? 'bg-gradient-to-br from-fuchsia-50/90 via-pink-50/50 to-white dark:from-fuchsia-950/40 dark:via-fuchsia-900/20 dark:to-slate-900 border-fuchsia-500 shadow-md shadow-fuchsia-500/10 ring-2 ring-fuchsia-500/20'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    condicion === 'egresada'
                      ? 'bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-md shadow-fuchsia-500/30'
                      : 'bg-slate-200/80 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <Briefcase size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className={`block text-xs font-black uppercase leading-tight truncate ${
                      condicion === 'egresada' ? 'text-fuchsia-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      Soy Egresada(o)
                    </span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  condicion === 'egresada'
                    ? 'bg-fuchsia-500 text-white shadow-xs'
                    : 'border-2 border-slate-300 dark:border-slate-600'
                }`}>
                  {condicion === 'egresada' && <Check size={12} strokeWidth={3} />}
                </div>
              </button>

              {/* Opción Soy Practicante */}
              <button
                type="button"
                onClick={() => setCondicion('practicante')}
                className={`p-3 sm:p-3.5 min-h-[64px] rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 group relative overflow-hidden ${
                  condicion === 'practicante'
                    ? 'bg-gradient-to-br from-violet-50/90 via-indigo-50/50 to-white dark:from-violet-950/40 dark:via-violet-900/20 dark:to-slate-900 border-violet-500 shadow-md shadow-violet-500/10 ring-2 ring-violet-500/20'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    condicion === 'practicante'
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/30'
                      : 'bg-slate-200/80 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <GraduationCap size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className={`block text-xs font-black uppercase leading-tight truncate ${
                      condicion === 'practicante' ? 'text-violet-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      Soy Practicante
                    </span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  condicion === 'practicante'
                    ? 'bg-violet-500 text-white shadow-xs'
                    : 'border-2 border-slate-300 dark:border-slate-600'
                }`}>
                  {condicion === 'practicante' && <Check size={12} strokeWidth={3} />}
                </div>
              </button>
            </div>
          </div>

          {/* Fila 3: Campos Dinámicos Condicionales (Con Cargo para escribir en vez de Sector) */}
          <AnimatePresence mode="wait">
            {condicion === 'egresada' ? (
              <motion.div
                key="egresada"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3 p-3.5 sm:p-4 rounded-2xl bg-fuchsia-50/30 dark:bg-fuchsia-950/20 border border-fuchsia-200/60 dark:border-fuchsia-800/40"
              >
                <div>
                  <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
                    ¿Dónde laboras actualmente?
                  </label>
                  <input
                    type="text"
                    required
                    value={centroLaboral}
                    onChange={(e) => setCentroLaboral(e.target.value)}
                    placeholder="Ej. Hospital Regional de Huacho / CEM Cercado / DEMUNA"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
                    Cargo que ocupas actualmente
                  </label>
                  <input
                    type="text"
                    required
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Ej. Especialista en Salud Mental, Trabajadora Social Forense, Jefa de Bienestar..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-sm"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="practicante"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3 p-3.5 sm:p-4 rounded-2xl bg-violet-50/30 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/40"
              >
                <div>
                  <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
                    ¿Dónde realizas tus prácticas?
                  </label>
                  <input
                    type="text"
                    required
                    value={centroPracticas}
                    onChange={(e) => setCentroPracticas(e.target.value)}
                    placeholder="Ej. Centro de Salud San Jerónimo / DEMUNA Municipal"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
                      Ciclo de Estudio
                    </label>
                    <div className="relative">
                      <select
                        value={cicloEstudio}
                        onChange={(e) => setCicloEstudio(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-violet-200/90 dark:border-violet-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-sm transition appearance-none cursor-pointer"
                      >
                        <option value="I Ciclo">I Ciclo</option>
                        <option value="II Ciclo">II Ciclo</option>
                        <option value="III Ciclo">III Ciclo</option>
                        <option value="IV Ciclo">IV Ciclo</option>
                        <option value="V Ciclo">V Ciclo</option>
                        <option value="VI Ciclo">VI Ciclo</option>
                        <option value="VII Ciclo">VII Ciclo</option>
                        <option value="VIII Ciclo">VIII Ciclo</option>
                        <option value="IX Ciclo">IX Ciclo</option>
                        <option value="X Ciclo">X Ciclo</option>
                        <option value="Egresada(o) Reciente">Egresada(o) Reciente (en trámite)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-violet-500 dark:text-violet-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
                      Cargo / Rol en Prácticas
                    </label>
                    <input
                      type="text"
                      required
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Ej. Practicante Pre-Profesional, Asistente de Casos..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fila 5: Desplegable con opciones de "¿En qué te consideras buena y puedes ayudar?" */}
          <div>
            <label className="block text-[11px] font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-1">
              ¿En qué te consideras buena y puedes ayudar a otras colegas?
            </label>

            {/* Botón Selector Desplegable */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:border-cyan-500 transition shadow-sm"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="truncate">
                    {fortalezasSeleccionadas.length === 0
                      ? 'Selecciona tus fortalezas (clic para desplegar)...'
                      : `${fortalezasSeleccionadas.length} fortaleza(s) seleccionada(s)`}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-cyan-500' : ''}`} />
              </button>

              {/* Menú Desplegable con Checkboxes Estilo Google Forms */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute z-20 left-0 right-0 mt-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-h-60 overflow-y-auto space-y-1"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Marca todas las opciones que apliquen:
                    </div>

                    {OPCIONES_FORTALEZAS.map((opcion) => {
                      const isChecked = fortalezasSeleccionadas.includes(opcion);
                      return (
                        <button
                          key={opcion}
                          type="button"
                          onClick={() => toggleFortaleza(opcion)}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs transition flex items-start gap-2.5 ${
                            isChecked
                              ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-300 font-bold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isChecked ? (
                              <CheckSquare size={16} className="text-cyan-600 dark:text-cyan-400" />
                            ) : (
                              <Square size={16} className="text-slate-400" />
                            )}
                          </div>
                          <span className="text-[11px] leading-tight select-none">
                            {opcion}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Campo adicional si se marca "OTRO" */}
            {fortalezasSeleccionadas.includes('OTRO') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <input
                  type="text"
                  required
                  value={otroTexto}
                  onChange={(e) => setOtroTexto(e.target.value)}
                  placeholder="Especifica tu otra fortaleza o apoyo que brindas..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-cyan-400 dark:border-cyan-500 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </motion.div>
            )}

            {/* Badges de previsualización de lo seleccionado */}
            {fortalezasSeleccionadas.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {fortalezasSeleccionadas.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-100/70 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold border border-cyan-200 dark:border-cyan-800/60"
                  >
                    <Check size={11} className="text-cyan-600 dark:text-cyan-400" />
                    <span className="max-w-[200px] truncate">{f === 'OTRO' && otroTexto ? otroTexto : f}</span>
                    <button
                      type="button"
                      onClick={() => toggleFortaleza(f)}
                      className="hover:text-rose-500 ml-1 text-slate-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botón de Enviar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-[#050B18] font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition active:scale-[0.98]"
            >
              {isEditing ? 'Guardar Cambios de la Ficha' : 'Publicar Directorio'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
