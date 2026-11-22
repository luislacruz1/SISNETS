import React from 'react';
import {
  Search,
  X,
  Download,
  Crown,
  Phone,
  ShieldCheck,
  Trash2
} from 'lucide-react';

export default function UsersManagement({
  userSearchTerm,
  setUserSearchTerm,
  userFilterRole,
  setUserFilterRole,
  filteredUsers = [],
  handleExportUsersCSV,
  handleToggleUserRole,
  handleToggleUserVerify,
  handleToggleUserStatus,
  handleDeleteUser
}) {
  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Búsqueda de Usuarias */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            placeholder="Buscar usuaria por nombre, correo, centro o sector..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
          />
          {userSearchTerm && (
            <button
              type="button"
              onClick={() => setUserSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'admin', label: 'Admins' },
            { id: 'egresada', label: 'Egresadas' },
            { id: 'practicante', label: 'Practicantes' },
            { id: 'verificadas', label: 'Verificadas' },
            { id: 'suspendidas', label: 'Suspendidas' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setUserFilterRole(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shrink-0 ${
                userFilterRole === f.id
                  ? 'bg-[#0A1128] dark:bg-cyan-500 text-white dark:text-[#050B18] shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleExportUsersCSV}
            className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shrink-0"
            title="Exportar usuarias a Excel / CSV"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Tabla de Gestión de Usuarias */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
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
    </div>
  );
}
