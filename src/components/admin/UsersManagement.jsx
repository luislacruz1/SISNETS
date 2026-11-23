import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Crown,
  Phone,
  Mail,
  Trash2,
  Users,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  UserX,
  Pencil,
  Save,
  Building2,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

// Helper seguro para iniciales sin errores con títulos o espacios
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const cleaned = name.replace(/^(Mg\.|Lic\.|Dr\.|Dra\.|Bach\.)\s+/i, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
};

// Opciones del selector desplegable moderno para usuarias
const USER_FILTER_OPTIONS = [
  {
    id: 'todos',
    label: 'Todas las Colegas',
    sublabel: 'Comunidad completa',
    icon: Users,
    badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border-blue-200/60 dark:border-blue-800/40',
    activeColor: 'text-blue-600 dark:text-cyan-400'
  },
  {
    id: 'admin',
    label: 'Administradoras',
    sublabel: 'Gestión y control de red',
    icon: Crown,
    badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40',
    activeColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'egresada',
    label: 'Egresada(o)',
    sublabel: 'Tituladas y graduadas',
    icon: Building2,
    badgeColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-800/40',
    activeColor: 'text-fuchsia-600 dark:text-fuchsia-400'
  },
  {
    id: 'practicante',
    label: 'Practicante',
    sublabel: 'Prácticas pre-profesionales',
    icon: GraduationCap,
    badgeColor: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40',
    activeColor: 'text-violet-600 dark:text-violet-400'
  },
  {
    id: 'suspendidas',
    label: 'Cuentas Pausadas',
    sublabel: 'Acceso suspendido temporal',
    icon: UserX,
    badgeColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40',
    activeColor: 'text-rose-600 dark:text-rose-400'
  }
];

export default function UsersManagement({
  userSearchTerm,
  setUserSearchTerm,
  userFilterRole,
  setUserFilterRole,
  filteredUsers = [],
  registeredUsers = [],
  handleToggleUserRole,
  handleToggleUserStatus,
  handleDeleteUser,
  handleUpdateUser
}) {
  // Control del desplegable de filtro moderno
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Estado para el modal de edición
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    avatar: ''
  });

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditForm({
      nombre: u.nombre || '',
      telefono: u.telefono || '',
      correo: u.correo || '',
      avatar: (u.avatar && u.avatar !== '/logo.png' && u.avatar !== '/logo.svg') ? u.avatar : ''
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({ nombre: '', telefono: '', correo: '', avatar: '' });
  };

  const handleSaveEdit = (e) => {
    if (e) e.preventDefault();
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      nombre: editForm.nombre.trim() || editingUser.nombre,
      telefono: editForm.telefono.trim() || editingUser.telefono,
      correo: editForm.correo.trim() || editingUser.correo,
      avatar: editForm.avatar.trim() || editingUser.avatar || '/logo.png'
    };

    if (handleUpdateUser) {
      handleUpdateUser(updatedUser);
    } else {
      try {
        const rawUsers = localStorage.getItem('usuarios_colegio');
        const usersList = rawUsers ? JSON.parse(rawUsers) : [];
        const updated = usersList.map((u) => (u.id === editingUser.id ? updatedUser : u));
        localStorage.setItem('usuarios_colegio', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'Datos Actualizados',
      text: `Se guardaron los cambios para ${updatedUser.nombre}.`,
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: '#0A1128'
    });

    closeEditModal();
  };

  // Paginación local para el módulo de usuarias
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Lista base para estadísticas
  const allUsers = registeredUsers.length > 0 ? registeredUsers : filteredUsers;

  // Métricas rápidas
  const stats = useMemo(() => {
    const total = allUsers.length;
    const admins = allUsers.filter((u) => u.rol === 'admin').length;
    const egresadas = allUsers.filter((u) => u.condicion === 'egresada').length;
    const practicantes = allUsers.filter((u) => u.condicion === 'practicante').length;
    return { total, admins, egresadas, practicantes };
  }, [allUsers]);

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, startIndex, itemsPerPage]);

  const handleSelectFilter = (roleId) => {
    setUserFilterRole(roleId);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setUserSearchTerm(val);
    setCurrentPage(1);
  };

  // Opción activa actual
  const currentFilterOption = USER_FILTER_OPTIONS.find((o) => o.id === userFilterRole) || USER_FILTER_OPTIONS[0];
  const ActiveIcon = currentFilterOption.icon;

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TARJETAS DE RESUMEN                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Miembros */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
              Total Miembros
            </span>
            <span className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white leading-tight">
              {stats.total}
            </span>
          </div>
        </div>

        {/* Administradoras */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Crown size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
              Administradoras
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 leading-tight">
              {stats.admins}
            </span>
          </div>
        </div>

        {/* Egresadas */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
              Egresadas(os)
            </span>
            <span className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white leading-tight">
              {stats.egresadas}
            </span>
          </div>
        </div>

        {/* Practicantes */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <GraduationCap size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
              Practicantes
            </span>
            <span className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white leading-tight">
              {stats.practicantes}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. BARRA DE BÚSQUEDA + DESPLEGABLE                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A1128] dark:group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={userSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar colega por nombre, correo o teléfono..."
            className="w-full bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:border-[#0A1128] dark:focus:border-cyan-400 focus:ring-1 focus:ring-[#0A1128] dark:focus:ring-cyan-400 transition-all shadow-sm placeholder:text-slate-400 font-semibold"
          />
          {userSearchTerm && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg transition"
              title="Borrar búsqueda"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Desplegable de Filtro */}
        <div className="relative shrink-0 sm:w-64">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="w-full py-3.5 pl-3.5 pr-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all select-none active:scale-[0.99] group"
            aria-expanded={isFilterOpen}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${currentFilterOption.badgeColor}`}>
                <ActiveIcon size={15} />
              </div>
              <span className="truncate">{currentFilterOption.label}</span>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 shrink-0 ml-2 ${
                isFilterOpen ? 'rotate-180 text-[#0A1128] dark:text-cyan-400' : ''
              }`}
            />
          </button>

          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/15 dark:shadow-black/60 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Filtrar miembros
                </div>

                <div className="space-y-0.5">
                  {USER_FILTER_OPTIONS.map((opt) => {
                    const OptionIcon = opt.icon;
                    const isSelected = userFilterRole === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectFilter(opt.id)}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-800 text-[#0A1128] dark:text-white font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${opt.badgeColor}`}>
                            <OptionIcon size={14} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate leading-tight">
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                              {opt.sublabel}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check size={16} className={`shrink-0 ml-1.5 ${opt.activeColor}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. VISTA EN CARDS LIMPIAS (NOMBRE COMPLETO COMPLETO SIN CORTE)     */}
      {/* ------------------------------------------------------------------ */}
      {filteredUsers.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {paginatedUsers.map((u) => {
              const isAdmin = u.rol === 'admin';
              const hasPhoto = Boolean(u.avatar && u.avatar !== '/logo.png' && u.avatar !== '/logo.svg');
              const initials = getInitials(u.nombre);

              return (
                <motion.div
                  key={u.id || u.correo}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  className="relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-400/80 dark:hover:border-cyan-500/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between gap-3 group overflow-hidden"
                >
                  {/* Barra Superior con Acento de Color */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-r ${
                      isAdmin
                        ? 'from-amber-400 via-orange-500 to-amber-600'
                        : 'from-cyan-400 via-blue-500 to-indigo-500'
                    }`}
                  />

                  {/* Cabecera: Avatar, Nombre Completo (sin cortar) y Botones */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Avatar: Foto o Iniciales */}
                      {hasPhoto ? (
                        <img
                          src={u.avatar}
                          alt={u.nombre}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover shrink-0 shadow-md ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-cyan-400 transition-all"
                        />
                      ) : (
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-white text-sm shrink-0 shadow-md transition-transform group-hover:scale-105 ${
                            isAdmin
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30'
                              : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'
                          }`}
                        >
                          {isAdmin ? <Crown size={20} /> : initials}
                        </div>
                      )}

                      {/* Nombre Completo - Envuelto naturalmente sin puntos suspensivos */}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-sm sm:text-base text-[#0A1128] dark:text-white uppercase leading-snug break-words group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {u.nombre}
                        </h4>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                            ★ Administradora
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botones de Acción: Editar y Eliminar */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="w-8 h-8 rounded-xl text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 flex items-center justify-center transition"
                        title="Editar datos del usuario"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u)}
                        className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Contacto Directo: WhatsApp y Correo */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {/* Botón WhatsApp */}
                    <a
                      href={`https://wa.me/${u.telefono?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold flex items-center justify-between transition group/btn"
                      title="Abrir conversación de WhatsApp"
                    >
                      <span className="flex items-center gap-2">
                        <Phone size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{u.telefono || 'Sin teléfono'}</span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 shrink-0">
                        WhatsApp <ExternalLink size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </span>
                    </a>

                    {/* Botón Correo */}
                    <a
                      href={`mailto:${u.correo}`}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold flex items-center justify-between transition group/mail"
                      title={`Enviar correo electrónico a ${u.correo}`}
                    >
                      <span className="flex items-center gap-2 min-w-0 truncate">
                        <Mail size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span className="truncate font-semibold text-[11.5px] text-slate-700 dark:text-slate-200">
                          {u.correo}
                        </span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5 shrink-0 ml-1">
                        Email <ExternalLink size={10} className="group-hover/mail:translate-x-0.5 transition-transform" />
                      </span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Estado Vacío */
        <div className="py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search size={24} />
          </div>
          <h4 className="font-black text-base text-[#0A1128] dark:text-white uppercase">
            No se encontraron usuarias
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            No hay miembros registrados que coincidan con la búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setUserSearchTerm('');
              setUserFilterRole('todos');
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-[#0A1128] dark:bg-cyan-500 text-white dark:text-[#050B18] text-xs font-black uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. PAGINACIÓN                                                      */}
      {/* ------------------------------------------------------------------ */}
      {filteredUsers.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 pb-2 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Mostrando <strong className="text-[#0A1128] dark:text-cyan-400">{startIndex + 1}</strong> - <strong className="text-[#0A1128] dark:text-cyan-400">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</strong> de <strong className="text-[#0A1128] dark:text-cyan-400">{filteredUsers.length}</strong> usuarias
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 active:scale-95"
            >
              <ChevronLeft size={14} />
              <span className="hidden xs:inline">Anterior</span>
            </button>

            <span className="px-3 py-1 text-xs font-black text-[#0A1128] dark:text-cyan-400 bg-slate-100 dark:bg-slate-800 rounded-xl">
              Página {currentPage} de {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 active:scale-95"
            >
              <span className="hidden xs:inline">Siguiente</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. MODAL DE EDICIÓN DE USUARIO                                     */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditModal}
              className="fixed inset-0 bg-[#050B18]/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-[#0A1128] dark:text-white uppercase tracking-tight">
                    Editar Datos del Usuario
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Actualiza la información del miembro de la red
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                {/* Foto / Avatar Preview */}
                <div className="flex items-center gap-3">
                  {editForm.avatar ? (
                    <img
                      src={editForm.avatar}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = '/logo.png';
                      }}
                      className="w-14 h-14 rounded-2xl object-cover shadow ring-2 ring-cyan-400"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow">
                      {getInitials(editForm.nombre)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      URL de Foto de Perfil (Opcional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/foto.jpg"
                      value={editForm.avatar}
                      onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                {/* Nombre Completo */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mg. Stephanie Natalia La Cruz"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    WhatsApp de Contacto
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+51 987 654 321"
                    value={editForm.telefono}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={editForm.correo}
                    onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                  />
                </div>

                {/* Botones */}
                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={15} />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
