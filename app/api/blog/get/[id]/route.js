import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js"

export const GET = async(req, {params}) => {
    try {
        await connectToDb();
        const {id} = await params;
        const blog = await Blog.findById(id);
        return new Response(JSON.stringify(blog),{status:200})
    } catch (error) {
        console.log(error)
        return new Response("error fetching blog")
    }
}