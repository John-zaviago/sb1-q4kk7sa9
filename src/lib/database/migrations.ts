import { supabase } from '../supabase';

export async function runMigrations() {
  const { error } = await supabase.rpc('run_migrations', {
    sql: `
      -- Enable RLS
      alter table profiles enable row level security;

      -- Create policies
      create policy "Profiles are viewable by owners"
        on profiles for select
        using (auth.uid() = id);

      create policy "Users can insert their own profile"
        on profiles for insert
        with check (auth.uid() = id);

      create policy "Users can update own profile"
        on profiles for update
        using (auth.uid() = id);
    `
  });

  if (error) {
    console.error('Migration error:', error);
    throw error;
  }
}