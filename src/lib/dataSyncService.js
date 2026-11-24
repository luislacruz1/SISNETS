import { supabase } from './supabaseClient';
import { ADMIN_RUTH_USER, LUIS_LACRUZ_USER } from '../data/demoData';
import { hashPassword, sanitizeEmail } from '../utils/security';

// IDs de prueba antiguos que no deben aparecer nunca
const FAKE_DEMO_IDS = [
  'admin_stephanie', 'usr_claudia', 'usr_valeria', 'usr_mariana',
  'usr_camila', 'usr_roberto', 'usr_lucia', 'usr_andrea',
  'usr_daniela', 'usr_patricia', 'usr_andream', 'usr_sofia', 'usr_mariap', 'usr_karen'
];

/**
 * Limpia y fusiona usuarios preservando a Ruth Anastacio y Luis Jhonatan La Cruz Urbano
 */
export const cleanAndMergeUsers = (parsed) => {
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return [ADMIN_RUTH_USER, LUIS_LACRUZ_USER];
  }

  // 1. Buscar a Ruth
  const storedRuth = parsed.find(
    (u) => u && (u.id === 'admin_ruth' || u.correo?.toLowerCase() === 'ruthanastacio191202@gmail.com')
  );
  const activeRuth = storedRuth
    ? { ...ADMIN_RUTH_USER, ...storedRuth, rol: 'admin' }
    : ADMIN_RUTH_USER;

  // 2. Buscar a Luis
  const storedLuis = parsed.find(
    (u) => u && (u.id === 'usr_luis_lacruz' || u.correo?.toLowerCase() === 'luislacruz326@gmail.com')
  );
  const activeLuis = storedLuis
    ? { ...LUIS_LACRUZ_USER, ...storedLuis, rol: storedLuis.rol || 'admin' }
    : LUIS_LACRUZ_USER;

  // 3. Usuarios reales adicionales
  const realUsers = parsed
    .filter(
      (u) =>
        u &&
        typeof u === 'object' &&
        !FAKE_DEMO_IDS.includes(u.id) &&
        u.id !== 'admin_ruth' &&
        u.id !== 'usr_luis_lacruz' &&
        u.correo?.toLowerCase() !== 'ruthanastacio191202@gmail.com' &&
        u.correo?.toLowerCase() !== 'luislacruz326@gmail.com' &&
        u.correo?.toLowerCase() !== 'admin@trabajosocial.org'
    )
    .map((u) => ({
      ...u,
      fechaRegistro: u.fechaRegistro || u.fecharegistro || new Date().toLocaleDateString('es-PE'),
      debeCambiarPassword: u.debeCambiarPassword ?? u.debecambiarpassword ?? false
    }));

  return [activeRuth, activeLuis, ...realUsers];
};

/**
 * Normaliza una ficha del directorio
 */
export const normalizeCard = (c) => {
  if (!c) return null;
  let fortalezas = [];
  if (Array.isArray(c.fortalezas)) {
    fortalezas = c.fortalezas;
  } else if (typeof c.fortalezas === 'string') {
    try {
      fortalezas = JSON.parse(c.fortalezas);
    } catch {
      fortalezas = c.fortalezas.split(' · ');
    }
  } else if (c.apoyo) {
    fortalezas = c.apoyo.split(' · ');
  }

  return {
    id: String(c.id),
    user_id: c.user_id ? String(c.user_id) : null,
    nombre: c.nombre || '',
    condicion: c.condicion || 'egresada',
    tipo: c.tipo || 'Colegiada',
    cicloEstudio: c.cicloEstudio || c.cicloestudio || null,
    institucion: c.institucion || '',
    centroTipo: c.centroTipo || c.centrotipo || (c.condicion === 'practicante' ? 'Centro de Prácticas' : 'Centro Laboral'),
    cargo: c.cargo || '',
    sector: c.sector || 'General',
    apoyo: c.apoyo || fortalezas.join(' · '),
    fortalezas: fortalezas,
    telefono: c.telefono || '',
    correo: c.correo || '',
    verificada: c.verificada !== false,
    avatar: c.avatar || '/logo.png',
    created_at: c.created_at || new Date().toISOString()
  };
};

// ==========================================
// 1. SINCRONIZACIÓN DE USUARIOS
// ==========================================

export const fetchRemoteUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase usuarios aviso:', error.message);
      return null;
    }

    if (Array.isArray(data)) {
      const merged = cleanAndMergeUsers(data);
      try {
        localStorage.setItem('usuarios_colegio', JSON.stringify(merged));
      } catch (err) {
        console.error('Error guardando en localStorage:', err);
      }
      return merged;
    }
  } catch (err) {
    console.warn('Error conectando a Supabase usuarios:', err);
  }
  return null;
};

export const saveRemoteUser = async (user) => {
  if (!user || !user.correo) return false;

  const cleanEmail = sanitizeEmail(user.correo);
  let finalPassword = user.password || '';

  // Encriptación criptográfica SHA-256 (Inspirada en el modelo de seguridad SIMEC)
  if (finalPassword && finalPassword.length < 60) {
    try {
      finalPassword = await hashPassword(finalPassword);
    } catch (e) {
      console.warn('Error encriptando contraseña:', e);
    }
  }

  const payload = {
    id: String(user.id || `usr_${Date.now()}`),
    nombre: user.nombre || '',
    correo: cleanEmail,
    telefono: user.telefono || '',
    password: finalPassword,
    debeCambiarPassword: !!user.debeCambiarPassword,
    rol: user.rol || 'colegiada',
    condicion: user.condicion || 'egresada',
    centro: user.centro || '',
    sector: user.sector || '',
    estado: user.estado || 'activa',
    verificada: user.verificada !== false,
    fechaRegistro: user.fechaRegistro || new Date().toLocaleDateString('es-PE'),
    avatar: user.avatar || '/logo.png'
  };

  try {
    const { error } = await supabase.from('usuarios').upsert(payload, { onConflict: 'correo' });
    if (error) {
      console.warn('Error guardando usuario en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error en saveRemoteUser:', err);
    return false;
  }
};

export const updateRemoteUser = async (userId, partialData) => {
  if (!userId) return false;
  try {
    const sanitizedData = { ...partialData };
    if (sanitizedData.correo) {
      sanitizedData.correo = sanitizeEmail(sanitizedData.correo);
    }
    if (sanitizedData.password && sanitizedData.password.length < 60) {
      sanitizedData.password = await hashPassword(sanitizedData.password);
    }

    const { error } = await supabase
      .from('usuarios')
      .update(sanitizedData)
      .eq('id', String(userId));
    if (error) {
      console.warn('Error actualizando usuario en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error en updateRemoteUser:', err);
    return false;
  }
};

export const deleteRemoteUser = async (userId) => {
  if (!userId) return false;
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', String(userId));
    if (error) {
      console.warn('Error eliminando usuario en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error en deleteRemoteUser:', err);
    return false;
  }
};

// ==========================================
// 2. SINCRONIZACIÓN DEL DIRECTORIO DE COLEGAS
// ==========================================

export const fetchRemoteDirectorio = async () => {
  try {
    const { data, error } = await supabase
      .from('directorio_colegas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase directorio aviso:', error.message);
      return null;
    }

    if (Array.isArray(data)) {
      const cleanCards = data
        .filter((c) => c && !String(c.id).startsWith('demo_'))
        .map(normalizeCard);

      try {
        localStorage.setItem('directorio_colegas', JSON.stringify(cleanCards));
      } catch (err) {
        console.error('Error guardando directorio en localStorage:', err);
      }
      return cleanCards;
    }
  } catch (err) {
    console.warn('Error conectando a Supabase directorio:', err);
  }
  return null;
};

export const saveRemoteDirectorioCard = async (card) => {
  if (!card || !card.nombre) return false;

  const payload = {
    id: String(card.id || `col_${Date.now()}`),
    user_id: card.user_id ? String(card.user_id) : null,
    nombre: card.nombre,
    condicion: card.condicion || 'egresada',
    tipo: card.tipo || 'Colegiada',
    cicloEstudio: card.cicloEstudio || null,
    institucion: card.institucion,
    centroTipo: card.centroTipo || 'Centro Laboral',
    cargo: card.cargo || '',
    sector: card.sector || 'General',
    apoyo: card.apoyo || '',
    fortalezas: Array.isArray(card.fortalezas) ? card.fortalezas : (card.apoyo ? card.apoyo.split(' · ') : []),
    telefono: card.telefono,
    correo: card.correo || '',
    verificada: card.verificada !== false,
    avatar: card.avatar || '/logo.png'
  };

  try {
    const { error } = await supabase.from('directorio_colegas').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Error guardando ficha en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error en saveRemoteDirectorioCard:', err);
    return false;
  }
};

export const updateRemoteDirectorioCard = async (cardId, partialData) => {
  if (!cardId) return false;
  try {
    const { error } = await supabase
      .from('directorio_colegas')
      .update(partialData)
      .eq('id', String(cardId));
    if (error) {
      console.warn('Error actualizando ficha en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error en updateRemoteDirectorioCard:', err);
    return false;
  }
};

export const deleteRemoteDirectorioCard = async (cardId) => {
  if (!cardId) return false;
  try {
    const { error } = await supabase
      .from('directorio_colegas')
      .delete()
      .eq('id', String(cardId));
    if (error) {
      console.warn('Error eliminando ficha en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error en deleteRemoteDirectorioCard:', err);
    return false;
  }
};

// ==========================================
// 3. SUSCRIPCIÓN EN TIEMPO REAL (WEBSOCKETS)
// ==========================================

export const subscribeToCloudChanges = (onChange) => {
  try {
    const channel = supabase
      .channel('sisnets_realtime_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, () => {
        if (typeof onChange === 'function') onChange('usuarios');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'directorio_colegas' }, () => {
        if (typeof onChange === 'function') onChange('directorio');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Error creando suscripción en tiempo real:', err);
    return () => {};
  }
};
