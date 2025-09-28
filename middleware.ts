import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Authentication disabled for testing
  // TODO: Re-enable authentication later
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}
