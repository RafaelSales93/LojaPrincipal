-- Seed local para demonstrar a estrutura do painel administrativo.
-- Atualize os valores abaixo depois de criar a conta de administração no Supabase.
-- Este arquivo é útil para desenvolvimento local e testes com o CLI.

create table if not exists public.demo_seed (
  id integer primary key,
  created_at timestamptz not null default now()
);

insert into public.demo_seed (id)
values (1)
on conflict (id) do nothing;
