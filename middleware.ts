import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to login and register pages without authentication
  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return NextResponse.next()
  }
  
  // For other admin routes, let the client-side handle authentication
  // This prevents server-side redirects that can cause empty pages
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}
