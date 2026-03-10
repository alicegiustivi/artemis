console.log('[middleware] FILE LOADED');

import { createSupabaseMiddlewareClient } from '@/lib/supabase-middleware';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabase, response, user } = await createSupabaseMiddlewareClient(request);

  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');
  const isOnboarding = pathname === '/onboarding';

  if (!user) {
    if (isDashboard || isOnboarding) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  if (isDashboard || isOnboarding) {
    const profileResult = await supabase
      .from('profiles')
      .select('last_period_date')
      .eq('id', user.id)
      .maybeSingle();

    const profile = profileResult.data;

    console.log('[middleware] path:', pathname);
    console.log('[middleware] user id:', user?.id ?? null);
    console.log('[middleware] profile query:', { data: profileResult.data, error: profileResult.error });
    const hasProfile = profile != null && profile.last_period_date != null;
    console.log('[middleware] hasProfile:', hasProfile);

    if (isDashboard && !hasProfile) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    if (isOnboarding && hasProfile) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
