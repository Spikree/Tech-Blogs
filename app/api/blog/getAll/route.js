import {connectToDb} from "../../../../utils/database.js"
import Blog from "../../../../models/blog.js"

export const GET = async () => {
    try {
        await connectToDb()
        const response = await Blog.find()
        if(!response) {
            return new Response("Blogs not found",{status:200})
        }
        return new Response(response,{status:200})
    } catch (error) {
        console.log(error)
        return new Response("Error fetching blogs", {status:500})
    }
}