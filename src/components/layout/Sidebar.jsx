import React from 'react';
import {
  LayoutDashboard,
  BookUser,
  Users,
  BarChart3,
  LogOut,
  KeyRound,
  X,
  FileText,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({
  isSidebarOpen,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  adminTab,
  setAdminTab,
  user,
  handleLogout,
  onOpenChangePassword
}) {
  return (
    <>
      {/* ==================================================================== */}
      {/* A. SIDEBAR FIJO EN ESCRITORIO (md y superior)                        */}
      {/* ==================================================================== */}
      <aside className={`hidden md:flex flex-col fixed inset-y-0 left-0 bg-gradient-to-b from-[#0B132B] via-[#0A1128] to-[#060B18] text-white border-r border-slate-800/80 z-40 select-none shadow-[4px_0_24px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>

        {/* 1. Header con Branding SISNETS Agrandado */}
        <div className={`border-b border-white/[0.08] flex items-center transition-all duration-300 ${
          isSidebarOpen ? 'p-4 sm:p-5 gap-3.5' : 'p-3.5 justify-center'
        }`}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-transparent p-2 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 group">
            <img
              src="/logo.png"
              onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
              alt="Logo SISNETS"
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform"
              title="SISNETS · Sistema de Networking en Trabajo Social"
            />
          </div>
          {isSidebarOpen && (
            <div className="min-w-0 overflow-hidden whitespace-nowrap">
              <span className="block font-black text-xl tracking-wider text-white uppercase leading-none truncate">
                SISNETS
              </span>
              <span className="block text-[10px] font-bold text-cyan-400 tracking-widest uppercase mt-1 leading-none truncate">
                Trabajo Social
              </span>
            </div>
          )}
        </div>

        {/* 2. Navegación Principal Mejorada */}
        <div className={`flex-1 overflow-y-auto space-y-6 custom-scrollbar transition-all duration-300 ${
          isSidebarOpen ? 'px-3 py-5' : 'px-2 py-4'
        }`}>
          <div>
            {isSidebarOpen ? (
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                Navegación
              </span>
            ) : (
              <div className="h-1" />
            )}
            <div className="space-y-2">
              {/* TAB 1 (ADMIN): DASHBOARD EJECUTIVO ESTILO SISGEIN */}
              {user?.rol === 'admin' && (
                <button
                  type="button"
                  onClick={() => setAdminTab('dashboard')}
                  className={`w-full rounded-2xl transition-all duration-200 group relative ${
                    isSidebarOpen
                      ? 'px-3.5 py-3 text-xs font-bold flex items-center gap-3'
                      : 'w-11 h-11 mx-auto flex items-center justify-center'
                  } ${
                    (adminTab === 'dashboard' || adminTab === 'metricas')
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                  title="Dashboard"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    (adminTab === 'dashboard' || adminTab === 'metricas')
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                      : 'bg-white/[0.04] text-slate-400 group-hover:text-cyan-300 group-hover:bg-white/[0.08]'
                  }`}>
                    <LayoutDashboard size={17} />
                  </div>
                  {isSidebarOpen && (
                    <>
                      <span className="font-bold text-xs truncate">Dashboard</span>
                      {(adminTab === 'dashboard' || adminTab === 'metricas') && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                      )}
                    </>
                  )}
                </button>
              )}

              {/* Tab: Directorio Vivo */}
              <button
                type="button"
                onClick={() => setAdminTab('directorio')}
                className={`w-full rounded-2xl transition-all duration-200 group relative ${
                  isSidebarOpen
                    ? 'px-3.5 py-3 text-xs font-bold flex items-center gap-3'
                    : 'w-11 h-11 mx-auto flex items-center justify-center'
                } ${
                  adminTab === 'directorio'
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                title="Directorio"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  adminTab === 'directorio'
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                    : 'bg-white/[0.04] text-slate-400 group-hover:text-cyan-300 group-hover:bg-white/[0.08]'
                }`}>
                  <BookUser size={17} />
                </div>
                {isSidebarOpen && (
                  <>
                    <span className="font-bold text-xs truncate">Directorio</span>
                    {adminTab === 'directorio' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                    )}
                  </>
                )}
              </button>

              {/* TABS PARA ADMINISTRADORAS */}
              {user?.rol === 'admin' && (
                <>
                  {/* Tab: Usuarios */}
                  <button
                    type="button"
                    onClick={() => setAdminTab('usuarios')}
                    className={`w-full rounded-2xl transition-all duration-200 group relative ${
                      isSidebarOpen
                        ? 'px-3.5 py-3 text-xs font-bold flex items-center gap-3'
                        : 'w-11 h-11 mx-auto flex items-center justify-center'
                    } ${
                      adminTab === 'usuarios'
                        ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                    title="Usuarios"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      adminTab === 'usuarios'
                        ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                        : 'bg-white/[0.04] text-slate-400 group-hover:text-cyan-300 group-hover:bg-white/[0.08]'
                    }`}>
                      <Users size={17} />
                    </div>
                    {isSidebarOpen && (
                      <>
                        <span className="font-bold text-xs truncate">Usuarios</span>
                        {adminTab === 'usuarios' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                        )}
                      </>
                    )}
                  </button>
                </>
              )}

              {/* TABS PARA COLEGIADAS / USUARIAS GENERALES */}
              {user?.rol !== 'admin' && (
                <>
                  {/* Tab Mis Fichas */}
                  <button
                    type="button"
                    onClick={() => setAdminTab('mis-fichas')}
                    className={`w-full rounded-2xl transition-all duration-200 group relative ${
                      isSidebarOpen
                        ? 'px-3.5 py-3 text-xs font-bold flex items-center gap-3'
                        : 'w-11 h-11 mx-auto flex items-center justify-center'
                    } ${
                      adminTab === 'mis-fichas'
                        ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                    title="Mis Fichas Publicadas"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      adminTab === 'mis-fichas'
                        ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                        : 'bg-white/[0.04] text-slate-400 group-hover:text-cyan-300 group-hover:bg-white/[0.08]'
                    }`}>
                      <FileText size={17} />
                    </div>
                    {isSidebarOpen && (
                      <>
                        <span className="font-bold text-xs truncate">Mis Fichas</span>
                        {adminTab === 'mis-fichas' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                        )}
                      </>
                    )}
                  </button>
                </>
              )}

              {/* TAB COMÚN: MI CUENTA (Para todas las usuarias y administradoras) */}
              <button
                type="button"
                onClick={() => setAdminTab('cuenta')}
                className={`w-full rounded-2xl transition-all duration-200 group relative ${
                  isSidebarOpen
                    ? 'px-3.5 py-3 text-xs font-bold flex items-center gap-3'
                    : 'w-11 h-11 mx-auto flex items-center justify-center'
                } ${
                  adminTab === 'cuenta'
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
                title="Mi Cuenta & Perfil"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  adminTab === 'cuenta'
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                    : 'bg-white/[0.04] text-slate-400 group-hover:text-cyan-300 group-hover:bg-white/[0.08]'
                }`}>
                  <UserCircle size={17} />
                </div>
                {isSidebarOpen && (
                  <>
                    <span className="font-bold text-xs truncate">Mi Cuenta</span>
                    {adminTab === 'cuenta' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Pie con Botón Cerrar Sesión */}
        <div className={`border-t border-white/[0.08] bg-[#060B18]/90 mt-auto transition-all duration-300 ${
          isSidebarOpen ? 'p-3.5' : 'p-2.5 flex flex-col items-center'
        }`}>
          {isSidebarOpen ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-3.5 py-3 rounded-2xl bg-white/[0.03] hover:bg-rose-500/15 text-slate-300 hover:text-white border border-white/[0.06] hover:border-rose-500/40 flex items-center gap-3 transition-all duration-200 group shadow-sm active:scale-[0.98]"
              title="Cerrar Sesión del Sistema"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
                <LogOut size={16} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="block font-bold text-xs leading-none text-slate-200 group-hover:text-white transition-colors">
                  Cerrar Sesión
                </span>
                <span className="block text-[10px] text-slate-400 group-hover:text-rose-300 font-medium mt-1 leading-none transition-colors">
                  Salir de la cuenta
                </span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="w-11 h-11 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/[0.06] hover:border-rose-500/30 flex items-center justify-center transition-all mx-auto group active:scale-95 shadow-sm"
              title="Cerrar Sesión"
            >
              <LogOut size={17} className="group-hover:rotate-6 transition-transform" />
            </button>
          )}
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* B. DRAWER MÓVIL CON ANIMATEPRESENCE                                  */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-gradient-to-b from-[#0B132B] via-[#0A1128] to-[#060B18] text-white z-50 flex flex-col border-r border-slate-800/80 md:hidden shadow-2xl"
            >
              {/* Header del Drawer Móvil */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-transparent p-2 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/15">
                    <img
                      src="/logo.png"
                      onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
                      alt="Logo SISNETS"
                      className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-black text-lg uppercase block text-white tracking-wider leading-none truncate">
                      SISNETS
                    </span>
                    <span className="block text-[9px] font-bold text-cyan-400 tracking-widest uppercase mt-0.5 leading-none">
                      Trabajo Social
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition border border-white/[0.06]"
                  aria-label="Cerrar menú"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Menú de Navegación Móvil */}
              <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6 custom-scrollbar">
                <div>
                  <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
                    Navegación
                  </span>
                  <div className="space-y-2">
                    {/* TAB 1 (ADMIN): DASHBOARD */}
                    {user?.rol === 'admin' && (
                      <button
                        type="button"
                        onClick={() => { setAdminTab('dashboard'); setIsMobileSidebarOpen(false); }}
                        className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                          (adminTab === 'dashboard' || adminTab === 'metricas')
                            ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          (adminTab === 'dashboard' || adminTab === 'metricas')
                            ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                            : 'text-slate-400 bg-white/[0.04]'
                        }`}>
                          <LayoutDashboard size={17} />
                        </div>
                        <span>Dashboard</span>
                        {(adminTab === 'dashboard' || adminTab === 'metricas') && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                        )}
                      </button>
                    )}

                    {/* Tab: Directorio */}
                    <button
                      type="button"
                      onClick={() => { setAdminTab('directorio'); setIsMobileSidebarOpen(false); }}
                      className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                        adminTab === 'directorio'
                          ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        adminTab === 'directorio'
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                          : 'text-slate-400 bg-white/[0.04]'
                      }`}>
                        <BookUser size={17} />
                      </div>
                      <span>Directorio</span>
                      {adminTab === 'directorio' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                      )}
                    </button>

                    {user?.rol === 'admin' && (
                      <>
                        <button
                          type="button"
                          onClick={() => { setAdminTab('usuarios'); setIsMobileSidebarOpen(false); }}
                          className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                            adminTab === 'usuarios'
                              ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            adminTab === 'usuarios'
                              ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                              : 'text-slate-400 bg-white/[0.04]'
                          }`}>
                            <Users size={17} />
                          </div>
                          <span>Usuarios</span>
                          {adminTab === 'usuarios' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                          )}
                        </button>
                      </>
                    )}

                    {/* Tabs de Colegiada en Móvil */}
                    {user?.rol !== 'admin' && (
                      <>
                        <button
                          type="button"
                          onClick={() => { setAdminTab('mis-fichas'); setIsMobileSidebarOpen(false); }}
                          className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                            adminTab === 'mis-fichas'
                              ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            adminTab === 'mis-fichas'
                              ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                              : 'text-slate-400 bg-white/[0.04]'
                          }`}>
                            <FileText size={17} />
                          </div>
                          <span>Mis Fichas</span>
                          {adminTab === 'mis-fichas' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                          )}
                        </button>
                      </>
                    )}

                    {/* Tab Común en Móvil: Mi Cuenta */}
                    <button
                      type="button"
                      onClick={() => { setAdminTab('cuenta'); setIsMobileSidebarOpen(false); }}
                      className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                        adminTab === 'cuenta'
                          ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-4 border-l-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        adminTab === 'cuenta'
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-[#050B18] shadow-md shadow-cyan-400/30'
                          : 'text-slate-400 bg-white/[0.04]'
                      }`}>
                        <UserCircle size={17} />
                      </div>
                      <span>Mi Cuenta</span>
                      {adminTab === 'cuenta' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 ml-auto animate-pulse" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón Cerrar Sesión en Drawer Móvil */}
              <div className="p-3.5 border-t border-white/[0.08] bg-[#060B18]/90 mt-auto">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-3.5 py-3 rounded-2xl bg-white/[0.03] hover:bg-rose-500/15 text-slate-300 hover:text-white border border-white/[0.06] hover:border-rose-500/40 flex items-center gap-3 transition-all text-xs font-bold group shadow-sm active:scale-[0.98]"
                  title="Cerrar Sesión"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
                    <LogOut size={16} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <span className="block font-bold text-xs leading-none text-slate-200 group-hover:text-white transition-colors">
                      Cerrar Sesión
                    </span>
                    <span className="block text-[10px] text-slate-400 group-hover:text-rose-300 font-medium mt-1 leading-none transition-colors">
                      Salir de la cuenta
                    </span>
                  </div>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
