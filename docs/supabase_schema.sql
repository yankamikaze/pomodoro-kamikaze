-- ====================================================================================
-- POMODORO KAMIKAZE - SCRIPT INICIAL DO BANCO DE DADOS (SUPABASE)
-- ====================================================================================

-- 1. Criação das Tabelas

-- Tabela Profiles (Estende auth.users do Supabase)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'ROLE_USER' CHECK (role IN ('ROLE_MASTER', 'ROLE_USER')),
    theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Configurações do Pomodoro
CREATE TABLE public.pomodoro_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    cycles_count INT DEFAULT 4 NOT NULL,
    study_time_minutes INT DEFAULT 25 NOT NULL,
    short_break_minutes INT DEFAULT 5 NOT NULL,
    long_break_minutes INT DEFAULT 15 NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Disciplinas
CREATE TABLE public.disciplines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Sessões de Estudo (Consolidado)
CREATE TABLE public.study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    discipline_id UUID REFERENCES public.disciplines(id) ON DELETE SET NULL,
    parent_theme TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    planned_duration_minutes INT NOT NULL,
    real_start_time TIMESTAMP WITH TIME ZONE,
    real_end_time TIMESTAMP WITH TIME ZONE,
    real_duration_minutes INT,
    completed_cycles INT,
    status TEXT DEFAULT 'AGENDADA' CHECK (status IN ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'NAO_REALIZADA')),
    observations TEXT,
    pomodoro_settings_used JSONB, -- Opcional, caso queira gravar a config usada no dia
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================================
-- 2. Configuração de Row Level Security (RLS)
-- Garante que um usuário não acesse dados de outro
-- ====================================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para Pomodoro Settings
CREATE POLICY "Usuários podem ver suas configurações" ON public.pomodoro_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar suas configurações" ON public.pomodoro_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar suas configurações" ON public.pomodoro_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas configurações" ON public.pomodoro_settings FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Disciplines
CREATE POLICY "Usuários podem ver suas disciplinas" ON public.disciplines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar disciplinas" ON public.disciplines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar suas disciplinas" ON public.disciplines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas disciplinas" ON public.disciplines FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Study Sessions
CREATE POLICY "Usuários podem ver suas sessões" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar sessões" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar suas sessões" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas sessões" ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================================
-- 3. Trigger para criar perfil automaticamente ao se registrar no Supabase Auth
-- ====================================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Insere também uma configuração padrão de pomodoro para o novo usuário
  INSERT INTO public.pomodoro_settings (user_id, cycles_count, study_time_minutes, short_break_minutes, long_break_minutes, is_default)
  VALUES (new.id, 4, 25, 5, 15, true);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
