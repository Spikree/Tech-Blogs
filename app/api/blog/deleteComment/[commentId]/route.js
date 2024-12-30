import {connectToDb} from "../../../../../utils/database.js"
import Comment from "../../../../../models/comment.js"

export const DELETE = async(req,{params}) => {
    const {commentId} = await params

    try {
        await connectToDb()
        const comment = await Comment.findByIdAndDelete(commentId)
        if(!comment) {
            return new Response("Comment not found")
        }

        return new Response(JSON.stringify({message: "Comment deleted sucessfully",comment},comment))
    } catch (error) {
        console.log(error)
        return new Response("Error deleting the comment",{status:500});
    }
}