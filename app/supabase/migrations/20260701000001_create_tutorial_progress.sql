-- Create tutorial_progress table
create table if not exists public.tutorial_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  tutorial_id uuid references public.tutorials(id) on delete cascade not null,
  current_step integer default 1 not null,
  completed_steps jsonb default '[]'::jsonb not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, tutorial_id)
);

-- Enable RLS
alter table public.tutorial_progress enable row level security;

-- RLS Policies
create policy "Users can view their own progress" 
  on public.tutorial_progress for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own progress" 
  on public.tutorial_progress for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own progress" 
  on public.tutorial_progress for update 
  using (auth.uid() = user_id);
