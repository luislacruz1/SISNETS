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
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  handleDeleteUser
}) {
  // Control del desplegable de filtro moderno
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Paginación local para el módulo de usuarias
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Lista base para estadísticas
  const allUsers = registeredUsers.length > 0 ? registeredUsers : filteredUsers;

  // Métricas rápidas limpias (Sin sellos)
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
      {/* 1. TARJETAS DE RESUMEN LIMPIAS (SIN SELLO)                         */}
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
      {/* 2. BARRA DE BÚSQUEDA + DESPLEGABLE (IDÉNTICO AL DIRECTORIO)        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A1128] dark:group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={userSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar colega por nombre, correo, centro o sector..."
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

        {/* Desplegable Moderno de Filtro (Igual que en Directorio) */}
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
              {/* Backdrop para cerrar al hacer clic afuera */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/15 dark:shadow-black/60 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Filtrar por rol o condición
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
      {/* 3. VISTA EN CARDS (100% ESTÉTICO PARA CELULARES Y ESCRITORIO)       */}
      {/* ------------------------------------------------------------------ */}
      {filteredUsers.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {paginatedUsers.map((u) => {
              const isAdmin = u.rol === 'admin';
              // Avatar real si existe y no es el logo genérico
              const hasPhoto = u.avatar && u.avatar !== '/logo.png' && u.avatar !== '/logo.svg';
              // Iniciales del nombre
              const initials = (u.nombre || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  className="relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-400/80 dark:hover:border-cyan-500/80 shadow-md hover:shadow-xl transition-all flex flex-col gap-3 group overflow-hidden"
                >
                  {/* Barra Superior con Acento de Color */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-r ${
                      isAdmin
                        ? 'from-amber-400 via-orange-500 to-amber-600'
                        : 'from-cyan-400 via-blue-500 to-indigo-500'
                    }`}
                  />

                  {/* Cabecera: Avatar, Nombre y Eliminar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar: foto real o iniciales */}
                      {hasPhoto ? (
                        <img
                          src={u.avatar}
                          alt={u.nombre}
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

                      {/* Nombre + badge Admin si aplica */}
                      <div className="min-w-0">
                        <h4 className="font-black text-sm sm:text-base text-[#0A1128] dark:text-white uppercase leading-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {u.nombre}
                        </h4>
                        {isAdmin && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                            ★ Administradora
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u)}
                      className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition shrink-0"
                      title="Eliminar miembro de la red"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Contacto: WhatsApp & Correo */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${u.telefono?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-bold flex items-center justify-between transition group/btn"
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

                    {/* Correo */}
                    <a
                      href={`mailto:${u.correo}`}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 font-bold flex items-center justify-between transition group/mail"
                      title={`Enviar correo a ${u.correo}`}
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
            No hay miembros registradas que coincidan con los filtros seleccionados o el término de búsqueda.
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
      {/* 4. PAGINACIÓN MODERNA (IDÉNTICA A LA DEL DIRECTORIO)               */}
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
    </div>
  );
}
