import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ckokavqjmyynvrshdqqd.supabase.co';
const DEFAULT_KEY = 'sb_publishable_TRe-Aj89ySflwYMcyMBLlw_pjdNUmFo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

let supabaseInstance: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
}

export const supabase = supabaseInstance as SupabaseClient;

export const isSupabaseConfigured = () => !!supabaseInstance;
