-- ==============================================================================
-- SISNETS - SISTEMA DE NETWORKING EN TRABAJO SOCIAL
-- BASE DE DATOS COMPLETA PARA SUPABASE
-- Administradora: Ruth Anastacio (ruthanastacio191202@gmail.com / 123456)
-- Directorio: Vacío (Listo para registro manual de pruebas)
-- ==============================================================================

-- Habilitar extensión para encriptación de contraseñas y UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------------------
-- 1. TABLA: PROFILES (Perfiles vinculados al Auth de Supabase)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL DEFAULT 'colegiada' CHECK (rol IN ('admin', 'colegiada')),
  cargo TEXT DEFAULT 'Trabajadora Social',
  institucion TEXT DEFAULT 'SISNETS (Sede Central)',
  telefono TEXT DEFAULT '+51 987 654 321',
  avatar_url TEXT DEFAULT '/logo.png',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Profiles
DROP POLICY IF EXISTS "Perfiles visibles para usuarios autenticados" ON public.profiles;
CREATE POLICY "Perfiles visibles para usuarios autenticados" 
ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins pueden actualizar cualquier perfil" ON public.profiles;
CREATE POLICY "Admins pueden actualizar cualquier perfil" 
ON public.profiles FOR ALL TO authenticated 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- ------------------------------------------------------------------------------
-- 2. FUNCIÓN Y TRIGGER: Creación automática de perfil al registrarse
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_nombre TEXT;
  v_rol TEXT;
  v_cargo TEXT;
  v_inst TEXT;
BEGIN
  IF NEW.email ILIKE '%ruthanastacio%' OR NEW.email ILIKE '%admin%' THEN
    v_rol := 'admin';
    v_cargo := 'Administradora General';
    v_nombre := 'Ruth Anastacio';
    v_inst := 'SISNETS (Sede Central)';
  ELSE
    v_rol := 'colegiada';
    v_cargo := 'Trabajadora Social';
    v_nombre := COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1));
    v_inst := COALESCE(NEW.raw_user_meta_data->>'institucion', 'Hospital / Institución');
  END IF;

  INSERT INTO public.profiles (id, nombre, correo, rol, cargo, institucion)
  VALUES (NEW.id, v_nombre, NEW.email, v_rol, v_cargo, v_inst)
  ON CONFLICT (id) DO UPDATE SET
    rol = EXCLUDED.rol,
    cargo = EXCLUDED.cargo,
    nombre = EXCLUDED.nombre;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. TABLA: DIRECTORIO_COLEGAS (Centros Laborales, Prácticas y Apoyo Fraterno)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.directorio_colegas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  institucion TEXT NOT NULL,
  sector TEXT NOT NULL,
  tipo TEXT DEFAULT 'Colegiada',
  apoyo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  correo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.directorio_colegas ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Directorio
DROP POLICY IF EXISTS "Lectura de directorio para usuarias autenticadas" ON public.directorio_colegas;
CREATE POLICY "Lectura de directorio para usuarias autenticadas" 
ON public.directorio_colegas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Colegiadas pueden publicar su centro" ON public.directorio_colegas;
CREATE POLICY "Colegiadas pueden publicar su centro" 
ON public.directorio_colegas FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Edicion de fichas (propietaria o admin)" ON public.directorio_colegas;
CREATE POLICY "Edicion de fichas (propietaria o admin)" 
ON public.directorio_colegas FOR UPDATE TO authenticated 
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
);

DROP POLICY IF EXISTS "Eliminacion de fichas (propietaria o admin)" ON public.directorio_colegas;
CREATE POLICY "Eliminacion de fichas (propietaria o admin)" 
ON public.directorio_colegas FOR DELETE TO authenticated 
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
);

-- ------------------------------------------------------------------------------
-- 4. USUARIO ADMINISTRADOR ÚNICO: Ruth Anastacio (ruthanastacio191202@gmail.com / 123456)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_admin_id UUID := gen_random_uuid();
  v_admin_email TEXT := 'ruthanastacio191202@gmail.com';
  v_admin_pass TEXT := '123456';
  v_encrypted_pass TEXT := crypt(v_admin_pass, gen_salt('bf'));
BEGIN
  -- Si el usuario no existe en auth.users, lo creamos
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_admin_email) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      v_admin_id,
      '00000000-0000-0000-0000-000000000000',
      v_admin_email,
      v_encrypted_pass,
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"nombre":"Ruth Anastacio","institucion":"SISNETS (Sede Central)"}'::jsonb,
      NOW(),
      NOW(),
      'authenticated',
      'authenticated'
    );

    -- Insertar en auth.identities para compatibilidad con GoTrue
    BEGIN
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        v_admin_id::text,
        v_admin_id,
        json_build_object('sub', v_admin_id::text, 'email', v_admin_email)::jsonb,
        'email',
        v_admin_id::text,
        NOW(),
        NOW(),
        NOW()
      );
    EXCEPTION WHEN OTHERS THEN
      BEGIN
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          v_admin_id::text,
          v_admin_id,
          json_build_object('sub', v_admin_id::text, 'email', v_admin_email)::jsonb,
          'email',
          NOW(),
          NOW(),
          NOW()
        );
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END;

    -- Asegurar perfil en public.profiles
    INSERT INTO public.profiles (
      id,
      nombre,
      correo,
      rol,
      cargo,
      institucion,
      telefono
    ) VALUES (
      v_admin_id,
      'Ruth Anastacio',
      v_admin_email,
      'admin',
      'Administradora General',
      'SISNETS (Sede Central)',
      '+51 987 654 321'
    )
    ON CONFLICT (id) DO UPDATE SET
      rol = 'admin',
      cargo = 'Administradora General',
      nombre = 'Ruth Anastacio';

  ELSE
    -- Si ya existía, actualizamos su contraseña a 123456 y confirmamos correo
    SELECT id INTO v_admin_id FROM auth.users WHERE email = v_admin_email;

    UPDATE auth.users
    SET 
      encrypted_password = v_encrypted_pass,
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      raw_user_meta_data = json_build_object('nombre', 'Ruth Anastacio', 'institucion', 'SISNETS (Sede Central)')::jsonb,
      updated_at = NOW()
    WHERE email = v_admin_email;

    -- Actualizar perfil en public.profiles
    INSERT INTO public.profiles (
      id,
      nombre,
      correo,
      rol,
      cargo,
      institucion,
      telefono
    ) VALUES (
      v_admin_id,
      'Ruth Anastacio',
      v_admin_email,
      'admin',
      'Administradora General',
      'SISNETS (Sede Central)',
      '+51 987 654 321'
    )
    ON CONFLICT (id) DO UPDATE SET
      rol = 'admin',
      cargo = 'Administradora General',
      nombre = 'Ruth Anastacio';
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. LIMPIAR DIRECTORIO (Vacío para iniciar pruebas de registro desde cero)
-- ------------------------------------------------------------------------------
TRUNCATE TABLE public.directorio_colegas;
