import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn('Missing Supabase env vars. Copy .env.local.example to .env.local and fill it in.');
}

// One shared client. It remembers the logged-in session AND powers the
// realtime connection used in components/Board.js.
export const supabase = createClient(url, anonKey);
