import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Creates a Supabase client for use in Edge middleware.
 * Reads cookies from the request and writes session cookies to the response.
 * Call getSession() or getUser() to refresh the session before returning the response.
 */
export async function createSupabaseMiddlewareClient(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean }) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: { path?: string }) {
        response.cookies.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });

  // Refresh session so middleware sees up-to-date auth state
  const { data: { user } } = await supabase.auth.getUser();

  return { supabase, response, user };
}
