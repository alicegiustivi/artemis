import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client for use in client components.
 * Use this in 'use client' components for auth (signIn, signUp) and client-side data.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createBrowserClient(url, anonKey);
}
