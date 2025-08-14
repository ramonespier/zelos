// import { verifyAuth } from "@/utils/auth";
// import { NextRequest, NextResponse } from "next/server";

// const protectedRoutes = ["/api/admin"];

// export async function middleware(req: NextRequest) {
//     if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
//         const auth = await verifyAuth(req);

//         if (auth instanceof NextResponse) return auth;

//         const response = NextResponse.next()
//         response.cookies.set("user", JSON.stringify(auth), {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//             path: "/"
//         })

//         return response;
//     }

//     return NextResponse.next()
// }

// export const config = {
//     matcher: "/api/:path*"
// }
