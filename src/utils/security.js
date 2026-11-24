/**
 * MÓDULO DE SEGURIDAD CRIPTOGRÁFICA Y RBAC - SISNETS
 * Inspirado en la arquitectura de seguridad de SIMEC (Mantenimiento de Equipos)
 * Encriptación SHA-256 + Sanitización estricta de credenciales
 */

const APP_SALT = 'SISNETS_SECURITY_SALT_2026_@_TS';

/**
 * Convierte un ArrayBuffer a cadena hexadecimal
 */
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Genera un Hash criptográfico SHA-256 de forma asíncrona
 * Compatible con la especificación SHA2_256 de base de datos
 */
export const hashPassword = async (plainText, customSalt = APP_SALT) => {
  if (!plainText) return '';
  try {
    const saltedText = `${plainText.trim()}::${customSalt}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(saltedText);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
  } catch (err) {
    console.error('Error generando hash criptográfico SHA-256:', err);
    // Fallback simple si WebCrypto no está disponible en entornos no seguros
    let hash = 0;
    const str = `${plainText}::${customSalt}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `fallback_${Math.abs(hash).toString(16)}`;
  }
};

/**
 * Compara una contraseña en texto plano contra el hash almacenado
 */
export const verifyPassword = async (plainText, storedHash, customSalt = APP_SALT) => {
  if (!plainText || !storedHash) return false;
  // Si la contraseña almacenada estaba en texto plano (migración legacy), permitir match directo
  if (plainText.trim() === storedHash.trim()) {
    return true;
  }
  const computedHash = await hashPassword(plainText, customSalt);
  return computedHash.toLowerCase() === storedHash.trim().toLowerCase();
};

/**
 * Sanitiza y normaliza un correo electrónico
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

/**
 * Estandarización de textos (Nombres / Instituciones)
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
};

/**
 * Validador de robustez de contraseña
 */
export const evaluatePasswordStrength = (pass) => {
  if (!pass) return { score: 0, percent: 0, label: 'Vacía', color: 'bg-slate-300' };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 2) {
    return { score, percent: 35, label: 'Débil', color: 'bg-rose-500' };
  } else if (score <= 4) {
    return { score, percent: 70, label: 'Aceptable', color: 'bg-amber-500' };
  } else {
    return { score, percent: 100, label: 'Muy Segura', color: 'bg-emerald-500' };
  }
};
