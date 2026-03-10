import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return { url, anonKey };
};

// Browser-side client (for client components/hooks)
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}

// Server-side client (for server components/routes/actions)
export function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // Set/remove are no-ops for now; you'll implement them in route handlers
      // or middleware when you add auth/session handling.
      set(_name: string, _value: string, _options: CookieOptions) {
        // intentionally left blank
      },
      remove(_name: string, _options: CookieOptions) {
        // intentionally left blank
      },
    },
  });
}

