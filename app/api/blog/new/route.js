import {connectToDb} from "../../../../utils/database.js"
import Blog from "../../../../models/blog.js"

export const POST = async (req) => {
    const {user, title, content} = await req.json();

    if(!user || !title || !content) {
        return new Response("Missing required fields",{status:400})
    }

    try {
        await connectToDb();
        const newBlog = new Blog({user: user, title: title, content: content})

        await newBlog.save();

        return new Response(JSON.stringify({newBlog, message: "Blog uploaded sucessfully"}), {status:201})
    } catch (error) {
        console.log(error)
        return new Error("Failed to upload the blog",{status:5})
    }
}