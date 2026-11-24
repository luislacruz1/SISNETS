-- ==============================================================================
-- SISNETS - SISTEMA DE NETWORKING EN TRABAJO SOCIAL
-- ESQUEMA DEFINITIVO PARA SINCRONIZACIÓN EN LA NUBE (SUPABASE)
-- Administradores Oficiales: Ruth Anastacio & Luis Jhonatan La Cruz Urbano
-- ==============================================================================

-- 1. Habilitar extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 2. ELIMINAR POLÍTICAS PREVIAS EN DIRECTORIO QUE BLOQUEAN CAMBIO DE TIPO
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  pol RECORD;
BEGIN
  -- Eliminar automáticamente todas las políticas existentes en directorio_colegas
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'directorio_colegas' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.directorio_colegas', pol.policyname);
  END LOOP;
  
  -- Eliminar automáticamente todas las políticas existentes en usuarios
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'usuarios' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.usuarios', pol.policyname);
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. TABLA: USUARIOS (Sincronización de Colegiadas y Administradores)
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

ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS debeCambiarPassword BOOLEAN DEFAULT false;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '/logo.png';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ------------------------------------------------------------------------------
-- 4. TABLA: DIRECTORIO_COLEGAS (Publicaciones de Centros y Apoyo)
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

-- Ahora que las políticas fueron eliminadas, alterar tipos y columnas sin restricción
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
-- 5. PERMISOS DE ACCESO (GRANT A ANON Y AUTHENTICATED)
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.usuarios TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.directorio_colegas TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 6. NUEVAS POLÍTICAS RLS LIMPIAS (Acceso Total para la Aplicación)
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
-- 7. REPLICACIÓN EN TIEMPO REAL (WEBSOCKETS DE ALTA DISPONIBILIDAD)
-- Configuración idéntica al estándar reactivo de SIMEC (Mantenimiento de Equipos)
-- ------------------------------------------------------------------------------
-- A. Habilitar REPLICA IDENTITY FULL para que UPDATE y DELETE transmitan la fila completa
ALTER TABLE public.usuarios REPLICA IDENTITY FULL;
ALTER TABLE public.directorio_colegas REPLICA IDENTITY FULL;

-- B. Publicar en el canal oficial supabase_realtime
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
  WHEN OTHERS THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 8. REGISTRO DE ADMINISTRADORES OFICIALES
-- ------------------------------------------------------------------------------
INSERT INTO public.usuarios (id, nombre, correo, telefono, rol, condicion, centro, sector, estado, verificada, fechaRegistro, avatar)
VALUES 
  ('admin_ruth', 'Ruth Anastacio', 'ruthanastacio191202@gmail.com', '+51 987 654 321', 'admin', 'egresada', 'SISNETS (Sede Central)', 'Gestión Institucional', 'activa', true, '01/01/2026', '/logo.png'),
  ('usr_luis_lacruz', 'Luis Jhonatan La Cruz Urbano', 'luislacruz326@gmail.com', '+51 958 262 585', 'admin', 'egresada', 'SISNETS (Sede Central)', 'Gestión Institucional', 'activa', true, '01/01/2026', '/logo.png')
ON CONFLICT (correo) DO UPDATE SET
  rol = 'admin',
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono;
