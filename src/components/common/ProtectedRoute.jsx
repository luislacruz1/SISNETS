import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * COMPONENTE DE PROTECCIÓN DE RUTAS (RBAC)
 * Copiado y adaptado directamente de ProtectedRoute.jsx de SIMEC (Mantenimiento de Equipos)
 */
export default function ProtectedRoute({ children, requiredRole, permission }) {
  const { user, loading, hasRole, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-cyan-600 dark:text-cyan-400" size={42} />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Verificando Credenciales...
          </p>
        </div>
      </div>
    );
  }

  // Si no hay usuario logueado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se exige un rol específico y no lo cumple
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  // Si se exige un permiso específico y no lo tiene
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
