import {connectToDb} from "../../../../../../utils/database.js"
import Blog from "../../../../../../models/blog.js"
import Comment from "../../../../../../models/comment.js"

export const POST = async(req,{params}) => {
    const {blogId, userId} = await params;
    const { comment } = await req.json();

    try {
        await connectToDb();

        if(!comment || comment.trim().length === 0) {
            return new Response(JSON.stringify({message: "comment cannot be empty"}))
        }

        const blog = await Blog.findById(blogId)

        if(!blog) {
            return new Response(JSON.stringify({message: "Blog not found"}))
        }

        const newComment = new Comment({
            user: userId,
            blog: blogId,
            comment: comment
        })

        await newComment.save();
        

        return new Response(JSON.stringify({newComment, message: "Comment posted successfully"} ),{status:200})

    } catch (error) {
        console.log(error)
        return new Response("Error while uploading comment", {status:500})
    }
}