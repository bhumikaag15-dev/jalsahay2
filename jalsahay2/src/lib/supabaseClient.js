import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKeyCandidates = [
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  import.meta.env.VITE_SUPABASE_ANON_KEY
].filter(Boolean);

const looksLikeSupabasePublicKey = (key) => {
  return (
    key?.startsWith('sb_publishable_') ||
    (key?.startsWith('eyJ') && key.split('.').length === 3)
  );
};

const supabaseKey =
  supabaseKeyCandidates.find(looksLikeSupabasePublicKey) ||
  supabaseKeyCandidates[0];

export const supabaseConfigError = (() => {
  if (!supabaseUrl) {
    return 'Missing VITE_SUPABASE_URL in .env.local.';
  }

  if (!supabaseKey) {
    return 'Missing VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY in .env.local.';
  }

  if (!looksLikeSupabasePublicKey(supabaseKey)) {
    return 'Invalid Supabase public API key in .env.local. Paste your project anon/public key, not the project name.';
  }

  return '';
})();

if (
  supabaseConfigError &&
  import.meta.env.DEV &&
  (supabaseUrl || supabaseKey)
) {
  console.warn(supabaseConfigError);
}

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseKey || 'invalid-key'
);
