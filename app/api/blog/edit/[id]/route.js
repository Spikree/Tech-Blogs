import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js"

export const PATCH = async(req,{params}) => {
    const {title, content} = await req.json();

    const {id} = await params

    try {
        await connectToDb();
        const blog = await Blog.findById(id)

        if(!blog) {
            return new Response("Blog not found", {status:400})
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