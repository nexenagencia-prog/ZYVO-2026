import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminEmail } from './lib/cms/auth.mjs';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isLogin = path === '/cms/login';
  const isReset = path === '/cms/reset-password';

  if (path.startsWith('/cms') && !isLogin) {
    if (!user || !isAdminEmail(user.email)) {
      const login = request.nextUrl.clone();
      login.pathname = '/cms/login';
      login.searchParams.set('reason', user ? 'unauthorized' : 'session');
      return NextResponse.redirect(login);
    }
    if (!isReset) {
      const { data } = await supabase.from('admin_users').select('must_change_password').eq('email', 'sandrobellomind@gmail.com').maybeSingle();
      if (data?.must_change_password) {
        const reset = request.nextUrl.clone();
        reset.pathname = '/cms/reset-password';
        reset.searchParams.set('first', '1');
        return NextResponse.redirect(reset);
      }
    }
  }

  if (isLogin && user && isAdminEmail(user.email)) {
    const target = request.nextUrl.clone();
    target.pathname = '/cms';
    target.search = '';
    return NextResponse.redirect(target);
  }

  return response;
}

export const config = { matcher: ['/cms/:path*'] };
