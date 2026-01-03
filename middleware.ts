// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    
    const token = request.cookies.get('accessToken')?.value
    const isLoginPage = request.nextUrl.pathname === '/auth/login'
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth/')

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
    if (!token && !isLoginPage && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
