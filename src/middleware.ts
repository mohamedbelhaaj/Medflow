import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Si pas de token, rediriger vers login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const role = token.role as string

    // Routes pour ADMIN
    if (path.startsWith('/admin')) {
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Routes pour DOCTOR
    if (path.startsWith('/doctor')) {
      if (role !== 'DOCTOR') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Routes pour RECEPTIONIST
    if (path.startsWith('/reception')) {
      if (role !== 'RECEPTIONIST') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Routes pour PATIENT
    if (path.startsWith('/portal')) {
      if (role !== 'PATIENT') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Routes Dashboard (pour staff: Admin, Doctor, Receptionist)
    if (path.startsWith('/dashboard')) {
      if (role === 'PATIENT') {
        return NextResponse.redirect(new URL('/portal', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/doctor/:path*',
    '/reception/:path*',
    '/portal/:path*',
  ],
}