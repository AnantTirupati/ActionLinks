-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Create tutorials table
create table if not exists public.tutorials (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid() references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  source_type text not null check (source_type in ('youtube', 'website', 'upload')),
  source_url text,
  thumbnail_url text,
  status text not null check (status in ('draft', 'processing', 'ready', 'published')) default 'draft',
  visibility text not null check (visibility in ('private', 'public')) default 'private',
  prompt_version text default '1.0',
  ai_model text default 'gemini-2.5-flash',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tutorial_steps table
create table if not exists public.tutorial_steps (
  id uuid default gen_random_uuid() primary key,
  tutorial_id uuid references public.tutorials(id) on delete cascade not null,
  step_number integer not null,
  title text not null,
  instruction text,
  selector text,
  action_type text,
  metadata jsonb default '{}'::jsonb not null
);

-- Enable RLS for both tables
alter table public.tutorials enable row level security;
alter table public.tutorial_steps enable row level security;

-- Create policies for tutorials
-- 1. Select policy: Users can see their own tutorials OR any public tutorial
create policy "Users can view their own or public tutorials"
  on public.tutorials for select
  using (
    auth.uid() = user_id 
    or visibility = 'public'
  );

-- 2. Insert policy: Users can insert their own tutorials
create policy "Users can insert their own tutorials"
  on public.tutorials for insert
  with check (
    auth.uid() = user_id
  );

-- 3. Update policy: Users can update their own tutorials
create policy "Users can update their own tutorials"
  on public.tutorials for update
  using (
    auth.uid() = user_id
  );

-- 4. Delete policy: Users can delete their own tutorials
create policy "Users can delete their own tutorials"
  on public.tutorials for delete
  using (
    auth.uid() = user_id
  );

-- Create policies for tutorial_steps
-- Users can view tutorial steps if they can view the parent tutorial
create policy "Users can view steps for accessible tutorials"
  on public.tutorial_steps for select
  using (
    exists (
      select 1 from public.tutorials
      where tutorials.id = tutorial_steps.tutorial_id
      and (tutorials.user_id = auth.uid() or tutorials.visibility = 'public')
    )
  );

-- Users can insert steps if they own the parent tutorial
create policy "Users can insert steps for their own tutorials"
  on public.tutorial_steps for insert
  with check (
    exists (
      select 1 from public.tutorials
      where tutorials.id = tutorial_steps.tutorial_id
      and tutorials.user_id = auth.uid()
    )
  );

-- Users can update steps if they own the parent tutorial
create policy "Users can update steps for their own tutorials"
  on public.tutorial_steps for update
  using (
    exists (
      select 1 from public.tutorials
      where tutorials.id = tutorial_steps.tutorial_id
      and tutorials.user_id = auth.uid()
    )
  );

-- Users can delete steps if they own the parent tutorial
create policy "Users can delete steps for their own tutorials"
  on public.tutorial_steps for delete
  using (
    exists (
      select 1 from public.tutorials
      where tutorials.id = tutorial_steps.tutorial_id
      and tutorials.user_id = auth.uid()
    )
  );

-- Trigger for updating updated_at timestamp on tutorials
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger on_tutorials_update
  before update on public.tutorials
  for each row
  execute function public.handle_updated_at();
