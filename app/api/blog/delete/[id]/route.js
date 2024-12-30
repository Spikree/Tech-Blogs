import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js";

export const DELETE = async (req, {params}) => {
    try {
        await connectToDb()
        const {id} = await params;

        await Blog.findByIdAndDelete(id)

        return new Response("Blog Deleted Sucessfully",{status:200})
    } catch (error) {
        console.log(error)
        return new Error("Error Deleting Blog",{status:400})
    }
}