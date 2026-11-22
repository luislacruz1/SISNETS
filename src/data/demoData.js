// Datos iniciales de demostración y usuarios del sistema SISNETS

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'admin_stephanie',
    nombre: 'Mg. Stephanie Natalia Laos Arteaga',
    correo: 'admin@trabajosocial.org',
    telefono: '+51 987 654 321',
    rol: 'admin',
    condicion: 'egresada',
    centro: 'Red de Colegas de Trabajo Social (Sede Central)',
    sector: 'Comunitario / ONGs',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '15/01/2026'
  },
  {
    id: 'usr_claudia',
    nombre: 'Lic. Claudia Morales',
    correo: 'claudia.morales@hospitalregional.gob.pe',
    telefono: '+51 987 654 321',
    rol: 'colegiada',
    condicion: 'egresada',
    centro: 'Hospital Regional (Área de Emergencia & Salud Mental)',
    sector: 'Salud',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '18/01/2026'
  },
  {
    id: 'usr_valeria',
    nombre: 'Valeria Sánchez',
    correo: 'valeria.sanchez@unmsm.edu.pe',
    telefono: '+51 922 678 345',
    rol: 'colegiada',
    condicion: 'practicante',
    centro: 'Centro de Salud San Jerónimo (MINSA)',
    sector: 'Salud',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '20/01/2026'
  },
  {
    id: 'usr_mariana',
    nombre: 'Lic. Mariana Gómez',
    correo: 'mariana.gomez.ts@mimp.gob.pe',
    telefono: '+51 945 123 789',
    rol: 'colegiada',
    condicion: 'egresada',
    centro: 'Centro Emergencia Mujer (CEM) / Juzgado de Familia',
    sector: 'Justicia',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '22/01/2026'
  },
  {
    id: 'usr_camila',
    nombre: 'Camila Fernández',
    correo: 'camila.fernandez@ts.edu.pe',
    telefono: '+51 912 345 678',
    rol: 'colegiada',
    condicion: 'practicante',
    centro: 'Fiscalía Provincial de Familia de Lima',
    sector: 'Justicia',
    estado: 'activa',
    verificada: false,
    fechaRegistro: '25/01/2026'
  },
  {
    id: 'usr_roberto',
    nombre: 'Lic. Roberto Quispe',
    correo: 'rquispe.ts@muniprovincial.gob.pe',
    telefono: '+51 978 456 123',
    rol: 'colegiada',
    condicion: 'egresada',
    centro: 'Municipalidad Provincial (Gerencia de Desarrollo Social & OMAPED)',
    sector: 'Municipalidades',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '28/01/2026'
  },
  {
    id: 'usr_lucia',
    nombre: 'Lucía Paredes',
    correo: 'lucia.paredes@tsocial.pe',
    telefono: '+51 933 456 789',
    rol: 'colegiada',
    condicion: 'practicante',
    centro: 'DEMUNA Municipalidad Distrital',
    sector: 'Municipalidades',
    estado: 'activa',
    verificada: false,
    fechaRegistro: '30/01/2026'
  },
  {
    id: 'usr_andrea',
    nombre: 'Lic. Andrea Delgado',
    correo: 'andrea.delgado@ugel09.gob.pe',
    telefono: '+51 955 890 234',
    rol: 'colegiada',
    condicion: 'egresada',
    centro: 'Red Educativa UGEL (Área de Convivencia y Tutoría Escolar)',
    sector: 'Educación',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '02/02/2026'
  },
  {
    id: 'usr_daniela',
    nombre: 'Daniela Torres',
    correo: 'daniela.torres@estudiante.edu.pe',
    telefono: '+51 977 123 456',
    rol: 'colegiada',
    condicion: 'practicante',
    centro: 'Colegio Emblemático Luis Fabio Xammar (Dpto. Psicopedagógico)',
    sector: 'Educación',
    estado: 'activa',
    verificada: false,
    fechaRegistro: '05/02/2026'
  },
  {
    id: 'usr_patricia',
    nombre: 'Lic. Patricia Vega',
    correo: 'patricia.vega@onginfancia.org',
    telefono: '+51 944 567 890',
    rol: 'colegiada',
    condicion: 'egresada',
    centro: 'ONG Infancia y Desarrollo Social Comunitario',
    sector: 'Comunitario / ONGs',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '08/02/2026'
  },
  {
    id: 'usr_andream',
    nombre: 'Andrea Mendoza',
    correo: 'andrea.mendoza@redmadres.org',
    telefono: '+51 966 789 012',
    rol: 'colegiada',
    condicion: 'practicante',
    centro: 'Asociación Red de Madres y Promoción Social',
    sector: 'Comunitario / ONGs',
    estado: 'activa',
    verificada: false,
    fechaRegistro: '10/02/2026'
  },
  {
    id: 'usr_sofia',
    nombre: 'Lic. Sofía Méndez',
    correo: 'smendez@saludocupacional.pe',
    telefono: '+51 966 345 901',
    rol: 'colegiada',
    condicion: 'egresada',
    centro: 'Clínica & Centro de Salud Ocupacional (Sector Empresa)',
    sector: 'Empresa',
    estado: 'activa',
    verificada: true,
    fechaRegistro: '12/02/2026'
  },
  {
    id: 'usr_fiorella',
    nombre: 'Fiorella Ramos',
    correo: 'fiorella.ramos@agroempresa.pe',
    telefono: '+51 988 234 567',
    rol: 'colegiada',
    condicion: 'practicante',
    centro: 'Área de Bienestar Social & RRHH en Empresa Agroexportadora',
    sector: 'Empresa',
    estado: 'activa',
    verificada: false,
    fechaRegistro: '15/02/2026'
  }
];

export const DEMO_COLEGAS = [
  {
    id: 'demo_1',
    nombre: 'Lic. Claudia Morales',
    condicion: 'egresada',
    tipo: 'Egresada',
    cicloEstudio: null,
    institucion: 'Hospital Regional (Área de Emergencia & Salud Mental)',
    cargo: 'Abogada',
    sector: 'Salud',
    fortalezas: [
      'PUEDO DAR ORIENTACION Y RESOLUCION DE CASOS SOCIALES',
      'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS)',
      'PUEDO SER MENTORA/DAR ORIENTACION A ESTUDIANTES Y NUEVAS COLEGAS'
    ],
    apoyo: 'PUEDO DAR ORIENTACION Y RESOLUCION DE CASOS SOCIALES · PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS) · PUEDO SER MENTORA/DAR ORIENTACION A ESTUDIANTES Y NUEVAS COLEGAS',
    telefono: '+51 987 654 321',
    correo: 'claudia.morales@hospitalregional.gob.pe',
    verificada: true
  },
  {
    id: 'demo_2',
    nombre: 'Valeria Sánchez',
    condicion: 'practicante',
    tipo: 'Practicante',
    cicloEstudio: '9no Ciclo',
    institucion: 'Centro de Salud San Jerónimo (MINSA)',
    cargo: 'Practicante de Casos',
    sector: 'Salud',
    fortalezas: [
      'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS)',
      'PUEDO APOYAR EN INVESTIGACION/TESIS/ENCUESTAS'
    ],
    apoyo: 'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS) · PUEDO APOYAR EN INVESTIGACION/TESIS/ENCUESTAS',
    telefono: '+51 922 678 345',
    correo: 'valeria.sanchez@unmsm.edu.pe',
    verificada: true
  },
  {
    id: 'demo_3',
    nombre: 'Lic. Mariana Gómez',
    condicion: 'egresada',
    tipo: 'Egresada',
    cicloEstudio: null,
    institucion: 'Centro Emergencia Mujer (CEM) / Juzgado de Familia',
    cargo: 'Especialista en Casos de Violencia Familiar',
    sector: 'Justicia',
    fortalezas: [
      'PUEDO DAR ORIENTACION Y RESOLUCION DE CASOS SOCIALES',
      'PUEDO HACER INCIDENCIA PUBLICA Y ALIANZAS ESTRATEGICAS'
    ],
    apoyo: 'PUEDO DAR ORIENTACION Y RESOLUCION DE CASOS SOCIALES · PUEDO HACER INCIDENCIA PUBLICA Y ALIANZAS ESTRATEGICAS',
    telefono: '+51 945 123 789',
    correo: 'mariana.gomez.ts@mimp.gob.pe',
    verificada: true
  },
  {
    id: 'demo_4',
    nombre: 'Camila Fernández',
    condicion: 'practicante',
    tipo: 'Practicante',
    cicloEstudio: '8vo Ciclo',
    institucion: 'Fiscalía Provincial de Familia de Lima',
    cargo: 'Practicante de Bienestar',
    sector: 'Justicia',
    fortalezas: [
      'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS)',
      'PUEDO SER UN ALIADO ESTRATEGICO DESDE MI SECTOR'
    ],
    apoyo: 'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS) · PUEDO SER UN ALIADO ESTRATEGICO DESDE MI SECTOR',
    telefono: '+51 912 345 678',
    correo: 'camila.fernandez@ts.edu.pe',
    verificada: false
  },
  {
    id: 'demo_5',
    nombre: 'Lic. Roberto Quispe',
    condicion: 'egresada',
    tipo: 'Egresada',
    cicloEstudio: null,
    institucion: 'Municipalidad Provincial (Gerencia de Desarrollo Social & OMAPED)',
    cargo: 'Responsable de OMAPED',
    sector: 'Municipalidades',
    fortalezas: [
      'TENGO ALIADOS ESTRATEGICOS EN EMPRESAS PRIVADAS/PUBLICAS',
      'PUEDO COMPARTIR OPORTUNIDADES LABORALES DESDE MI SECTOR'
    ],
    apoyo: 'TENGO ALIADOS ESTRATEGICOS EN EMPRESAS PRIVADAS/PUBLICAS · PUEDO COMPARTIR OPORTUNIDADES LABORALES DESDE MI SECTOR',
    telefono: '+51 978 456 123',
    correo: 'rquispe.ts@muniprovincial.gob.pe',
    verificada: true
  },
  {
    id: 'demo_6',
    nombre: 'Lucía Paredes',
    condicion: 'practicante',
    tipo: 'Practicante',
    cicloEstudio: '7mo Ciclo',
    institucion: 'DEMUNA Municipalidad Distrital',
    cargo: 'Practicante de Apoyo Social',
    sector: 'Municipalidades',
    fortalezas: [
      'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS)',
      'PUEDO SER MENTORA/DAR ORIENTACION A ESTUDIANTES Y NUEVAS COLEGAS'
    ],
    apoyo: 'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS) · PUEDO SER MENTORA/DAR ORIENTACION A ESTUDIANTES Y NUEVAS COLEGAS',
    telefono: '+51 933 456 789',
    correo: 'lucia.paredes@tsocial.pe',
    verificada: false
  },
  {
    id: 'demo_7',
    nombre: 'Lic. Andrea Delgado',
    condicion: 'egresada',
    tipo: 'Egresada',
    cicloEstudio: null,
    institucion: 'Red Educativa UGEL (Área de Convivencia y Tutoría Escolar)',
    cargo: 'Coordinadora de Tutoría Escolar',
    sector: 'Educación',
    fortalezas: [
      'PUEDO DAR ORIENTACION Y RESOLUCION DE CASOS SOCIALES',
      'PUEDO COMPARTIR CURSOS Y CAPACITACIONES DESDE MI SECTOR'
    ],
    apoyo: 'PUEDO DAR ORIENTACION Y RESOLUCION DE CASOS SOCIALES · PUEDO COMPARTIR CURSOS Y CAPACITACIONES DESDE MI SECTOR',
    telefono: '+51 955 890 234',
    correo: 'andrea.delgado@ugel09.gob.pe',
    verificada: true
  },
  {
    id: 'demo_8',
    nombre: 'Daniela Torres',
    condicion: 'practicante',
    tipo: 'Practicante',
    cicloEstudio: '10mo Ciclo',
    institucion: 'Colegio Emblemático Luis Fabio Xammar (Dpto. Psicopedagógico)',
    cargo: 'Practicante de Tutoría',
    sector: 'Educación',
    fortalezas: [
      'PUEDO APOYAR EN INVESTIGACION/TESIS/ENCUESTAS',
      'PUEDO SER MENTORA/DAR ORIENTACION A ESTUDIANTES Y NUEVAS COLEGAS'
    ],
    apoyo: 'PUEDO APOYAR EN INVESTIGACION/TESIS/ENCUESTAS · PUEDO SER MENTORA/DAR ORIENTACION A ESTUDIANTES Y NUEVAS COLEGAS',
    telefono: '+51 977 123 456',
    correo: 'daniela.torres@estudiante.edu.pe',
    verificada: false
  },
  {
    id: 'demo_9',
    nombre: 'Lic. Patricia Vega',
    condicion: 'egresada',
    tipo: 'Egresada',
    cicloEstudio: null,
    institucion: 'ONG Infancia y Desarrollo Social Comunitario',
    cargo: 'Directora de Proyectos Comunitarios',
    sector: 'Comunitario / ONGs',
    fortalezas: [
      'PUEDO HACER INCIDENCIA PUBLICA Y ALIANZAS ESTRATEGICAS',
      'PUEDO CONSEGUIR PONENTES ALIADOS',
      'PUEDO SER EXPOSITORA/CAPACITADORA'
    ],
    apoyo: 'PUEDO HACER INCIDENCIA PUBLICA Y ALIANZAS ESTRATEGICAS · PUEDO CONSEGUIR PONENTES ALIADOS · PUEDO SER EXPOSITORA/CAPACITADORA',
    telefono: '+51 944 567 890',
    correo: 'patricia.vega@onginfancia.org',
    verificada: true
  },
  {
    id: 'demo_10',
    nombre: 'Andrea Mendoza',
    condicion: 'practicante',
    tipo: 'Practicante',
    cicloEstudio: '8vo Ciclo',
    institucion: 'Asociación Red de Madres y Promoción Social',
    cargo: 'Practicante Comunitaria',
    sector: 'Comunitario / ONGs',
    fortalezas: [
      'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS)',
      'PUEDO APOYAR EN INVESTIGACION/TESIS/ENCUESTAS'
    ],
    apoyo: 'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS) · PUEDO APOYAR EN INVESTIGACION/TESIS/ENCUESTAS',
    telefono: '+51 966 789 012',
    correo: 'andrea.mendoza@redmadres.org',
    verificada: false
  },
  {
    id: 'demo_11',
    nombre: 'Lic. Sofía Méndez',
    condicion: 'egresada',
    tipo: 'Egresada',
    cicloEstudio: null,
    institucion: 'Clínica & Centro de Salud Ocupacional (Sector Empresa)',
    cargo: 'Jefa de Salud Ocupacional y Bienestar',
    sector: 'Empresa',
    fortalezas: [
      'TENGO ALIADOS ESTRATEGICOS EN EMPRESAS PRIVADAS/PUBLICAS',
      'PUEDO COMPARTIR OPORTUNIDADES LABORALES DESDE MI SECTOR'
    ],
    apoyo: 'TENGO ALIADOS ESTRATEGICOS EN EMPRESAS PRIVADAS/PUBLICAS · PUEDO COMPARTIR OPORTUNIDADES LABORALES DESDE MI SECTOR',
    telefono: '+51 966 345 901',
    correo: 'smendez@saludocupacional.pe',
    verificada: true
  },
  {
    id: 'demo_12',
    nombre: 'Fiorella Ramos',
    condicion: 'practicante',
    tipo: 'Practicante',
    cicloEstudio: '9no Ciclo',
    institucion: 'Área de Bienestar Social & RRHH en Empresa Agroexportadora',
    cargo: 'Practicante de Bienestar Social',
    sector: 'Empresa',
    fortalezas: [
      'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS)',
      'PUEDO SER UN ALIADO ESTRATEGICO DESDE MI SECTOR'
    ],
    apoyo: 'PUEDO COMPARTIR INSTRUMENTOS VIGENTES (INFORMES SOCIALES,FICHAS,FORMATOS) · PUEDO SER UN ALIADO ESTRATEGICO DESDE MI SECTOR',
    telefono: '+51 988 234 567',
    correo: 'fiorella.ramos@agroempresa.pe',
    verificada: false
  }
];
