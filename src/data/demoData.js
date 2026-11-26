// Datos iniciales de usuarios del sistema SISNETS

// Usuario Administrador Principal
export const ADMIN_RUTH_USER = {
  id: 'admin_ruth',
  nombre: 'Ruth Anastacio',
  correo: 'ruthanastacio191202@gmail.com',
  telefono: '+51 987 654 321',
  rol: 'admin',
  condicion: 'egresada',
  centro: '',
  sector: '',
  estado: 'activa',
  verificada: true,
  fechaRegistro: '01/01/2026'
};

// Usuario Administrador y Fundador Oficial
export const LUIS_LACRUZ_USER = {
  id: 'usr_luis_lacruz',
  nombre: 'Luis Jhonatan La Cruz Urbano',
  correo: 'luislacruz326@gmail.com',
  telefono: '+51 958 262 585',
  rol: 'admin',
  condicion: 'egresada',
  centro: '',
  sector: '',
  estado: 'activa',
  verificada: true,
  fechaRegistro: '01/01/2026'
};

export const INITIAL_REGISTERED_USERS = [ADMIN_RUTH_USER, LUIS_LACRUZ_USER];

export const DEMO_COLEGAS = [];
