import { NextResponse } from "next/server";

export function middleware(request) {

    const token = request.cookies.get('token')?.value;
    const userRole = request.cookies.get('userRole')?.value;

    const { pathname } = request.nextUrl;

    if (!token) {
        if (pathname === '/login') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && pathname === "login") {
        let destination = '/'

        switch (userRole) {
            case 'usuario': destination = '/usuario'; break;
            case 'admin': destination = '/admin'; break;
            case 'tecnico': destination = '/tecnico'; break;
        }

        return NextResponse.redirect(new URL(destination, request.url))
    }

    if (pathname.startsWith('/admin') && userRole !== 'admin') {
        // Se a rota é de admin, mas a role não é 'adm', barra a entrada!
        return NextResponse.redirect(new URL('/acesso-negado', request.url)); // ou para a home
    }

    if (pathname.startsWith('/tecnico') && userRole !== 'tecnico') {
        // Se a rota é de técnico, mas a role não é 'tec', barra a entrada!
        return NextResponse.redirect(new URL('/acesso-negado', request.url));
    }

    if (pathname.startsWith('/usuario') && userRole !== 'usuario') {
        // Se a rota é de usuário, mas a role não é 'user', barra a entrada!
        return NextResponse.redirect(new URL('/acesso-negado', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',      // Todas as rotas dentro de /admin
        '/tecnico/:path*',    // Todas as rotas dentro de /tecnico
        '/usuario/:path*',    // Todas as rotas dentro de /usuario
        '/login'              // A própria página de login (para redirecionar quem já está logado)
    ]
}