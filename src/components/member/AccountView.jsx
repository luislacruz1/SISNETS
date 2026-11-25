import React, { useState, useEffect } from 'react';
import {
  Camera,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Save,
  User,
  Crown,
  FileText,
  ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { updateRemoteUser } from '../../lib/dataSyncService';
import { isMasculineName, formatTitleCase } from '../../utils/genderHelper';

export default function AccountView({
  user,
  updateUser,
  onOpenChangePassword,
  onNavigateToCards,
  onSaveProfile
}) {
  const [nombre, setNombre] = useState(user?.nombreCompleto || user?.nombre || '');
  const [celular, setCelular] = useState(user?.celular || user?.telefono || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  // Mantener sincronizado el estado local si el usuario en sesión se actualiza o recarga
  useEffect(() => {
    if (user?.nombre || user?.nombreCompleto) {
      setNombre(user.nombreCompleto || user.nombre || '');
    }
    if (user?.celular || user?.telefono) {
      setCelular(user.celular || user.telefono || '');
    }
    if (user?.avatar && user.avatar !== '/logo.png' && user.avatar !== '/logo.svg') {
      setAvatar(user.avatar);
    } else {
      // Búsqueda de rescate: si en el dispositivo móvil la sesión local vino sin avatar,
      // buscar si ya existe la foto en las fichas del directorio o en la lista de usuarios guardada
      try {
        const uEmail = (user?.correo || '').toLowerCase().trim();
        const storedCards = localStorage.getItem('directorio_colegas');
        if (storedCards && uEmail) {
          const parsedCards = JSON.parse(storedCards);
          if (Array.isArray(parsedCards)) {
            const myCard = parsedCards.find((c) => {
              const cardMail = (c.correo || '').toLowerCase().trim();
              return (cardMail && cardMail === uEmail) || (c.user_id && c.user_id === user?.id);
            });
            if (myCard?.avatar && myCard.avatar !== '/logo.png' && myCard.avatar !== '/logo.svg') {
              setAvatar(myCard.avatar);
              if (updateUser) updateUser({ avatar: myCard.avatar });
              return;
            }
          }
        }

        const storedUsers = localStorage.getItem('usuarios_colegio');
        if (storedUsers && uEmail) {
          const parsedUsers = JSON.parse(storedUsers);
          if (Array.isArray(parsedUsers)) {
            const me = parsedUsers.find((u) => {
              const mail = (u.correo || '').toLowerCase().trim();
              return (mail && mail === uEmail) || (u.id && u.id === user?.id);
            });
            if (me?.avatar && me.avatar !== '/logo.png' && me.avatar !== '/logo.svg') {
              setAvatar(me.avatar);
              if (updateUser) updateUser({ avatar: me.avatar });
            }
          }
        }
      } catch (e) {}
    }
  }, [user]);

  // Detección de género adaptativa para el saludo y las etiquetas
  const isMale = isMasculineName(nombre || user?.nombre);
  const isAdmin = user?.rol === 'admin';
  const isPracticante = user?.condicion === 'practicante';

  const roleBadgeLabel = isAdmin
    ? (isMale ? 'Administrador Directivo' : 'Administradora Directiva')
    : (isPracticante
        ? 'Practicante'
        : 'Colega');

  const roleDescription = isAdmin
    ? (isMale
        ? 'Posees privilegios directivos para validar usuarios, designar administradores y gestionar todo el directorio.'
        : 'Posees privilegios directivos para validar usuarias, designar administradoras y gestionar todo el directorio.')
    : 'Colega de la red profesional con acceso al directorio vivo, publicación de fichas institucionales y contactos clave.';

  // Manejador para cargar y comprimir foto a JPEG de alta fidelidad y peso ligero (<50KB)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Formato de imagen inválido',
        text: 'Por favor selecciona un archivo JPG, PNG o WebP.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result;
      if (!rawUrl) return;

      const img = new Image();
      img.onload = () => {
        // Redimensionar a un tamaño óptimo para avatares (máx 320x320 px)
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Comprimir en JPEG calidad 0.85 (produce ~20-35KB ultrarrápido)
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(optimizedBase64);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Foto cargada y optimizada. Recuerda hacer clic en "Guardar Cambios".',
          showConfirmButton: false,
          timer: 3000
        });
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  // Guardar datos del perfil en local y en la nube
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      Swal.fire('Campo requerido', 'El nombre y apellidos son obligatorios.', 'warning');
      return;
    }

    setIsSaving(true);
    const updatedUserData = {
      ...user,
      nombre: nombre.trim(),
      nombreCompleto: nombre.trim(),
      celular: celular.trim(),
      telefono: celular.trim(),
      avatar: avatar
    };

    try {
      if (onSaveProfile) {
        await onSaveProfile(updatedUserData);
      } else {
        // Fallback local
        if (updateUser) {
          updateUser(updatedUserData);
        }
        try {
          const storedUsers = localStorage.getItem('usuarios_colegio');
          if (storedUsers) {
            const list = JSON.parse(storedUsers);
            const updatedList = list.map((u) =>
              (u.id === user.id || u.correo?.toLowerCase() === user.correo?.toLowerCase())
                ? { ...u, ...updatedUserData }
                : u
            );
            localStorage.setItem('usuarios_colegio', JSON.stringify(updatedList));
          }
        } catch (err) {
          console.error('Error guardando en localStorage:', err);
        }
        if (updatedUserData.id) {
          await updateRemoteUser(updatedUserData.id, updatedUserData, updatedUserData);
        }
      }

      Swal.fire({
        icon: 'success',
        title: '¡Perfil y Foto Actualizados!',
        text: 'Tu foto de perfil y datos se han sincronizado con el directorio y el panel de usuarios.',
        timer: 2500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      Swal.fire({
        icon: 'info',
        title: 'Perfil Guardado',
        text: 'Tus cambios han quedado registrados en tu sesión actual.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn pb-10">
      
      {/* 1. HERO PROFILE CARD MODERNA Y PROFESIONAL EN FONDO BLANCO */}
      <div className="relative rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 shadow-sm border border-slate-200/90 dark:border-slate-800 overflow-hidden">
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 text-center sm:text-left">
          
          {/* Avatar con botón flotante de cámara */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-100 dark:bg-slate-800 ring-4 ring-slate-100 dark:ring-slate-800 shadow-md overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center">
                  <User size={48} className="stroke-[1.8] text-blue-200" />
                </div>
              )}
            </div>

            {/* Botón flotante para cambiar foto en azul encendido */}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-600/30 cursor-pointer transition transform hover:scale-110 active:scale-95"
              title="Subir o cambiar foto de perfil"
            >
              <Camera size={16} strokeWidth={2.4} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Información del Perfil y Badges */}
          <div className="space-y-2 flex-1 min-w-0">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {formatTitleCase(nombre) || 'Colega SISNETS'}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                  <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">{user?.correo}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={10} /> Verificado
                  </span>
                </div>
              </div>

              {/* Badge Dinámico de Condición / Rol en Azul Encendido */}
              <div className="flex items-center justify-center sm:justify-end">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/25">
                    <Crown size={14} className="text-white" />
                    {roleBadgeLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-600/30">
                    <ShieldCheck size={15} className="text-white" strokeWidth={2.4} />
                    {roleBadgeLabel}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL: DOS COLUMNAS BALANCEADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Formulario de Datos Personales (2/3 de ancho) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {/* Icono en Color del Sidebar con icono blanco */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center font-bold shadow-md shadow-[#0A1128]/25 border border-white/10">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Datos de Identidad y Contacto
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Actualiza tu información visible para la coordinación institucional
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              ID: {user?.id?.slice(0, 8) || 'Oficial'}
            </span>
          </div>

          <form onSubmit={handleSaveChanges} className="space-y-5">
            
            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Nombre y Apellidos
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Ej: Lic. Luis Jhonatan La Cruz Urbano"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                />
              </div>
            </div>

            {/* Correo y Celular en 2 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Correo Electrónico (Usuario)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={user?.correo || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-sm font-semibold cursor-not-allowed outline-none"
                    title="El correo es tu credencial única de acceso"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Identificador protegido no modificable
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Celular / WhatsApp Oficial
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="Ej: 987654321"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Para botón directo de coordinación
                </span>
              </div>

            </div>

            {/* Botón de Guardar */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#1E2B58] via-[#16224D] to-[#0A1128] hover:from-[#25366D] hover:via-[#1E2B58] hover:to-[#0F172A] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#0A1128]/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-white/10"
              >
                <Save size={16} />
                {isSaving ? 'Guardando...' : 'Guardar Cambios de Perfil'}
              </button>
            </div>

          </form>
        </div>

        {/* Columna Derecha: Tarjeta de Rol & Atribuciones (1/3 de ancho) */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              {/* Icono en Color del Sidebar con icono blanco */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center font-bold shadow-md shadow-[#0A1128]/25 border border-white/10">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm">
                  Rol y Permisos
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {roleBadgeLabel}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {roleDescription}
            </p>

            {onNavigateToCards && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Botón Gestionar Mis Fichas en Color del Sidebar con icono blanco */}
                <button
                  type="button"
                  onClick={onNavigateToCards}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#1E2B58] via-[#16224D] to-[#0A1128] hover:from-[#25366D] hover:via-[#1E2B58] hover:to-[#0F172A] text-white font-black text-xs uppercase tracking-wider flex items-center justify-between transition shadow-md shadow-[#0A1128]/25 border border-white/10 active:scale-95 cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText size={17} className="text-white" />
                    <span>Gestionar Mis Fichas</span>
                  </span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-white" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
