import { createClient } from '@supabase/supabase-js';

const getValidSupabaseUrl = (rawUrl: string): string => {
  let url = (rawUrl || '').trim();
  
  if (!url) {
    return 'https://placeholder.supabase.co';
  }

  // If user pasted postgresql:// URL (e.g. postgresql://postgres:pass@db.REF.supabase.co:5432/postgres)
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    const match = url.match(/db\.([a-z0-9]+)\.supabase\.co/i);
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`;
    }
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.origin;
    }
  } catch {
    // fallback
  }

  return 'https://placeholder.supabase.co';
};

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseUrl = getValidSupabaseUrl(rawSupabaseUrl);
export const supabaseAnonKey = rawSupabaseAnonKey || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return Boolean(
    rawSupabaseUrl &&
    rawSupabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


