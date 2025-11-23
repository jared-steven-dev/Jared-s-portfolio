import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function healthCheck() {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase health check failed:', error.message);
      return false;
    }
    console.log('Supabase health check successful. Users count:', count);
    return true;
  } catch (error) {
    console.error('Supabase health check failed:', error);
    return false;
  }
}

// Periodically run health check every 5 minutes (300000 milliseconds)
setInterval(healthCheck, 300000);