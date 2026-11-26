// Utilidad para detección de género en nombres y formateo de etiquetas en SISNETS

export function isMasculineName(fullName) {
  if (!fullName) return false;
  const clean = fullName.trim().toLowerCase();

  // 1. Detección por títulos explícitos masculinos o femeninos
  if (/\b(licenciado|doctor|profesor|ingeniero|señor|sr\.)\b/i.test(clean)) return true;
  if (/\b(licenciada|doctora|profesora|ingeniera|señora|sra\.)\b/i.test(clean)) return false;

  // 2. Extraer el primer nombre de pila (omitiendo prefijos como Lic., Mg., Dr., etc.)
  const withoutTitles = clean.replace(/^(lic\.|licenciado|licenciada|mg\.|magister|dr\.|dra\.|doctor|doctora|bach\.|bachiller|prof\.|profesor|profesora|ing\.|sr\.|sra\.)\s+/i, '');
  const firstName = withoutTitles.split(/[\s\-_]+/)[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

  if (!firstName) return false;

  // 3. Nombres masculinos comunes
  const maleNames = new Set([
    'juan', 'jose', 'luis', 'carlos', 'jorge', 'miguel', 'cesar', 'victor', 'david', 'oscar',
    'diego', 'javier', 'pedro', 'manuel', 'jesus', 'angel', 'roberto', 'fernando', 'raul', 'eduardo',
    'ricardo', 'marco', 'marcos', 'sergio', 'alex', 'alexander', 'christian', 'cristian', 'mario', 'hugo',
    'alonso', 'alfredo', 'andres', 'arturo', 'daniel', 'gabriel', 'gonzalo', 'guillermo', 'gustavo',
    'hector', 'julio', 'leonardo', 'lucas', 'martin', 'pablo', 'rafael', 'renato', 'rodrigo', 'sebastian',
    'walter', 'bryan', 'brian', 'kevin', 'anthony', 'jean', 'franco', 'fabricio', 'fabrizio', 'giancarlo',
    'paolo', 'renzo', 'alvaro', 'joaquin', 'mateo', 'nicolas', 'facundo', 'samuel', 'santiago', 'benjamin',
    'felipe', 'ignacio', 'patricio', 'jaime', 'esteban', 'adrian', 'elias', 'rolando', 'edgard', 'edgar',
    'willy', 'max', 'erick', 'eric', 'italo', 'jhon', 'john', 'jhonathan', 'jonathan', 'christopher',
    'richard', 'freddy', 'fredy', 'alexis', 'boris', 'felix', 'gaston', 'hernan', 'ivan', 'mauricio',
    'orlando', 'ruben', 'wilson', 'edwin', 'elmer', 'frank', 'franklin', 'henry', 'jimmy', 'ronald',
    'claudio', 'mario', 'dario', 'dante', 'humberto', 'gonzalo', 'bernardo', 'bruno', 'gerardo', 'guido'
  ]);

  // 4. Nombres femeninos comunes
  const femaleNames = new Set([
    'maria', 'ana', 'carmen', 'rosa', 'lucia', 'laura', 'sofia', 'paula', 'claudia', 'elena',
    'sara', 'patricia', 'andrea', 'marta', 'martha', 'monica', 'teresa', 'beatriz', 'julia', 'silvia',
    'sandra', 'irene', 'lorena', 'rocio', 'vanessa', 'vanesa', 'yesenia', 'jessica', 'stephanie', 'stefany',
    'stephany', 'mariana', 'valeria', 'camila', 'fiorella', 'gabriela', 'daniela', 'natalia', 'alicia', 'diana',
    'karla', 'carla', 'karen', 'fanny', 'milagros', 'pilar', 'rosario', 'consuelo', 'lourdes', 'mercedes',
    'guadalupe', 'caridad', 'soledad', 'victoria', 'elizabeth', 'ruth', 'esther', 'noemi', 'miriam', 'mirian',
    'mirtha', 'janet', 'gisella', 'gisela', 'katia', 'kathy', 'cinthia', 'cynthia', 'susana', 'cecilia',
    'marilu', 'flor', 'gladys', 'maritza', 'magaly', 'sonia', 'blanca', 'norma', 'delia', 'dora',
    'elsa', 'olga', 'lidia', 'nelly', 'nancy', 'betty', 'iris', 'luz', 'yolanda', 'zoila', 'zulema',
    'lucero', 'estrella', 'esperanza', 'gloria', 'ines', 'maribel', 'deysi', 'deisy', 'mayra', 'maira',
    'xiomara', 'jazmin', 'yessica', 'liz', 'lizeth', 'erika', 'erica'
  ]);

  if (maleNames.has(firstName)) return true;
  if (femaleNames.has(firstName)) return false;

  // 5. Excepciones de nombres femeninos que terminan en 'o'
  const femaleExceptionsEndingO = ['rosario', 'consuelo', 'amparo', 'rocio', 'socorro'];
  if (femaleExceptionsEndingO.includes(firstName)) return false;

  // 6. Heurística básica: terminación en 'o' o 'os'
  if (firstName.endsWith('o') || firstName.endsWith('os')) return true;
  if (firstName.endsWith('a')) return false;

  // 7. Terminaciones masculinas típicas
  const maleEndings = ['el', 'er', 'or', 'an', 'on', 'en', 'in', 'ed', 'id', 'ur', 'us'];
  const femaleExceptionsEndings = ['carmen', 'raquel', 'isabel', 'miriam', 'karen', 'ruth', 'esther', 'luz', 'ines', 'pilar', 'belen', 'maribel', 'liz'];
  if (femaleExceptionsEndings.includes(firstName)) return false;

  for (const end of maleEndings) {
    if (firstName.endsWith(end)) return true;
  }

  return false;
}

export function getEgresadaBadgeText(cardOrName, condicion) {
  if (condicion === 'practicante') return 'PRACTICANTE';
  
  if (typeof cardOrName === 'object' && cardOrName !== null) {
    if (cardOrName.tipo === 'Egresado') return 'EGRESADO';
    if (cardOrName.tipo === 'Egresada') return 'EGRESADA';
    return isMasculineName(cardOrName.nombre) ? 'EGRESADO' : 'EGRESADA';
  }
  
  return isMasculineName(cardOrName) ? 'EGRESADO' : 'EGRESADA';
}

/**
 * Convierte un nombre completo a formato Título (iniciales mayúsculas),
 * preservando y estandarizando prefijos profesionales comunes (Lic., Mg., Dr., etc.)
 * y manteniendo en minúscula las preposiciones en apellidos compuestos.
 */
export function formatTitleCase(str) {
  if (!str || typeof str !== 'string') return '';
  const prepositions = new Set(['de', 'la', 'del', 'los', 'las', 'y', 'e', 'da', 'di', 'von', 'van']);
  return str
    .trim()
    .split(/\s+/)
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (lower === 'mg.' || lower === 'mg') return 'Mg.';
      if (lower === 'lic.' || lower === 'lic') return 'Lic.';
      if (lower === 'dr.' || lower === 'dr') return 'Dr.';
      if (lower === 'dra.' || lower === 'dra') return 'Dra.';
      if (lower === 'bach.' || lower === 'bach') return 'Bach.';
      if (lower === 'prof.' || lower === 'prof') return 'Prof.';
      if (lower === 'ing.' || lower === 'ing') return 'Ing.';
      if (lower === 'la' && word === 'La') return 'La';
      if (idx > 0 && prepositions.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

/**
 * Extrae de forma inteligente el primer nombre y el primer apellido,
 * respetando apellidos compuestos comunes en Perú y Latinoamérica (ej: "La Cruz", "De la Cruz", "Del Valle", "San Martín").
 */
export function formatShortName(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  
  // Limpiar títulos profesionales iniciales (Lic., Mg., Dr., etc.)
  const clean = fullName.trim().replace(/^(lic\.|licenciado|licenciada|mg\.|magister|dr\.|dra\.|doctor|doctora|bach\.|bachiller|prof\.|profesor|profesora|ing\.|sr\.|sra\.)\s+/i, '').trim();
  const tokens = clean.split(/\s+/);
  if (tokens.length <= 2) return formatTitleCase(clean);

  const compoundPrefixes = new Set(['de', 'la', 'del', 'los', 'las', 'san', 'santa', 'da', 'di', 'van', 'von', 'mc', 'mac']);

  // Si tokens tiene 3 elementos:
  if (tokens.length === 3) {
    if (compoundPrefixes.has(tokens[1].toLowerCase())) {
      // Ej: "Luis La Cruz" -> Nombre="Luis", Apellido="La Cruz"
      return formatTitleCase(`${tokens[0]} ${tokens[1]} ${tokens[2]}`);
    }
    // Ej: "Ruth Lizeth Anastacio" -> Nombre="Ruth", Apellido="Anastacio"
    return formatTitleCase(`${tokens[0]} ${tokens[2]}`);
  }

  // 4 o más palabras:
  // Ej: "Luis Jhonatan La Cruz Urbano" -> tokens = ["Luis", "Jhonatan", "La", "Cruz", "Urbano"]
  if (compoundPrefixes.has(tokens[2].toLowerCase()) && tokens[3]) {
    // Apellido paterno compuesto en índice 2: "La Cruz"
    return formatTitleCase(`${tokens[0]} ${tokens[2]} ${tokens[3]}`);
  }

  if (compoundPrefixes.has(tokens[1].toLowerCase()) && tokens[2]) {
    // Si el apellido inicia en índice 1 (solo un nombre de pila): "Luis De La Cruz Urbano"
    if (compoundPrefixes.has(tokens[2].toLowerCase()) && tokens[3]) {
      return formatTitleCase(`${tokens[0]} ${tokens[1]} ${tokens[2]} ${tokens[3]}`);
    }
    return formatTitleCase(`${tokens[0]} ${tokens[1]} ${tokens[2]}`);
  }

  // Caso estándar 4 palabras: "Ruth Lizeth Anastacio Moncada" -> "Ruth Anastacio"
  // "María Pía Marquez Cabanillas" -> "María Marquez"
  return formatTitleCase(`${tokens[0]} ${tokens[2]}`);
}
