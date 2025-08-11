// import { cookies } from "next/headers";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Define which paths should be protected
    if (pathname.startsWith('/admin')) {
      const token = request.cookies.get('auth_token'); // Check if the user has a valid token

      // If no token is found, redirect to login
      if (!token) {
        return Response.redirect(new URL('/login', request.url));
      }
    }
    // Allow the request to continue if authenticated
    return Response.next();
  }