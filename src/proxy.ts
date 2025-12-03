import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { GetTokenParams } from 'next-auth/jwt';
import { getToken } from 'next-auth/jwt';

export const proxy = async (request: NextRequest) => {
  let params: GetTokenParams = {
    req: request,
    secret: process.env.AUTH_SECRET ?? 'secret',
  };

  if (process.env.NODE_ENV === 'production') {
    params = {
      ...params,
      cookieName: '__Secure-authjs.session-token',
    };
  }

  const token = await getToken(params);

  if (!token) {
    const url = new URL('/error', request.url);
    url.searchParams.set('message', 'Insufficient rights. Please, authorize!');

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/ingredients/:path*', '/recipes/new', '/recipes/:id/edit'],
};
