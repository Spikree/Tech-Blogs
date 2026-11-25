import { requireWriteAccess } from "@/lib/write-access";
import Blog from "../../../../../models/blog.js"

export const PATCH = async(req,{params}) => {
    const {title, content} = await req.json();

    const {id} = await params

    try {
        const access = await requireWriteAccess(req);
        if (access.error) return access.error;
        const blog = await Blog.findOne({ _id: id, user: access.userId })

        if(!blog) {
            return new Response("Blog not found", {status:404})
        }

        blog.title = title;
        blog.content = content;

        await blog.save()

        return new Response(JSON.stringify(blog),{status:200})

    } catch (error) {
        console.log(error)
        return new Response("Failed to update the blog",{status:500})
    }
}