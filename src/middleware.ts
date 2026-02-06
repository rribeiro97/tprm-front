import { NextResponse } from 'next/server';

/**
 * Next.js Middleware - Route Protection
 *
 * CURRENT STATUS: Intentionally bypassed (allows all requests)
 *
 * WHY IT'S EMPTY:
 * This middleware currently doesn't perform authentication checks because
 * tokens are stored in localStorage, which is not accessible in Next.js
 * middleware (which runs on the edge/server before the page loads).
 *
 * CURRENT PROTECTION STRATEGY (Client-Side):
 * 1. AuthContext: Checks tokens on mount and redirects if invalid
 * 2. Login page: Redirects to /dashboard if already authenticated
 * 3. Protected pages: Rely on AuthContext to redirect to /login
 *
 * LIMITATION:
 * Client-side protection means:
 * - Initial page load renders before redirect (flash of content)
 * - Users can temporarily access protected routes before client-side check
 * - SEO crawlers might index protected pages
 * - Not a security risk (API still requires valid tokens)
 *
 * FUTURE IMPROVEMENT (TODO):
 * Migrate to httpOnly cookies for token storage, which would enable:
 * - Server-side authentication in this middleware
 * - Proper SSR with authenticated state
 * - No flash of unauthenticated content
 * - Better security (XSS protection)
 *
 * @see /src/lib/tokenStorage.ts - Centralized token management
 * @see /src/contexts/AuthContext.tsx - Client-side auth protection
 */
export function middleware() {
  // Allow all requests to pass through
  // Protection is entirely client-side (see AuthContext)
  return NextResponse.next();
}

/**
 * Matcher configuration
 *
 * Run middleware on all routes except:
 * - API routes
 * - Static files (_next/static)
 * - Public files (favicon, images, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
