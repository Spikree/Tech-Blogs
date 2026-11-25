import { withAuth } from "next-auth/middleware";

export function proxy(request) {
    return withAuth(request);
}

export const config = { matcher: ["/home", "/yourBlogs","/createBlog", "/savedBlogs","/api/:path*"] }