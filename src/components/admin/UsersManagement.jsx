import React, { useState, useMemo, useEffect } from 'react';
import {
  Crown,
  Phone,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pencil,
  Save,
  User,
  Search,
  MoreVertical,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { formatTitleCase } from '../../utils/genderHelper';

export default function UsersManagement({
  setUserSearchTerm,
  setUserFilterRole,
  filteredUsers = [],
  registeredUsers = [],
  handleToggleUserRole,
  handleToggleUserStatus,
  handleDeleteUser,
  handleUpdateUser,
  onOpenCreateModal
}) {
  // Estado para el modal de edición
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    rol: 'colegiada'
  });

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditForm({
      nombre: u.nombre || '',
      telefono: u.telefono || '',
      correo: u.correo || '',
      rol: (u.rol || 'colegiada').toLowerCase()
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({ nombre: '', telefono: '', correo: '', rol: 'colegiada' });
  };

  const handleSaveEdit = (e) => {
    if (e) e.preventDefault();
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      nombre: editForm.nombre.trim() || editingUser.nombre,
      telefono: editForm.telefono.trim() || editingUser.telefono,
      correo: editForm.correo.trim() || editingUser.correo,
      rol: editForm.rol || editingUser.rol || 'colegiada'
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
  const itemsPerPage = 6;

  // Reset de página si cambian los usuarios filtrados
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers]);

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, startIndex, itemsPerPage]);

  return (
    <div className="space-y-5">
      {/* VISTA EN CARDS PULIDA Y ELEGANTE */}
      {filteredUsers.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {paginatedUsers.map((u) => {
              const isAdmin = (u.rol || '').toLowerCase() === 'admin';
              const hasPhoto = Boolean(u.avatar && u.avatar !== '/logo.png' && u.avatar !== '/logo.svg');

              return (
                <motion.div
                  key={u.id || u.correo}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  className={`relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                    isAdmin
                      ? 'hover:border-amber-400/80 dark:hover:border-amber-500/80'
                      : 'hover:border-[#1E2B58]/40 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Barra Superior con Acento */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${
                      isAdmin
                        ? 'from-amber-400 via-orange-500 to-amber-600'
                        : 'from-[#1E2B58] via-[#16224D] to-[#0A1128] dark:from-slate-600 dark:to-slate-700'
                    }`}
                  />

                  <div>
                    {/* Cabecera: Avatar Persona / Foto, Nombre + Badges (Admin + Estado Activo), Botones */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Avatar: Foto o Persona */}
                        {hasPhoto ? (
                          <img
                            src={u.avatar}
                            alt={u.nombre}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-md transition-all"
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105 ${
                              isAdmin
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/25'
                                : 'bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white shadow-[#0A1128]/20 ring-1 ring-white/15'
                            }`}
                          >
                            {isAdmin ? <Crown size={22} /> : <User size={22} className="stroke-[2.2]" />}
                          </div>
                        )}

                        {/* Nombre + Badges inline */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base text-[#0A1128] dark:text-white leading-snug break-words transition-colors">
                            <span
                              className={`font-black transition-colors ${
                                isAdmin
                                  ? 'group-hover:text-amber-600 dark:group-hover:text-amber-400'
                                  : 'group-hover:text-[#1E2B58] dark:group-hover:text-cyan-400'
                              }`}
                            >
                              {formatTitleCase(u.nombre)}
                            </span>
                            {isAdmin ? (
                              <span className="inline-block ml-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40 align-middle whitespace-nowrap shadow-2xs">
                                ★ Admin
                              </span>
                            ) : (
                              <span className="inline-block ml-1.5 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-500 text-white align-middle whitespace-nowrap shadow-xs shadow-blue-500/25">
                                Colega
                              </span>
                            )}
                          </h4>
                        </div>
                      </div>

                      {/* Menú de Opciones (3 puntitos) */}
                      <div className="relative shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setOpenMenuUserId(openMenuUserId === u.id ? null : u.id)}
                          className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition"
                          title="Opciones de usuario"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuUserId === u.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setOpenMenuUserId(null)}
                            />
                            <div className="absolute right-0 top-9 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                              {/* 1. Designar / Quitar Administradora */}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuUserId(null);
                                  if (handleToggleUserRole) handleToggleUserRole(u);
                                }}
                                className={`w-full px-3.5 py-2 text-left font-bold flex items-center gap-2.5 transition ${
                                  isAdmin
                                    ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              >
                                <Crown size={14} className={isAdmin ? 'fill-amber-500 text-amber-500' : 'text-amber-500'} />
                                <span>{isAdmin ? 'Quitar Administradora' : 'Designar Administradora'}</span>
                              </button>

                              {/* 2. Editar */}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuUserId(null);
                                  openEditModal(u);
                                }}
                                className="w-full px-3.5 py-2 text-left font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                              >
                                <Pencil size={14} className="text-blue-500" />
                                <span>Editar datos</span>
                              </button>

                              {/* 3. Eliminar */}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuUserId(null);
                                  handleDeleteUser(u);
                                }}
                                className="w-full px-3.5 py-2 text-left font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition"
                              >
                                <Trash2 size={14} />
                                <span>Eliminar usuario</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bloque Unificado de Contacto (Estilo SaaS Ejecutivo) */}
                    <div className="mt-2.5 p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800/80 space-y-2 select-text cursor-default">
                      {/* Correo Electrónico */}
                      <div className="flex items-center gap-2.5 min-w-0" title={`Correo: ${u.correo}`}>
                        <div className="w-7 h-7 rounded-lg bg-[#1E2B58]/10 dark:bg-slate-700/60 text-[#1E2B58] dark:text-cyan-400 flex items-center justify-center shrink-0">
                          <Mail size={13} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                            Correo Electrónico
                          </span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-tight leading-snug mt-0.5 block truncate">
                            {u.correo || 'Sin correo'}
                          </span>
                        </div>
                      </div>

                      {/* Divisor sutil */}
                      <div className="border-t border-slate-200/60 dark:border-slate-800/60" />

                      {/* WhatsApp de Contacto */}
                      <div className="flex items-center gap-2.5 min-w-0" title={`WhatsApp: ${u.telefono || 'Sin teléfono'}`}>
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Phone size={13} className="fill-emerald-600 dark:fill-emerald-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                            WhatsApp
                          </span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-tight leading-snug mt-0.5 block truncate">
                            {u.telefono || 'Sin teléfono'}
                          </span>
                        </div>
                      </div>
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
            No se encontraron miembros
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            No hay registros que coincidan con la búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              if (setUserSearchTerm) setUserSearchTerm('');
              if (setUserFilterRole) setUserFilterRole('todos');
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E2B58] to-[#0A1128] text-white text-xs font-black uppercase tracking-wider shadow-sm hover:scale-105 active:scale-95 transition"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. PAGINACIÓN                                                      */}
      {/* ------------------------------------------------------------------ */}
      {filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 pb-2 border-t border-slate-200 dark:border-slate-800">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Mostrando <strong className="text-[#0A1128] dark:text-cyan-400">{startIndex + 1}</strong> - <strong className="text-[#0A1128] dark:text-cyan-400">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</strong> de <strong className="text-[#0A1128] dark:text-cyan-400">{filteredUsers.length}</strong> usuarios
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

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#1E2B58] to-[#0A1128] text-white shadow-sm ring-2 ring-blue-500/20 scale-105'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditModal}
              className="fixed inset-0 bg-[#050B18]/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden relative z-10"
            >
              {/* Barra superior con gradiente corporativo (Sidebar midnight navy) */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1E2B58] via-[#141E3E] to-[#0A1128]" />

              {/* Cabecera del Modal */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center shadow-md shadow-[#0A1128]/20 shrink-0">
                    <Pencil size={17} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0A1128] dark:text-white tracking-tight">
                      Editar Datos del Usuario
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Actualiza la información de contacto
                    </p>
                  </div>
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

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                {/* Tarjeta de Identidad Informativa (Solo lectura: Foto y Rol protegidos) */}
                <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {editingUser.avatar && editingUser.avatar !== '/logo.png' && editingUser.avatar !== '/logo.svg' ? (
                      <img
                        src={editingUser.avatar}
                        alt={editingUser.nombre}
                        onError={(e) => {
                          e.currentTarget.src = '/logo.png';
                        }}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <User size={18} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="block text-xs font-black text-[#0A1128] dark:text-white truncate">
                        {formatTitleCase(editingUser.nombre)}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {editingUser.rol === 'admin' ? 'Administradora del Sistema' : 'Colegiada de la Red'}
                      </span>
                    </div>
                  </div>

                  {/* Badge de Rol actual (informativo) */}
                  {editingUser.rol === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0 shadow-xs">
                      <Crown size={11} className="fill-amber-500" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs shadow-blue-500/25 shrink-0">
                      Colega
                    </span>
                  )}
                </div>

                {/* Campo: Nombre Completo */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <User size={13} className="text-[#1E2B58] dark:text-blue-400" />
                    <span>Nombre Completo</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mg. Stephanie Natalia Laos Arteaga"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 focus:border-[#1E2B58] dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition"
                  />
                </div>

                {/* Campo: WhatsApp de Contacto */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-emerald-500" />
                    <span>WhatsApp de Contacto</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+51 987 654 321"
                    value={editForm.telefono}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>

                {/* Campo: Correo Electrónico */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Mail size={13} className="text-[#1E2B58] dark:text-blue-400" />
                    <span>Correo Electrónico</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={editForm.correo}
                    onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 focus:border-[#1E2B58] dark:focus:ring-blue-500/30 dark:focus:border-blue-500 transition"
                  />
                </div>

                {/* Campo: Rol del Usuario (Designar o Quitar Admin) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Crown size={13} className="text-amber-500" />
                    <span>Rol en el Sistema</span>
                  </label>
                  <select
                    value={editForm.rol}
                    onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition cursor-pointer"
                  >
                    <option value="colegiada">Colegiada Activa (Acceso Estándar)</option>
                    <option value="admin">Administradora General (Control Total)</option>
                  </select>
                </div>

                {/* Botones de Acción */}
                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1E2B58] via-[#141E3E] to-[#0A1128] hover:from-[#25366D] hover:via-[#1A264F] hover:to-[#0D1533] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#0A1128]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
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
