import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://auumprvvepxecwosqvff.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_VSn_lrWURCpXW6RynNI3LQ_2vfI33u8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
