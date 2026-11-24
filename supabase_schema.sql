-- ==============================================================================
-- SISNETS - SISTEMA DE NETWORKING EN TRABAJO SOCIAL
-- ESQUEMA DEFINITIVO PARA SINCRONIZACIÓN EN LA NUBE (SUPABASE)
-- Administradores Oficiales: Ruth Anastacio & Luis Jhonatan La Cruz Urbano
-- ==============================================================================

-- 1. Habilitar extensión pgcrypto si no existe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 2. TABLA: USUARIOS (Sincronización de Colegiadas y Administradores)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.usuarios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  telefono TEXT,
  password TEXT,
  debeCambiarPassword BOOLEAN DEFAULT false,
  rol TEXT DEFAULT 'colegiada',
  condicion TEXT DEFAULT 'egresada',
  centro TEXT,
  sector TEXT,
  estado TEXT DEFAULT 'activa',
  verificada BOOLEAN DEFAULT true,
  fechaRegistro TEXT,
  avatar TEXT DEFAULT '/logo.png',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegurar que todas las columnas existan si la tabla ya había sido creada antes
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS debeCambiarPassword BOOLEAN DEFAULT false;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '/logo.png';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 3. TABLA: DIRECTORIO_COLEGAS (Publicaciones de Centros y Apoyo)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.directorio_colegas (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  nombre TEXT NOT NULL,
  condicion TEXT DEFAULT 'egresada',
  tipo TEXT DEFAULT 'Colegiada',
  cicloEstudio TEXT,
  institucion TEXT NOT NULL,
  centroTipo TEXT DEFAULT 'Centro Laboral',
  cargo TEXT,
  sector TEXT DEFAULT 'General',
  apoyo TEXT,
  fortalezas JSONB DEFAULT '[]'::jsonb,
  telefono TEXT NOT NULL,
  correo TEXT,
  verificada BOOLEAN DEFAULT true,
  avatar TEXT DEFAULT '/logo.png',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Si la tabla existía previamente con tipos UUID o restricciones de llave foránea, adaptarla:
ALTER TABLE IF EXISTS public.directorio_colegas DROP CONSTRAINT IF EXISTS directorio_colegas_user_id_fkey;
ALTER TABLE IF EXISTS public.directorio_colegas ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS public.directorio_colegas ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS condicion TEXT DEFAULT 'egresada';
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS cicloEstudio TEXT;
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS centroTipo TEXT DEFAULT 'Centro Laboral';
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS cargo TEXT;
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS fortalezas JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS verificada BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '/logo.png';
ALTER TABLE IF EXISTS public.directorio_colegas ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 4. PERMISOS DE ACCESO (GRANT A ANON Y AUTHENTICATED)
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.usuarios TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.directorio_colegas TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 5. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY)
-- ------------------------------------------------------------------------------
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo en usuarios" ON public.usuarios;
CREATE POLICY "Permitir todo en usuarios"
ON public.usuarios FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.directorio_colegas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo en directorio" ON public.directorio_colegas;
CREATE POLICY "Permitir todo en directorio"
ON public.directorio_colegas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 6. PUBLICACIÓN REALTIME (WebSocket en tiempo real < 1 segundo)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'usuarios'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.usuarios;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'directorio_colegas'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.directorio_colegas;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Si ya estaba agregado o permisos no aplican, continuar
END $$;

-- ------------------------------------------------------------------------------
-- 7. REGISTRO DE ADMINISTRADORES OFICIALES
-- ------------------------------------------------------------------------------
INSERT INTO public.usuarios (id, nombre, correo, telefono, rol, condicion, centro, sector, estado, verificada, fechaRegistro, avatar)
VALUES 
  ('admin_ruth', 'Ruth Anastacio', 'ruthanastacio191202@gmail.com', '+51 987 654 321', 'admin', 'egresada', 'SISNETS (Sede Central)', 'Gestión Institucional', 'activa', true, '01/01/2026', '/logo.png'),
  ('usr_luis_lacruz', 'Luis Jhonatan La Cruz Urbano', 'luislacruz326@gmail.com', '+51 958 262 585', 'admin', 'egresada', 'SISNETS (Sede Central)', 'Gestión Institucional', 'activa', true, '01/01/2026', '/logo.png')
ON CONFLICT (correo) DO UPDATE SET
  rol = 'admin',
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono;
