export { default } from "next-auth/middleware"

export const config = { matcher: ["/home", "/yourBlogs","/createBlog", "/savedBlogs","/api/:path*"] }