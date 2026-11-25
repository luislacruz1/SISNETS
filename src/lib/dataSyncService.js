import { supabase } from './supabaseClient';
import { ADMIN_RUTH_USER, LUIS_LACRUZ_USER } from '../data/demoData';
import { hashPassword, sanitizeEmail } from '../utils/security';

// IDs de prueba antiguos que no deben aparecer nunca
const FAKE_DEMO_IDS = [
  'admin_stephanie', 'usr_claudia', 'usr_valeria', 'usr_mariana',
  'usr_camila', 'usr_roberto', 'usr_lucia', 'usr_andrea',
  'usr_daniela', 'usr_patricia', 'usr_andream', 'usr_sofia', 'usr_mariap', 'usr_karen'
];

// Columnas estrictamente válidas en la tabla public.usuarios de PostgreSQL / Supabase
const VALID_USUARIOS_COLUMNS = new Set([
  'id',
  'nombre',
  'correo',
  'telefono',
  'password',
  'debecambiarpassword',
  'rol',
  'condicion',
  'centro',
  'sector',
  'estado',
  'verificada',
  'fecharegistro',
  'avatar'
]);

// Columnas estrictamente válidas en la tabla public.directorio_colegas de PostgreSQL / Supabase
const VALID_DIRECTORIO_COLUMNS = new Set([
  'id',
  'user_id',
  'nombre',
  'condicion',
  'tipo',
  'cicloestudio',
  'institucion',
  'centrotipo',
  'cargo',
  'sector',
  'apoyo',
  'fortalezas',
  'telefono',
  'correo',
  'verificada',
  'avatar'
]);

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
    ? {
        ...ADMIN_RUTH_USER,
        ...storedRuth,
        avatar: (storedRuth.avatar && storedRuth.avatar !== '/logo.png' && storedRuth.avatar !== '/logo.svg')
          ? storedRuth.avatar
          : ADMIN_RUTH_USER.avatar || '/logo.png',
        rol: storedRuth.rol || 'admin'
      }
    : ADMIN_RUTH_USER;

  // 2. Buscar a Luis
  const storedLuis = parsed.find(
    (u) => u && (u.id === 'usr_luis_lacruz' || u.correo?.toLowerCase() === 'luislacruz326@gmail.com')
  );
  const activeLuis = storedLuis
    ? {
        ...LUIS_LACRUZ_USER,
        ...storedLuis,
        avatar: (storedLuis.avatar && storedLuis.avatar !== '/logo.png' && storedLuis.avatar !== '/logo.svg')
          ? storedLuis.avatar
          : LUIS_LACRUZ_USER.avatar || '/logo.png',
        rol: storedLuis.rol || 'admin'
      }
    : LUIS_LACRUZ_USER;

  // Safeguard: Si la sesión activa local ya tiene foto personalizada, evitar que un /logo.png desactualizado la pise
  try {
    const rawSession = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (rawSession) {
      const sessionUser = JSON.parse(rawSession);
      if (sessionUser && sessionUser.avatar && sessionUser.avatar !== '/logo.png' && sessionUser.avatar !== '/logo.svg') {
        const sessionEmail = (sessionUser.correo || '').toLowerCase().trim();
        if (sessionEmail === 'ruthanastacio191202@gmail.com' || sessionUser.id === 'admin_ruth') {
          if (!activeRuth.avatar || activeRuth.avatar === '/logo.png' || activeRuth.avatar === '/logo.svg') {
            activeRuth.avatar = sessionUser.avatar;
          }
        } else if (sessionEmail === 'luislacruz326@gmail.com' || sessionUser.id === 'usr_luis_lacruz') {
          if (!activeLuis.avatar || activeLuis.avatar === '/logo.png' || activeLuis.avatar === '/logo.svg') {
            activeLuis.avatar = sessionUser.avatar;
          }
        }
      }
    }
  } catch (e) {}

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
    debecambiarpassword: !!(user.debeCambiarPassword ?? user.debecambiarpassword),
    rol: user.rol || 'colegiada',
    condicion: user.condicion || 'egresada',
    centro: user.centro || '',
    sector: user.sector || '',
    estado: user.estado || 'activa',
    verificada: user.verificada !== false,
    fecharegistro: user.fechaRegistro || user.fecharegistro || new Date().toLocaleDateString('es-PE'),
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

export const updateRemoteUser = async (userId, partialData, userObject = null) => {
  if (!userId && !userObject?.correo) return false;
  try {
    const sanitizedData = {};
    for (const [key, val] of Object.entries(partialData)) {
      const lower = key.toLowerCase();
      if (key === 'debeCambiarPassword') sanitizedData.debecambiarpassword = val;
      else if (key === 'fechaRegistro') sanitizedData.fecharegistro = val;
      else if (VALID_USUARIOS_COLUMNS.has(lower)) {
        sanitizedData[lower] = val;
      }
    }
    if (sanitizedData.correo) {
      sanitizedData.correo = sanitizeEmail(sanitizedData.correo);
    }
    if (sanitizedData.password && sanitizedData.password.length < 60) {
      sanitizedData.password = await hashPassword(sanitizedData.password);
    }

    let updated = false;

    if (userId) {
      const { data, error } = await supabase
        .from('usuarios')
        .update(sanitizedData)
        .eq('id', String(userId))
        .select();

      if (!error && data && data.length > 0) {
        updated = true;
      } else if (error) {
        console.warn('Error actualizando usuario por ID en Supabase:', error.message);
      }
    }

    // Si no se actualizó por ID pero tenemos el objeto/correo, intentar actualizar por correo o persistir
    const targetEmail = sanitizedData.correo || (userObject?.correo ? sanitizeEmail(userObject.correo) : null);
    if (!updated && targetEmail) {
      const { data: emailData, error: emailError } = await supabase
        .from('usuarios')
        .update(sanitizedData)
        .eq('correo', targetEmail)
        .select();

      if (!emailError && emailData && emailData.length > 0) {
        updated = true;
      } else if (userObject) {
        await saveRemoteUser({ ...userObject, ...partialData });
        updated = true;
      }
    }

    return updated;
  } catch (err) {
    console.warn('Error en updateRemoteUser:', err);
    return false;
  }
};

export const deleteRemoteUser = async (userId, userCorreo = null) => {
  if (!userId && !userCorreo) return false;
  try {
    if (userId) {
      const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', String(userId))
        .select();
      if (!error && data && data.length > 0) return true;
    }
    if (userCorreo) {
      await supabase
        .from('usuarios')
        .delete()
        .eq('correo', sanitizeEmail(userCorreo));
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
    cicloestudio: card.cicloEstudio || card.cicloestudio || null,
    institucion: card.institucion,
    centrotipo: card.centroTipo || card.centrotipo || (card.condicion === 'practicante' ? 'Centro de Prácticas' : 'Centro Laboral'),
    cargo: card.cargo || '',
    sector: card.sector || 'General',
    apoyo: card.apoyo || (Array.isArray(card.fortalezas) ? card.fortalezas.join(' · ') : ''),
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

export const updateRemoteDirectorioCard = async (cardId, partialData, fallbackFilter = null) => {
  try {
    const payload = {};
    for (const [key, val] of Object.entries(partialData)) {
      const lower = key.toLowerCase();
      if (key === 'centroTipo') payload.centrotipo = val;
      else if (key === 'cicloEstudio') payload.cicloestudio = val;
      else if (VALID_DIRECTORIO_COLUMNS.has(lower)) {
        payload[lower] = val;
      }
    }

    if (cardId) {
      const { error } = await supabase
        .from('directorio_colegas')
        .update(payload)
        .eq('id', String(cardId));
      if (!error) return true;
      console.warn('Error actualizando ficha por ID en Supabase:', error.message);
    }

    // Si no hay cardId o falló, intentar actualizar por user_id o correo del autor
    if (fallbackFilter?.user_id) {
      const { error: userError } = await supabase
        .from('directorio_colegas')
        .update(payload)
        .eq('user_id', String(fallbackFilter.user_id));
      if (!userError) return true;
    }

    if (fallbackFilter?.correo) {
      const cleanEmail = sanitizeEmail(fallbackFilter.correo);
      const { error: mailError } = await supabase
        .from('directorio_colegas')
        .update(payload)
        .ilike('correo', cleanEmail);
      if (!mailError) return true;
    }

    return false;
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
