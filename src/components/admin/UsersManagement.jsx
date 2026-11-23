import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Download,
  Crown,
  Phone,
  Mail,
  ShieldCheck,
  Trash2,
  Building2,
  GraduationCap,
  Users,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersManagement({
  userSearchTerm,
  setUserSearchTerm,
  userFilterRole,
  setUserFilterRole,
  filteredUsers = [],
  registeredUsers = [],
  handleExportUsersCSV,
  handleToggleUserRole,
  handleToggleUserVerify,
  handleToggleUserStatus,
  handleDeleteUser
}) {
  // Modo de visualización: 'cards' (por defecto) o 'table'
  const [viewMode, setViewMode] = useState('cards');

  // Paginación local para el módulo de usuarias
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'cards' ? 9 : 12;

  // Lista base para estadísticas (usa registeredUsers si está disponible, o filteredUsers)
  const allUsers = registeredUsers.length > 0 ? registeredUsers : filteredUsers;

  // Métricas rápidas del módulo de usuarias
  const stats = useMemo(() => {
    const total = allUsers.length;
    const admins = allUsers.filter((u) => u.rol === 'admin').length;
    const verificadas = allUsers.filter((u) => !!u.verificada).length;
    const egresadas = allUsers.filter((u) => u.condicion === 'egresada').length;
    const practicantes = allUsers.filter((u) => u.condicion === 'practicante').length;
    return { total, admins, verificadas, egresadas, practicantes };
  }, [allUsers]);

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, startIndex, itemsPerPage]);

  const handleFilterChange = (roleId) => {
    setUserFilterRole(roleId);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setUserSearchTerm(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TARJETAS DE RESUMEN / MÉTRICAS RÁPIDAS                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Usuarias */}
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

        {/* Verificadas */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
              Sello Verificado
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              {stats.verificadas}
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

        {/* Egresadas y Practicantes */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0">
            <GraduationCap size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
              Egresadas / Pract.
            </span>
            <span className="text-lg sm:text-xl font-black text-[#0A1128] dark:text-white leading-tight">
              {stats.egresadas} <span className="text-xs font-bold text-slate-400">/ {stats.practicantes}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. BARRA DE HERRAMIENTAS: BÚSQUEDA, FILTROS Y VISTAS               */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Buscador */}
          <div className="relative flex-1 group">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              value={userSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar colega por nombre, correo, centro o sector..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition"
            />
            {userSearchTerm && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 flex items-center justify-center transition"
                title="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Controles de Vista y Exportación */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Conmutador de Vista (Cards / Tabla en pantallas medianas+) */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Vista en cuadrícula de tarjetas"
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Vista en tabla detallada"
              >
                <TableIcon size={14} />
                <span>Tabla</span>
              </button>
            </div>

            {/* Exportar CSV */}
            <button
              type="button"
              onClick={handleExportUsersCSV}
              className="px-3.5 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shrink-0 active:scale-95 shadow-sm"
              title="Exportar listado a Excel / CSV"
            >
              <Download size={14} />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Filtros Rápidos */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
          {[
            { id: 'todos', label: 'Todas', count: stats.total },
            { id: 'admin', label: 'Admins', count: stats.admins },
            { id: 'egresada', label: 'Egresadas', count: stats.egresadas },
            { id: 'practicante', label: 'Practicantes', count: stats.practicantes },
            { id: 'verificadas', label: 'Verificadas', count: stats.verificadas },
            { id: 'suspendidas', label: 'Suspendidas' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFilterChange(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                userFilterRole === f.id
                  ? 'bg-[#0A1128] dark:bg-cyan-500 text-white dark:text-[#050B18] shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{f.label}</span>
              {typeof f.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  userFilterRole === f.id
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#050B18]'
                    : 'bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. CONTENIDO: VISTA EN CARDS (MÓVIL Y ESCRITORIO MODERNO)          */}
      {/* ------------------------------------------------------------------ */}
      {/* En celular SIEMPRE se muestra en cards, en desktop según viewMode */}
      <div className={viewMode === 'table' ? 'block sm:hidden' : 'block'}>
        {filteredUsers.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {paginatedUsers.map((u) => {
                const isPracticante = u.condicion === 'practicante';
                const isAdmin = u.rol === 'admin';
                const isActiva = u.estado === 'activa';
                const isVerificada = !!u.verificada;

                return (
                  <motion.div
                    key={u.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-cyan-400/80 dark:hover:border-cyan-500/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group overflow-hidden"
                  >
                    {/* Barra Superior con Acento de Color Dinámico */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-r ${
                        isAdmin
                          ? 'from-amber-400 via-orange-500 to-amber-600'
                          : isPracticante
                            ? 'from-violet-500 via-indigo-500 to-cyan-400'
                            : 'from-fuchsia-500 via-pink-500 to-rose-400'
                      }`}
                    />

                    <div>
                      {/* Cabecera de la Card: Avatar, Nombre, Condición y Borrar */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar Squircle */}
                          <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-md transition-transform group-hover:scale-105 ${
                              isAdmin
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30'
                                : isPracticante
                                  ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-500/30'
                                  : 'bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-fuchsia-500/30'
                            }`}
                          >
                            {isAdmin ? (
                              <Crown size={20} />
                            ) : isPracticante ? (
                              <GraduationCap size={20} />
                            ) : (
                              <Building2 size={20} />
                            )}
                          </div>

                          {/* Nombre y Badges */}
                          <div className="min-w-0">
                            <h4 className="font-black text-sm sm:text-base text-[#0A1128] dark:text-white uppercase leading-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {u.nombre}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {/* Condición */}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                  isPracticante
                                    ? 'bg-violet-600 text-white shadow-xs'
                                    : 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-xs'
                                }`}
                              >
                                {isPracticante ? 'Practicante' : 'Egresada'}
                              </span>

                              {/* Sello Oficial */}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                  isVerificada
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <ShieldCheck size={10} className={isVerificada ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'} />
                                <span>{isVerificada ? 'Verificada' : 'Pendiente'}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botón Eliminar Registro */}
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition shrink-0"
                          title="Eliminar miembro de la red"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Cuerpo de la Card: Centro, Sector y Contacto */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        {/* Centro Laboral */}
                        <div className="flex items-start gap-2">
                          <Building2 size={14} className="text-cyan-500 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate leading-tight" title={u.centro}>
                              {u.centro || 'Sin centro asignado'}
                            </span>
                            {u.sector && (
                              <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                                {u.sector}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contacto Directo: WhatsApp & Correo */}
                        <div className="space-y-1.5 pt-1">
                          <a
                            href={`https://wa.me/${u.telefono?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold flex items-center justify-between transition group/btn"
                            title="Abrir conversación de WhatsApp"
                          >
                            <span className="flex items-center gap-1.5">
                              <Phone size={13} className="text-emerald-600 dark:text-emerald-400" />
                              <span>{u.telefono || 'Sin teléfono'}</span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                              WhatsApp <ExternalLink size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </span>
                          </a>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 px-1 truncate">
                            <Mail size={12} className="shrink-0 text-slate-400" />
                            <span className="truncate" title={u.correo}>{u.correo}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ------------------------------------------------------------ */}
                    {/* Controles de Administración (1-Clic)                         */}
                    {/* ------------------------------------------------------------ */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Controles de Administradora:
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {/* 1. Alternar Rol */}
                        <button
                          type="button"
                          onClick={() => handleToggleUserRole(u)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition text-center truncate ${
                            isAdmin
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400 hover:bg-amber-500/25'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-cyan-500'
                          }`}
                          title="Clic para cambiar rol entre Admin y Colegiada"
                        >
                          {isAdmin ? '★ Admin' : 'Colegiada'}
                        </button>

                        {/* 2. Alternar Sello de Verificación */}
                        <button
                          type="button"
                          onClick={() => handleToggleUserVerify(u)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition text-center truncate ${
                            isVerificada
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400 hover:bg-emerald-500/25'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                          title="Clic para otorgar o retirar Sello Oficial"
                        >
                          {isVerificada ? '✓ Sellada' : 'Pendiente'}
                        </button>

                        {/* 3. Alternar Estado (Activa / Suspendida) */}
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition text-center truncate ${
                            isActiva
                              ? 'bg-emerald-500 text-[#050B18] border-emerald-400 font-black hover:bg-rose-500 hover:text-white hover:border-rose-500'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
                          }`}
                          title="Clic para suspender o reactivar cuenta"
                        >
                          {isActiva ? '● Activa' : '✕ Pausa'}
                        </button>
                      </div>
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
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. CONTENIDO: VISTA EN TABLA (SÓLO ESCRITORIO SI VIEWMODE ES TABLE) */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'table' && (
        <div className="hidden sm:block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Colega</th>
                  <th className="py-3 px-4">Centro & Sector</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4 text-center">Rol</th>
                  <th className="py-3 px-4 text-center">Sello Oficial</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((u) => {
                    const isPracticante = u.condicion === 'practicante';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        {/* Colega */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 ${
                              u.rol === 'admin'
                                ? 'bg-amber-500 shadow-md shadow-amber-500/30'
                                : isPracticante
                                  ? 'bg-violet-600 shadow-md shadow-violet-600/30'
                                  : 'bg-fuchsia-600 shadow-md shadow-fuchsia-600/30'
                            }`}>
                              {u.rol === 'admin' ? <Crown size={14} /> : (u.nombre?.charAt(0) || 'C')}
                            </div>
                            <div>
                              <span className="font-black text-slate-900 dark:text-white block leading-tight">
                                {u.nombre}
                              </span>
                              <span className={`inline-block text-[9px] font-bold uppercase mt-0.5 ${
                                isPracticante ? 'text-violet-600 dark:text-violet-400' : 'text-fuchsia-600 dark:text-fuchsia-400'
                              }`}>
                                {isPracticante ? 'Practicante' : 'Egresada'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Centro & Sector */}
                        <td className="py-3 px-4 max-w-[200px]">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block truncate" title={u.centro}>
                            {u.centro || 'Sin centro asignado'}
                          </span>
                          {u.sector && (
                            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                              {u.sector}
                            </span>
                          )}
                        </td>

                        {/* Contacto */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <a
                              href={`https://wa.me/${u.telefono?.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <Phone size={11} />
                              <span>{u.telefono || 'Sin teléfono'}</span>
                            </a>
                            <span className="text-slate-500 dark:text-slate-400 text-[10.5px] block truncate max-w-[170px]" title={u.correo}>
                              {u.correo}
                            </span>
                          </div>
                        </td>

                        {/* Rol */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleUserRole(u)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition ${
                              u.rol === 'admin'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400 hover:bg-amber-500/25'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-500'
                            }`}
                            title="Clic para alternar rol"
                          >
                            {u.rol === 'admin' ? '★ Admin General' : 'Colegiada'}
                          </button>
                        </td>

                        {/* Sello Oficial */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleUserVerify(u)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition inline-flex items-center gap-1 ${
                              u.verificada
                                ? 'bg-amber-500 text-[#050B18] border-amber-400 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700'
                            }`}
                            title="Clic para cambiar estado de verificación"
                          >
                            <ShieldCheck size={11} className={u.verificada ? 'text-[#050B18]' : 'text-slate-400'} />
                            <span>{u.verificada ? 'Verificada' : 'Pendiente'}</span>
                          </button>
                        </td>

                        {/* Estado */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition ${
                              u.estado === 'activa'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-400'
                                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-400'
                            }`}
                            title="Clic para suspender o reactivar cuenta"
                          >
                            {u.estado === 'activa' ? '● Activa' : '✕ Suspendida'}
                          </button>
                        </td>

                        {/* Acciones */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                            title="Eliminar registro"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No se encontraron usuarias con ese criterio de búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. PAGINACIÓN MODERNA (IDÉNTICA A LA DEL DIRECTORIO)               */}
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
