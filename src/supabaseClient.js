import { createClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auumprvvepxecwosqvff.supabase.co';
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
};

const getSupabaseAnonKey = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_VSn_lrWURCpXW6RynNI3LQ_2vfI33u8';
};

export const supabaseUrl = getSupabaseUrl();
export const supabaseAnonKey = getSupabaseAnonKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


