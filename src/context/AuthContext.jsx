import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * PROVEEDOR DE AUTENTICACIÓN Y SEGURIDAD RBAC (Role-Based Access Control)
 * Basado en la arquitectura de seguridad de SIMEC (Mantenimiento de Equipos)
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Error restaurando sesión de usuario:', e);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    if (!userData) return;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event('sisnets_auth_changed'));
  };

  const updateUser = (partialData) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sisnets_active_admin_tab');
    setUser(null);
    window.dispatchEvent(new Event('sisnets_auth_changed'));
  };

  /**
   * Comprueba si el usuario tiene un rol determinado
   * El rol 'admin' posee acceso maestro y hereda privilegios
   */
  const hasRole = (requiredRole) => {
    if (!user) return false;
    const currentRole = (user.rol || '').toLowerCase();
    const reqRole = (requiredRole || '').toLowerCase();
    if (currentRole === 'admin') return true;
    return currentRole === reqRole;
  };

  /**
   * Comprueba si el usuario tiene un permiso específico (RBAC idéntico a SIMEC)
   */
  const hasPermission = (permissionCode) => {
    if (!user) return false;

    // Administradores tienen acceso total
    const currentRole = (user.rol || '').toUpperCase();
    if (currentRole.includes('ADMIN')) return true;

    // Permisos atómicos
    const userPermissions = Array.isArray(user.permisos) ? user.permisos : [];
    
    // Matriz de permisos predeterminados por rol
    if (currentRole === 'COLEGIADA') {
      const defaultColegiadaPerms = [
        'VIEW_DIRECTORIO',
        'PUBLISH_FICHA',
        'EDIT_OWN_FICHA',
        'EXPORT_VCARD'
      ];
      if (defaultColegiadaPerms.includes(permissionCode)) return true;
    }

    return userPermissions.includes(permissionCode);
  };

  const isAdmin = (user?.rol || '').toLowerCase() === 'admin';
  const isColegiada = (user?.rol || '').toLowerCase() === 'colegiada';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        updateUser,
        logout,
        loading,
        hasRole,
        hasPermission,
        isAdmin,
        isColegiada
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
