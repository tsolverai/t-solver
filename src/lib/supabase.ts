import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ejknagjjxpesncyljnef.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqa25hZ2pqeHBlc25jeWxqbmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDI2MDAsImV4cCI6MjA5NDMxODYwMH0.QVAtUDPDuzkrKMvMPPGlRaE6WxUYsS3cz6F9pbFXjoY';

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
