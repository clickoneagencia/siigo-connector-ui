import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Proteger /dashboard: solo si hay token
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Proteger /signin y /signup: solo si NO hay token
  if ((pathname.startsWith('/signin') || pathname.startsWith('/signup')) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/signin', '/signup'],
}; 