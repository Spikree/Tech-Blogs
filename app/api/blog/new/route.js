import { requireWriteAccess } from "@/lib/write-access";
import Blog from "../../../../models/blog.js"

export const POST = async (req) => {
    const {title, content} = await req.json();

    if(!title || !content) {
        return new Response("Missing required fields",{status:400})
    }

    try {
        const access = await requireWriteAccess(req);
        if (access.error) return access.error;
        const newBlog = new Blog({user: access.userId, title: title, content: content})

        await newBlog.save();

        return new Response(JSON.stringify({newBlog, message: "Blog uploaded sucessfully"}), {status:201})
    } catch (error) {
        console.log(error)
        return new Response("Failed to upload the blog",{status:500})
    }
}