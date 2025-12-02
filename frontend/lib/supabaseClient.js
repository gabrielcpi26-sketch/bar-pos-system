import { createClient } from '@supabase/supabase-js';

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key'
);
