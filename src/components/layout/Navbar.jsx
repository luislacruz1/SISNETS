import React from 'react';
import { Menu } from 'lucide-react';
import { isMasculineName } from '../../utils/genderHelper';

export default function Navbar({
  isSidebarOpen,
  toggleSidebar,
  user,
  getUserInitials,
  onNavigateToAccount
}) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#0c1527] border-b border-slate-200 dark:border-slate-800 h-16 px-3 sm:px-8 flex items-center justify-between shadow-2xs transition-colors">
      {/* Izquierda: Botón de 3 Rayitas + Logo y Título Adaptable Estilo SISGEIN */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center transition active:scale-95 shrink-0"
          title="Menú lateral"
          aria-label="Alternar barra lateral"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/logo.png"
            onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
            alt="Logo SISNETS"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain sm:hidden shrink-0"
          />
          <span className="sm:hidden font-black text-sm tracking-tight text-[#0A1128] dark:text-white uppercase">
            SISNETS
          </span>
          <span className="hidden sm:inline font-['Inter',sans-serif] font-semibold text-xs tracking-widest text-slate-400 dark:text-slate-400 uppercase truncate">
            Sistema de Networking en Trabajo Social
          </span>
        </div>
      </div>

      {/* Derecha: Identidad de Usuaria + Avatar Squircle (Sin acción de cerrar sesión en las iniciales) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Nombre y Rol solo visibles en Desktop (como en SISGEIN) */}
        <div className="text-right hidden sm:block select-none">
          <span className="block font-bold text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 uppercase leading-tight tracking-tight truncate max-w-[200px]">
            {user?.nombre?.replace(/^(Mg\.|Lic\.|Dr\.|Dra\.|Bach\.)\s+/i, '') || user?.nombre}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
            {user?.rol === 'admin'
              ? (isMasculineName(user?.nombre) ? 'ADMINISTRADOR' : 'ADMINISTRADORA')
              : (user?.condicion === 'practicante'
                  ? 'PRACTICANTE'
                  : 'COLEGA')}
          </span>
        </div>

        {/* Avatar Squircle con Foto o Iniciales */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.nombre}
            onClick={() => onNavigateToAccount && onNavigateToAccount()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shrink-0 shadow-md cursor-pointer hover:scale-105 transition"
            title={`${user?.nombre} (Ir a Mi Cuenta)`}
          />
        ) : (
          <div
            onClick={() => onNavigateToAccount && onNavigateToAccount()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shrink-0 border border-white/15 select-none cursor-pointer hover:scale-105 transition"
            title={`${user?.nombre} (Ir a Mi Cuenta)`}
          >
            {getUserInitials(user?.nombre)}
          </div>
        )}
      </div>
    </header>
  );
}
