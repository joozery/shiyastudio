import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix} from './navigation';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',

  localePrefix
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's an admin path (e.g. /th/admin, /en/admin)
  // We exclude the login page from protection
  const isAdminPath = pathname.match(/^\/(th|en)\/admin/);
  const isLoginPage = pathname.match(/^\/(th|en)\/admin\/login/);

  if (isAdminPath && !isLoginPage) {
    const session = request.cookies.get('admin_session');
    if (!session) {
      const locale = pathname.split('/')[1] || 'en';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(th|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
