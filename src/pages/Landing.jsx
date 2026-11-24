import React, { useState, useMemo, useEffect } from 'react';
import {
  BookUser,
  Users,
  UserCheck,
  BarChart3,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  ShieldCheck,
  Edit3,
  RotateCw,
  Check,
  Building2,
  GraduationCap,
  Crown,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

import { useAuth } from '../context/AuthContext';
import AuthSection from '../components/AuthSection';
import PublishSupportModal from '../components/PublishSupportModal';
import CreateUserModal from '../components/admin/CreateUserModal';
import ChangePasswordModal from '../components/common/ChangePasswordModal';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ColleagueCard from '../components/directory/ColleagueCard';
import UsersManagement from '../components/admin/UsersManagement';
import MetricsView from '../components/admin/MetricsView';
import PublicLanding from '../components/public/PublicLanding';
import { INITIAL_REGISTERED_USERS, ADMIN_RUTH_USER, LUIS_LACRUZ_USER } from '../data/demoData';
import { isMasculineName } from '../utils/genderHelper';
import {
  cleanAndMergeUsers,
  fetchRemoteUsers,
  saveRemoteUser,
  updateRemoteUser,
  deleteRemoteUser,
  fetchRemoteDirectorio,
  saveRemoteDirectorioCard,
  updateRemoteDirectorioCard,
  deleteRemoteDirectorioCard,
  subscribeToCloudChanges
} from '../lib/dataSyncService';

// Opciones del filtro desplegable moderno por condición
const FILTER_OPTIONS = [
  {
    id: 'Todos',
    label: 'Todas las Colegas',
    sublabel: 'Directorio completo',
    icon: Users,
    badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
    activeColor: 'text-blue-600 dark:text-cyan-400'
  },
  {
    id: 'egresada',
    label: 'Egresada(o)',
    sublabel: 'Tituladas y graduadas',
    icon: Building2,
    badgeColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-200/60 dark:border-fuchsia-800/40',
    activeColor: 'text-fuchsia-600 dark:text-fuchsia-400'
  },
  {
    id: 'practicante',
    label: 'Practicante',
    sublabel: 'Prácticas pre-profesionales',
    icon: GraduationCap,
    badgeColor: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border-violet-200/60 dark:border-violet-800/40',
    activeColor: 'text-violet-600 dark:text-violet-400'
  }
];

// Opciones del selector desplegable para usuarios
const USER_FILTER_OPTIONS = [
  {
    id: 'todos',
    label: 'Todos los Miembros',
    sublabel: 'Comunidad completa',
    icon: Users,
    badgeColor: 'bg-slate-100 dark:bg-slate-800 text-[#0A1128] dark:text-cyan-400 border-slate-200 dark:border-slate-700',
    activeColor: 'text-[#0A1128] dark:text-cyan-400'
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
    id: 'suspendidas',
    label: 'Cuentas Pausadas',
    sublabel: 'Acceso suspendido temporal',
    icon: UserX,
    badgeColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40',
    activeColor: 'text-rose-600 dark:text-rose-400'
  }
];

export default function Landing() {
  const { user, logout, login } = useAuth();

  // Estados de vista y modales
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user?.debeCambiarPassword) {
      setIsChangePassModalOpen(true);
    }
  }, [user]);

  // Control del Panel de Navegación persistente en recarga (F5)
  const [adminTab, setAdminTabState] = useState(() => {
    try {
      const savedTab = localStorage.getItem('sisnets_active_admin_tab');
      if (savedTab && ['directorio', 'usuarios', 'metricas'].includes(savedTab)) {
        return savedTab;
      }
    } catch (e) {
      console.error(e);
    }
    return 'directorio';
  });

  const setAdminTab = (tab) => {
    setAdminTabState(tab);
    try {
      localStorage.setItem('sisnets_active_admin_tab', tab);
    } catch (e) {
      console.error(e);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Control de colapso en escritorio
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Drawer móvil
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('todos');

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  // Gestión de Usuarios Registrados en el Colegio / Red (con Ruth Anastacio asegurada y editable)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('usuarios_colegio');
      if (stored) {
        const parsed = JSON.parse(stored);
        return cleanAndMergeUsers(parsed);
      }
    } catch (e) {
      console.error(e);
    }
    return [ADMIN_RUTH_USER, LUIS_LACRUZ_USER];
  });

  // Guardar usuarias en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem('usuarios_colegio', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  // Sincronización automática de usuarios al enfocar la ventana o cambiar el almacenamiento
  useEffect(() => {
    const syncUsersFromStorage = () => {
      try {
        const stored = localStorage.getItem('usuarios_colegio');
        if (stored) {
          const parsed = JSON.parse(stored);
          const merged = cleanAndMergeUsers(parsed);
          setRegisteredUsers((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(merged)) {
              return merged;
            }
            return prev;
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', syncUsersFromStorage);
    window.addEventListener('focus', syncUsersFromStorage);
    window.addEventListener('sisnets_users_updated', syncUsersFromStorage);
    return () => {
      window.removeEventListener('storage', syncUsersFromStorage);
      window.removeEventListener('focus', syncUsersFromStorage);
      window.removeEventListener('sisnets_users_updated', syncUsersFromStorage);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: '¿Deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0A1128',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
      }
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'TS';
    const cleaned = name.replace(/^(Mg\.|Lic\.|Dr\.|Dra\.|Bach\.)\s+/i, '');
    const parts = cleaned.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Estado del Directorio (Limpio de fichas demo)
  const [mentorCards, setMentorCards] = useState(() => {
    try {
      const stored = localStorage.getItem('directorio_colegas');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c) => !c.id?.startsWith('demo_'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem('directorio_colegas', JSON.stringify(mentorCards));
    } catch (e) {
      console.error(e);
    }
  }, [mentorCards]);

  // Función de sincronización del Directorio y Usuarios (Nube Supabase + Respaldo Local)
  const syncDirectorio = async (isBackground = false) => {
    try {
      if (!isBackground) setIsRefreshing(true);

      // 1. Sincronizar directorio desde la nube Supabase
      const cloudCards = await fetchRemoteDirectorio();
      if (cloudCards && Array.isArray(cloudCards)) {
        setMentorCards((prev) => {
          // Preservar fichas agregadas localmente que aún no hayan terminado de propagarse en la nube
          const cloudIds = new Set(cloudCards.map((c) => String(c.id)));
          const localOnly = (prev || []).filter(
            (p) => p && !cloudIds.has(String(p.id)) && !String(p.id).startsWith('demo_')
          );
          return [...localOnly, ...cloudCards];
        });
      } else {
        const stored = localStorage.getItem('directorio_colegas');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const cleanCards = parsed.filter((c) => c && !String(c.id).startsWith('demo_'));
            setMentorCards((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(cleanCards)) {
                return cleanCards;
              }
              return prev;
            });
          }
        }
      }

      // 2. Sincronizar usuarios desde la nube Supabase
      const cloudUsers = await fetchRemoteUsers();
      if (cloudUsers && Array.isArray(cloudUsers)) {
        setRegisteredUsers(cloudUsers);
      } else {
        const storedUsers = localStorage.getItem('usuarios_colegio');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          const mergedUsers = cleanAndMergeUsers(parsedUsers);
          setRegisteredUsers((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(mergedUsers)) {
              return mergedUsers;
            }
            return prev;
          });
        }
      }
    } catch (e) {
      console.error('Error sincronizando:', e);
    } finally {
      if (!isBackground) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // SINCRONIZACIÓN EN TIEMPO REAL (WebSockets + Reloj de 20s + Eventos Locales)
  useEffect(() => {
    // 1. Carga inicial inmediata desde la nube
    syncDirectorio(false);

    // 2. Suscripción instantánea a cambios en la nube por WebSocket (< 1 segundo)
    const unsubscribeCloud = subscribeToCloudChanges(() => {
      syncDirectorio(true);
    });

    // 3. Sincronización instantánea ante eventos entre pestañas o eventos locales
    const handleStorageChange = (e) => {
      if (e.key === 'directorio_colegas' || e.key === 'usuarios_colegio') {
        syncDirectorio(true);
      }
    };
    const handleDirectorioEvent = () => syncDirectorio(true);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sisnets_directorio_updated', handleDirectorioEvent);
    window.addEventListener('sisnets_users_updated', handleDirectorioEvent);

    // 4. Reloj maestro de Short Polling: ciclo cada 20 segundos (Garantía continua)
    const pollingInterval = setInterval(() => {
      syncDirectorio(true);
    }, 20000);

    return () => {
      unsubscribeCloud();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sisnets_directorio_updated', handleDirectorioEvent);
      window.removeEventListener('sisnets_users_updated', handleDirectorioEvent);
      clearInterval(pollingInterval);
    };
  }, []);

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [openMenuCardId, setOpenMenuCardId] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, itemsPerPage]);

  const handleAddNewSupport = async (newCard) => {
    const cardWithStatus = {
      ...newCard,
      verificada: user?.rol === 'admin' ? true : !!newCard.verificada
    };

    // 1. Actualizar estado y sincronizar en localStorage de inmediato
    setMentorCards((prev) => [cardWithStatus, ...prev.filter((c) => c.id !== cardWithStatus.id)]);
    try {
      const stored = JSON.parse(localStorage.getItem('directorio_colegas') || '[]');
      const updatedCards = [cardWithStatus, ...stored.filter((c) => c.id !== cardWithStatus.id)];
      localStorage.setItem('directorio_colegas', JSON.stringify(updatedCards));
    } catch (e) {
      console.error(e);
    }
    setCurrentPage(1);

    // Guardar en la nube Supabase de inmediato
    await saveRemoteDirectorioCard(cardWithStatus);

    // 2. Sincronizar en lista de usuarias registradas
    const exists = registeredUsers.some((u) => u.correo?.toLowerCase() === cardWithStatus.correo?.toLowerCase());
    if (!exists) {
      const newUserFromCard = {
        id: 'usr_' + Date.now(),
        nombre: cardWithStatus.nombre,
        correo: cardWithStatus.correo || `usuario_${Date.now()}@sisnets.pe`,
        telefono: cardWithStatus.telefono,
        rol: user?.rol === 'admin' ? 'admin' : 'colegiada',
        condicion: cardWithStatus.condicion,
        centro: cardWithStatus.institucion,
        sector: cardWithStatus.sector || 'Comunitario / ONGs',
        estado: 'activa',
        verificada: !!cardWithStatus.verificada,
        fechaRegistro: new Date().toLocaleDateString('es-PE')
      };
      const updatedUsers = cleanAndMergeUsers([...registeredUsers, newUserFromCard]);
      setRegisteredUsers(updatedUsers);
      try {
        localStorage.setItem('usuarios_colegio', JSON.stringify(updatedUsers));
      } catch (e) {
        console.error(e);
      }
      saveRemoteUser(newUserFromCard);
    }

    Swal.fire({
      icon: 'success',
      title: '¡Centro Publicado en la Red!',
      text: 'Tu ficha ya está visible para todas las colegas con tu contacto de WhatsApp.',
      confirmButtonColor: '#0A1128',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleToggleUserRole = (targetUser) => {
    const nuevoRol = targetUser.rol === 'admin' ? 'colegiada' : 'admin';
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, rol: nuevoRol } : u))
    );
    updateRemoteUser(targetUser.id, { rol: nuevoRol });

    Swal.fire({
      icon: 'success',
      title: 'Rol Actualizado',
      text: `${targetUser.nombre} ahora tiene el rol de "${nuevoRol === 'admin' ? 'Administradora General' : 'Colegiada Activa'}".`,
      confirmButtonColor: '#0A1128',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleToggleUserStatus = (targetUser) => {
    const nuevoEstado = targetUser.estado === 'activa' ? 'suspendida' : 'activa';
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, estado: nuevoEstado } : u))
    );
    updateRemoteUser(targetUser.id, { estado: nuevoEstado });

    Swal.fire({
      icon: nuevoEstado === 'activa' ? 'success' : 'warning',
      title: nuevoEstado === 'activa' ? 'Cuenta Reactivada' : 'Cuenta Suspendida',
      text: `${targetUser.nombre} ha sido ${nuevoEstado === 'activa' ? 'reactivada en la red' : 'suspendida temporalmente'}.`,
      confirmButtonColor: '#0A1128',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleToggleUserVerify = (targetUser) => {
    const nuevoEstado = !targetUser.verificada;
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, verificada: nuevoEstado } : u))
    );
    setMentorCards((prev) =>
      prev.map((c) => {
        if (c.correo?.toLowerCase() === targetUser.correo?.toLowerCase() || c.nombre === targetUser.nombre) {
          return { ...c, verificada: nuevoEstado };
        }
        return c;
      })
    );
    updateRemoteUser(targetUser.id, { verificada: nuevoEstado });
    updateRemoteDirectorioCard(targetUser.id, { verificada: nuevoEstado });

    Swal.fire({
      icon: nuevoEstado ? 'success' : 'info',
      title: nuevoEstado ? '¡Colegiada Verificada!' : 'Verificación Retirada',
      text: `${targetUser.nombre} ahora tiene el estado: ${nuevoEstado ? 'Verificada con Sello Oficial' : 'Pendiente'}.`,
      confirmButtonColor: '#0A1128',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleDeleteUser = (targetUser) => {
    Swal.fire({
      title: '¿Eliminar Usuaria?',
      text: `Se retirará el acceso de ${targetUser.nombre} (${targetUser.correo}).`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#0A1128',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        setRegisteredUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
        deleteRemoteUser(targetUser.id);
        Swal.fire({
          icon: 'success',
          title: 'Usuaria Eliminada',
          text: 'El registro ha sido removido.',
          confirmButtonColor: '#0A1128',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleUpdateUser = (updatedData) => {
    const updated = registeredUsers.map((u) => (u.id === updatedData.id ? { ...u, ...updatedData } : u));
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('usuarios_colegio', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    updateRemoteUser(updatedData.id, updatedData);

    // Si la usuaria actualizada es la usuaria activa en sesión, actualizar sesión también
    if (user && (user.id === updatedData.id || user.correo?.toLowerCase() === updatedData.correo?.toLowerCase())) {
      login({ ...user, ...updatedData });
    }
  };

  const handleExportCSV = () => {
    if (mentorCards.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Directorio Vacío',
        text: 'No hay fichas registradas para exportar.',
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    const headers = ['Nombre Completo', 'Condición', 'Centro Institucional', 'Sector', 'WhatsApp', 'Correo Electrónico', 'Temáticas de Apoyo / Fortalezas', 'Sello Verificado'];
    const rows = mentorCards.map((c) => [
      `"${(c.nombre || '').replace(/"/g, '""')}"`,
      `"${(c.tipo || c.condicion || '').replace(/"/g, '""')}"`,
      `"${(c.institucion || '').replace(/"/g, '""')}"`,
      `"${(c.sector || '').replace(/"/g, '""')}"`,
      `"${(c.telefono || '').replace(/"/g, '""')}"`,
      `"${(c.correo || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(c.fortalezas) ? c.fortalezas.join('; ') : c.apoyo || '').replace(/"/g, '""')}"`,
      `"${c.verificada ? 'Verificada con Sello Oficial' : 'Pendiente'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Directorio_Trabajo_Social_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: '¡Directorio Exportado!',
      text: 'El archivo Excel / CSV se ha descargado a tu equipo.',
      confirmButtonColor: '#0A1128',
      timer: 1800,
      showConfirmButton: false
    });
  };

  const handleExportUsersCSV = () => {
    if (registeredUsers.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin usuarias',
        text: 'No hay usuarias registradas para exportar.',
        confirmButtonColor: '#0A1128'
      });
      return;
    }

    const headers = ['Nombre Completo', 'Correo Electrónico', 'WhatsApp', 'Rol', 'Condición', 'Centro', 'Sector', 'Estado', 'Verificada', 'Fecha Registro'];
    const rows = registeredUsers.map((u) => [
      `"${(u.nombre || '').replace(/"/g, '""')}"`,
      `"${(u.correo || '').replace(/"/g, '""')}"`,
      `"${(u.telefono || '').replace(/"/g, '""')}"`,
      `"${u.rol === 'admin' ? 'Administradora' : 'Colegiada'}"`,
      `"${u.condicion === 'egresada' ? 'Egresada' : 'Practicante'}"`,
      `"${(u.centro || '').replace(/"/g, '""')}"`,
      `"${(u.sector || '').replace(/"/g, '""')}"`,
      `"${u.estado || 'activa'}"`,
      `"${u.verificada ? 'Sí' : 'No'}"`,
      `"${u.fechaRegistro || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Usuarias_Red_Trabajo_Social_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: '¡Lista de Usuarias Exportada!',
      text: 'El archivo se ha descargado a tu equipo.',
      confirmButtonColor: '#0A1128',
      timer: 1800,
      showConfirmButton: false
    });
  };

  const handleClearAllCards = () => {
    Swal.fire({
      title: '¿Vaciar Todo el Directorio?',
      text: 'Se eliminarán todas las publicaciones para empezar 100% desde cero.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#0A1128',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        setMentorCards([]);
        setCurrentPage(1);
        localStorage.removeItem('directorio_colegas');
        Swal.fire({
          icon: 'success',
          title: 'Directorio Limpio',
          text: 'Todas las fichas han sido retiradas.',
          confirmButtonColor: '#0A1128',
          timer: 1600,
          showConfirmButton: false
        });
      }
    });
  };

  const handleContactClick = (card) => {
    const textoMensaje = `Hola ${card.nombre}, te escribo desde SISNETS para coordinar apoyo profesional en: ${card.institucion}.`;
    window.open(
      `https://wa.me/${card.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(textoMensaje)}`,
      '_blank'
    );
  };

  const handleDeleteCard = (card) => {
    Swal.fire({
      title: '¿Retirar Ficha del Directorio?',
      text: `¿Estás segura de eliminar la ficha de "${card.nombre}" en ${card.institucion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#0A1128',
      confirmButtonText: 'Sí, retirar ficha',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setMentorCards((prev) => prev.filter((c) => c.id !== card.id));
        deleteRemoteDirectorioCard(card.id);
        Swal.fire({
          icon: 'success',
          title: 'Ficha Retirada',
          text: 'La publicación ha sido eliminada del directorio.',
          confirmButtonColor: '#0A1128',
          timer: 1600,
          showConfirmButton: false
        });
      }
    });
  };

  const handleEditCard = async (card) => {
    const isPracticante = card.condicion === 'practicante' || card.tipo?.toLowerCase().includes('practicante');
    const labelInstitucion = isPracticante ? 'Centro de Prácticas:' : 'Centro Laboral Actual:';

    const { value: formValues } = await Swal.fire({
      title: 'Editar Ficha del Directorio',
      html:
        `<div class="space-y-3 text-left">` +
        `<label class="block text-xs font-bold text-slate-700">Nombre Completo:</label>` +
        `<input id="swal-nombre" class="swal2-input !mt-0 !w-full text-xs" value="${card.nombre}">` +
        `<label class="block text-xs font-bold text-slate-700">${labelInstitucion}</label>` +
        `<input id="swal-institucion" class="swal2-input !mt-0 !w-full text-xs" value="${card.institucion}">` +
        `<label class="block text-xs font-bold text-slate-700">Cargo que Ocupas:</label>` +
        `<input id="swal-cargo" class="swal2-input !mt-0 !w-full text-xs" value="${card.cargo || card.sector || ''}">` +
        `<label class="block text-xs font-bold text-slate-700">WhatsApp de Contacto:</label>` +
        `<input id="swal-telefono" class="swal2-input !mt-0 !w-full text-xs" value="${card.telefono}">` +
        `<label class="block text-xs font-bold text-slate-700">Temáticas de orientación / apoyo:</label>` +
        `<textarea id="swal-apoyo" class="swal2-textarea !mt-0 !w-full text-xs">${card.apoyo}</textarea>` +
        `</div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0A1128',
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value;
        const institucion = document.getElementById('swal-institucion').value;
        const cargo = document.getElementById('swal-cargo').value;
        const telefono = document.getElementById('swal-telefono').value;
        const apoyo = document.getElementById('swal-apoyo').value;
        if (!nombre || !institucion || !telefono) {
          Swal.showValidationMessage('Por favor completa nombre, centro y teléfono');
          return false;
        }
        const isPract = card.condicion === 'practicante' || card.tipo?.toLowerCase().includes('practicante');
        const updatedTipo = isPract ? 'Practicante' : (isMasculineName(nombre) ? 'Egresado' : 'Egresada');
        return {
          nombre,
          institucion,
          tipo: updatedTipo,
          cargo: cargo.trim(),
          sector: (card.sector && card.sector.toLowerCase() !== 'abogada' && card.sector.toLowerCase() !== cargo.trim().toLowerCase()) ? card.sector : 'Salud',
          telefono,
          apoyo: apoyo || card.apoyo,
          fortalezas: (apoyo || card.apoyo).split(' · ')
        };
      }
    });

    if (formValues) {
      setMentorCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, ...formValues } : c))
      );
      updateRemoteDirectorioCard(card.id, formValues);
      Swal.fire({
        icon: 'success',
        title: 'Ficha Actualizada',
        text: 'Los cambios ya están visibles en el directorio.',
        confirmButtonColor: '#0A1128',
        timer: 1600,
        showConfirmButton: false
      });
    }
  };

  // Filtrado reactivo en el portal privado con protecciones contra nulos
  const filteredCards = useMemo(() => {
    return mentorCards.filter((card) => {
      if (!card) return false;
      let matchFilter = true;
      if (selectedFilter === 'egresada' || selectedFilter === 'Egresada(o)') {
        matchFilter = card.condicion === 'egresada' || (card.tipo && card.tipo.toLowerCase().includes('egresad'));
      } else if (selectedFilter === 'practicante' || selectedFilter === 'Practicante') {
        matchFilter = card.condicion === 'practicante' || (card.tipo && card.tipo.toLowerCase().includes('practicant'));
      }

      const term = (searchTerm || '').trim().toLowerCase();
      const matchSearch = term === '' ||
        (card.nombre && card.nombre.toLowerCase().includes(term)) ||
        (card.institucion && card.institucion.toLowerCase().includes(term)) ||
        (card.cargo && card.cargo.toLowerCase().includes(term)) ||
        (card.apoyo && card.apoyo.toLowerCase().includes(term)) ||
        (card.sector && card.sector.toLowerCase().includes(term));
      return matchFilter && matchSearch;
    });
  }, [mentorCards, selectedFilter, searchTerm]);

  // Usuarias filtradas para la Pestaña de Gestión de Usuarios
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u) => {
      const term = (userSearchTerm || '').trim().toLowerCase();
      const matchSearch = term === '' ||
        (u.nombre && u.nombre.toLowerCase().includes(term)) ||
        (u.correo && u.correo.toLowerCase().includes(term)) ||
        (u.telefono && u.telefono.toLowerCase().includes(term)) ||
        (u.centro && u.centro.toLowerCase().includes(term)) ||
        (u.sector && u.sector.toLowerCase().includes(term));

      let matchRole = true;
      if (userFilterRole === 'admin') matchRole = u.rol === 'admin';
      else if (userFilterRole === 'egresada') matchRole = u.condicion === 'egresada';
      else if (userFilterRole === 'practicante') matchRole = u.condicion === 'practicante';
      else if (userFilterRole === 'verificadas') matchRole = !!u.verificada;
      else if (userFilterRole === 'suspendidas') matchRole = u.estado === 'suspendida';

      return matchSearch && matchRole;
    });
  }, [registeredUsers, userSearchTerm, userFilterRole]);

  // Cálculos para la Pestaña de Métricas y Estadísticas
  const metricsData = useMemo(() => {
    const totalUsers = registeredUsers.length;
    const totalCards = mentorCards.length;
    const egresadasCount = mentorCards.filter(c => c.condicion === 'egresada' || c.tipo?.toLowerCase().includes('egresada')).length;
    const practicantesCount = mentorCards.filter(c => c.condicion === 'practicante' || c.tipo?.toLowerCase().includes('practicante')).length;
    const verificadasCount = mentorCards.filter(c => !!c.verificada).length;
    const verificadasPct = totalCards > 0 ? Math.round((verificadasCount / totalCards) * 100) : 0;

    const sectors = [
      { name: 'Salud', color: 'bg-rose-500', barColor: 'from-rose-500 to-red-600', text: 'text-rose-500' },
      { name: 'Justicia', color: 'bg-amber-500', barColor: 'from-amber-400 to-orange-500', text: 'text-amber-500' },
      { name: 'Municipalidades', color: 'bg-cyan-500', barColor: 'from-cyan-400 to-teal-500', text: 'text-cyan-500' },
      { name: 'Educación', color: 'bg-blue-600', barColor: 'from-blue-500 to-indigo-600', text: 'text-blue-600' },
      { name: 'Comunitario / ONGs', color: 'bg-emerald-600', barColor: 'from-emerald-400 to-green-600', text: 'text-emerald-600' },
      { name: 'Empresa', color: 'bg-purple-600', barColor: 'from-purple-500 to-pink-600', text: 'text-purple-600' }
    ];

    const sectorStats = sectors.map(sec => {
      const count = mentorCards.filter(c => c.sector === sec.name).length;
      const pct = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;
      return { ...sec, count, pct };
    });

    const fortalezasCount = {};
    mentorCards.forEach(c => {
      const list = Array.isArray(c.fortalezas) ? c.fortalezas : (c.apoyo ? c.apoyo.split(' · ') : []);
      list.forEach(f => {
        if (f) fortalezasCount[f] = (fortalezasCount[f] || 0) + 1;
      });
    });

    const topFortalezas = Object.entries(fortalezasCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalUsers,
      totalCards,
      egresadasCount,
      practicantesCount,
      verificadasCount,
      verificadasPct,
      sectorStats,
      topFortalezas
    };
  }, [registeredUsers, mentorCards]);

  // Ficha de la propia usuaria logueada (para banner "Mi Ficha")
  const miFicha = useMemo(() => {
    if (!user) return null;
    return mentorCards.find(
      (c) =>
        (c.correo && user.correo && c.correo.toLowerCase() === user.correo.toLowerCase()) ||
        (c.nombre && user.nombre && c.nombre.toLowerCase() === user.nombre.toLowerCase())
    );
  }, [user, mentorCards]);

  // Cálculos de Paginación
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = (current, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden selection:bg-cyan-500 selection:text-white">

      {/* MODAL DE INICIO DE SESIÓN / REGISTRO */}
      <AuthSection
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* PORTAL PRIVADO PARA USUARIOS LOGUEADOS (SISNETS) */}
      {user && (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
          {/* A. SIDEBAR MODULAR (ESCRITORIO Y DRAWER MÓVIL) */}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            user={user}
            mentorCards={mentorCards}
            handleLogout={handleLogout}
            onOpenChangePassword={() => setIsChangePassModalOpen(true)}
            handleExportCSV={handleExportCSV}
            handleExportUsersCSV={handleExportUsersCSV}
            handleClearAllCards={handleClearAllCards}
          />

          {/* B. CONTENEDOR PRINCIPAL */}
          <main className={`flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'md:pl-64' : 'md:pl-20'
          }`}>
            {/* 1. NAVBAR SUPERIOR MODULAR */}
            <Navbar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              user={user}
              getUserInitials={getUserInitials}
            />

            {/* 2. CABECERA DE PÁGINA (ESTILO SISGEIN) */}
            <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 shadow-sm relative z-20 backdrop-blur-md">
              <div className="w-full flex flex-col gap-4">
                {/* Fila Superior: Título + Botones de Acción (con margen armónico a la derecha) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-4 sm:pl-6">
                  {/* Icono Squircle Marino + Título + Subtítulo */}
                  <div className="flex items-center gap-3.5 sm:gap-4 sm:ml-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E2B58] via-[#141E3E] to-[#0A1128] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#0A1128]/20 shrink-0 border border-white/10">
                      {adminTab === 'directorio' ? (
                        <BookUser size={22} />
                      ) : adminTab === 'usuarios' ? (
                        <Users size={22} />
                      ) : (
                        <BarChart3 size={22} />
                      )}
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-[#0A1128] dark:text-slate-100 tracking-tight flex items-center gap-2">
                        {adminTab === 'directorio' ? 'Directorio' : adminTab === 'usuarios' ? 'Usuarios' : 'Métricas & Reportes'}
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full shrink-0 uppercase tracking-widest">
                          SISNETS
                        </span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {adminTab === 'directorio'
                          ? 'Gestión de Directorios'
                          : adminTab === 'usuarios'
                            ? 'Gestión y validación de miembros de la red'
                            : 'Indicadores de articulación institucional'}
                      </p>
                    </div>
                  </div>

                  {/* Botones de Acción (Recargar + Registrar Directorio en una fila compacta) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        syncDirectorio(false);
                        try {
                          const stored = localStorage.getItem('usuarios_colegio');
                          if (stored) {
                            const parsed = JSON.parse(stored);
                            setRegisteredUsers(cleanAndMergeUsers(parsed));
                          }
                        } catch (err) {}
                        setSearchTerm('');
                        setUserSearchTerm('');
                        setSelectedFilter('Todos');
                        setUserFilterRole('todos');
                        setIsFilterDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                      title="Actualizar listado"
                    >
                      <RotateCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (adminTab === 'usuarios') {
                          setIsCreateUserModalOpen(true);
                        } else {
                          setIsPublishModalOpen(true);
                        }
                      }}
                      className="bg-gradient-to-r from-[#1E2B58] via-[#16224D] to-[#0A1128] hover:from-[#25366D] hover:via-[#1E2B58] hover:to-[#0F172A] text-white px-4 sm:px-5 py-3 rounded-xl shadow-lg shadow-[#0A1128]/20 active:scale-95 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/10"
                      title={adminTab === 'usuarios' ? 'Registrar Usuario' : 'Registrar Directorio'}
                    >
                      <Plus size={18} /> {adminTab === 'usuarios' ? 'Registrar Usuario' : 'Registrar Directorio'}
                    </button>
                  </div>
                </div>

                {/* BARRA DE FILTROS (BÚSQUEDA SUAVE + DESPLEGABLE MODERNO) */}
                {adminTab !== 'metricas' && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-1">
                    <div className="relative flex-1 group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A1128] dark:group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input
                        type="text"
                        placeholder={
                          adminTab === 'usuarios'
                            ? 'Buscar colega por nombre, correo o teléfono...'
                            : 'Buscar en el directorio...'
                        }
                        value={adminTab === 'usuarios' ? userSearchTerm : searchTerm}
                        onChange={(e) => {
                          if (adminTab === 'usuarios') {
                            setUserSearchTerm(e.target.value);
                          } else {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }
                        }}
                        className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-xl pl-12 pr-12 focus:outline-none focus:border-[#0A1128] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#0A1128] dark:focus:ring-blue-500 transition-all shadow-sm placeholder:text-slate-400 font-semibold"
                      />
                      {(adminTab === 'usuarios' ? userSearchTerm : searchTerm) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (adminTab === 'usuarios') {
                              setUserSearchTerm('');
                            } else {
                              setSearchTerm('');
                              setCurrentPage(1);
                            }
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-all"
                          title="Borrar búsqueda"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* SELECTOR MODERNO DE CONDICIÓN / ROL (MISMO GROSOR h-12) */}
                    {(() => {
                      const optionsList = adminTab === 'usuarios' ? USER_FILTER_OPTIONS : FILTER_OPTIONS;
                      const currentVal = adminTab === 'usuarios' ? userFilterRole : selectedFilter;
                      const currentFilterOption = optionsList.find((o) => o.id === currentVal) || optionsList[0];
                      const ActiveIcon = currentFilterOption.icon;
                      return (
                        <div className="relative shrink-0 sm:w-60">
                          <button
                            type="button"
                            onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                            className="w-full h-12 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all select-none active:scale-[0.99] group"
                            aria-expanded={isFilterDropdownOpen}
                            aria-haspopup="listbox"
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
                                isFilterDropdownOpen ? 'rotate-180 text-[#0A1128] dark:text-cyan-400' : ''
                              }`}
                            />
                          </button>

                          {isFilterDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setIsFilterDropdownOpen(false)}
                              />
                              <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/15 dark:shadow-black/60 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                  {adminTab === 'usuarios' ? 'Filtrar por rol' : 'Filtrar por condición'}
                                </div>
                                <div className="space-y-1">
                                  {optionsList.map((opt) => {
                                    const isSelected = currentVal === opt.id;
                                    const OptIcon = opt.icon;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                          if (adminTab === 'usuarios') {
                                            setUserFilterRole(opt.id);
                                          } else {
                                            setSelectedFilter(opt.id);
                                            setCurrentPage(1);
                                          }
                                          setIsFilterDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer active:scale-[0.98] ${
                                          isSelected
                                            ? 'bg-blue-50/80 dark:bg-blue-950/50 text-slate-900 dark:text-white font-bold shadow-2xs'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium'
                                        }`}
                                      >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${opt.badgeColor}`}>
                                          <OptIcon size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <span className="block text-xs font-bold leading-tight truncate">
                                            {opt.label}
                                          </span>
                                          <span className="block text-[10px] text-slate-400 font-medium leading-none mt-0.5 truncate">
                                            {opt.sublabel}
                                          </span>
                                        </div>
                                        {isSelected && (
                                          <Check size={16} className={`shrink-0 ml-1.5 ${opt.activeColor || 'text-blue-600'}`} />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* 3. CONTENIDO PRINCIPAL POR TAB */}
            <div className="py-4 sm:py-6 px-3.5 sm:px-8 w-full space-y-4 sm:space-y-6 flex-1">
              {/* BANNER "MI FICHA" (Para Colegiadas No-Admin) */}
              {user.rol !== 'admin' && (
                miFicha ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border-2 border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-cyan-500/30 shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                            Tu Ficha Activa en la Red
                          </span>
                          {miFicha.verificada ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[9px] font-black uppercase tracking-wider border border-amber-400/50">
                              <ShieldCheck size={10} className="text-amber-500" />
                              Sello Oficial Verificado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-bold uppercase tracking-wider">
                              En Revisión
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-sm text-[#0A1128] dark:text-white mt-0.5 truncate">
                          {miFicha.institucion} ({miFicha.sector})
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          WhatsApp: {miFicha.telefono} · Correo: {miFicha.correo}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditCard(miFicha)}
                      className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#0A1128] dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                    >
                      <Edit3 size={14} className="text-cyan-500" />
                      <span>Editar Mi Ficha</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Aún no has registrado tu centro institucional. ¡Publica tu ficha para que otras colegas puedan contactarte por WhatsApp!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPublishModalOpen(true)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050B18] font-black text-xs uppercase tracking-wider rounded-xl shadow-sm hover:scale-105 transition shrink-0"
                    >
                      + Publicar Mi Ficha
                    </button>
                  </div>
                )
              )}

              {/* TAB 1: DIRECTORIO VIVO DE COLEGAS CON ANIMACIÓN DINÁMICA */}
              {(adminTab === 'directorio' || user.rol !== 'admin') && (
                <div className="space-y-4 sm:space-y-6">
                  {filteredCards.length > 0 ? (
                    <motion.div 
                      layout
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    >
                      <AnimatePresence mode="popLayout">
                        {paginatedCards.map((card) => (
                          <ColleagueCard
                            key={card.id}
                            card={card}
                            user={user}
                            openMenuCardId={openMenuCardId}
                            setOpenMenuCardId={setOpenMenuCardId}
                            handleEditCard={handleEditCard}
                            handleDeleteCard={handleDeleteCard}
                            handleContactClick={handleContactClick}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 sm:p-12 text-center rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-md animate-pulse">
                        <Users size={26} />
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#0A1128] dark:text-white uppercase mb-1">
                        {searchTerm || selectedFilter !== 'Todos'
                          ? 'No se encontraron colegas con este filtro'
                          : 'Aún no hay publicaciones en el directorio'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5 sm:mb-6 font-medium">
                        {searchTerm || selectedFilter !== 'Todos'
                          ? 'Prueba buscando con otra palabra clave o selecciona "Todos" en los sectores.'
                          : 'El sistema está limpio y listo para recibir publicaciones. Sé la primera en registrar tu centro institucional y las áreas donde puedes orientar a otras colegas.'}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPublishModalOpen(true)}
                          className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050B18] font-black text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition"
                        >
                          + Registrar Directorio
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Paginación */}
                  {filteredCards.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 pb-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 text-center sm:text-left">
                        Mostrando <strong className="text-[#0A1128] dark:text-cyan-400">{startIndex + 1}</strong> - <strong className="text-[#0A1128] dark:text-cyan-400">{Math.min(startIndex + itemsPerPage, filteredCards.length)}</strong> de <strong className="text-[#0A1128] dark:text-cyan-400">{filteredCards.length}</strong> colegas
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
                          {getPageNumbers(currentPage, totalPages).map((p, idx) => (
                            p === '...' ? (
                              <span key={`dots-${idx}`} className="px-1 text-xs text-slate-400 font-bold select-none">...</span>
                            ) : (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 rounded-xl text-xs font-black transition active:scale-90 ${
                                  currentPage === p
                                    ? 'bg-[#0A1128] dark:bg-cyan-500 text-white dark:text-[#050B18] shadow-sm ring-2 ring-cyan-500/20 scale-105'
                                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
                                }`}
                              >
                                {p}
                              </button>
                            )
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
                </div>
              )}

              {/* TAB 2 (ADMIN): GESTIÓN DE USUARIAS */}
              {user.rol === 'admin' && adminTab === 'usuarios' && (
                <UsersManagement
                  userSearchTerm={userSearchTerm}
                  setUserSearchTerm={setUserSearchTerm}
                  userFilterRole={userFilterRole}
                  setUserFilterRole={setUserFilterRole}
                  filteredUsers={filteredUsers}
                  registeredUsers={registeredUsers}
                  handleExportUsersCSV={handleExportUsersCSV}
                  handleToggleUserRole={handleToggleUserRole}
                  handleToggleUserVerify={handleToggleUserVerify}
                  handleToggleUserStatus={handleToggleUserStatus}
                  handleDeleteUser={handleDeleteUser}
                  handleUpdateUser={handleUpdateUser}
                  onOpenCreateModal={() => setIsCreateUserModalOpen(true)}
                />
              )}

              {/* TAB 3 (ADMIN): MÉTRICAS & REPORTES */}
              {user.rol === 'admin' && adminTab === 'metricas' && (
                <MetricsView
                  metricsData={metricsData}
                  handleExportCSV={handleExportCSV}
                />
              )}
            </div>

            {/* 4. FOOTER INSTITUCIONAL ESTILO SISGEIN */}
            <footer className="py-4 px-2 sm:px-4 text-center mt-auto">
              <p className="text-[9px] sm:text-[12px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                © 2026. Todos los derechos reservados.
              </p>
              <p className="text-[9px] sm:text-[12px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                SISNETS v1.0
              </p>
            </footer>
          </main>
        </div>
      )}

      {/* PORTAL PÚBLICO PARA VISITANTES (NO LOGUEADOS) */}
      {!user && (
        <PublicLanding setIsAuthModalOpen={setIsAuthModalOpen} />
      )}

      {/* MODAL PARA PUBLICAR CENTRO Y APOYO */}
      <PublishSupportModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handleAddNewSupport}
      />

      {/* MODAL PARA REGISTRAR USUARIO (ADMIN) */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={(newUser) => {
          const ruth = registeredUsers.find((u) => u.id === 'admin_ruth' || u.correo?.toLowerCase() === 'ruthanastacio191202@gmail.com') || ADMIN_RUTH_USER;
          const luis = registeredUsers.find((u) => u.id === 'usr_luis_lacruz' || u.correo?.toLowerCase() === 'luislacruz326@gmail.com') || LUIS_LACRUZ_USER;
          const others = registeredUsers.filter((u) => u.id !== ruth.id && u.id !== luis.id && u.correo?.toLowerCase() !== newUser.correo?.toLowerCase());
          const updated = [ruth, luis, newUser, ...others];
          setRegisteredUsers(updated);
          try {
            localStorage.setItem('usuarios_colegio', JSON.stringify(updated));
          } catch (err) {
            console.error(err);
          }
          saveRemoteUser(newUser);
        }}
        existingUsers={registeredUsers}
      />

      {/* MODAL PARA CAMBIO DE CONTRASEÑA SEGURO (SHA-256) */}
      <ChangePasswordModal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
        onSuccess={() => {
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña Actualizada!',
            text: 'Tu contraseña ha sido cifrada y guardada con éxito en la nube.',
            confirmButtonColor: '#0A1128'
          });
        }}
      />

    </div>
  );
}
