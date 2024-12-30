import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js"

export const GET = async(req, {params}) => {
    const {id} = await params;

    try {
        await connectToDb();

        const blog = await Blog.find({user: id});

        if(!blog) {
            return new Response("User Blogs not found")
        }

        return new Response(blog,{status:200});
    } catch (error) {
        console.log(error)
        return new Response("Error fetching user blogs", {status:500})
    }
}