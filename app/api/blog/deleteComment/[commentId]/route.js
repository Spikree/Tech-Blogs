import { requireWriteAccess } from "@/lib/write-access";
import Comment from "../../../../../models/comment.js"

export const DELETE = async(req,{params}) => {
    const {commentId} = await params

    try {
        const access = await requireWriteAccess(req);
        if (access.error) return access.error;
        const comment = await Comment.findOneAndDelete({ _id: commentId, user: access.userId })
        if(!comment) {
            return new Response("Comment not found", { status: 404 })
        }

        return new Response(JSON.stringify({message: "Comment deleted sucessfully",comment},comment))
    } catch (error) {
        console.log(error)
        return new Response("Error deleting the comment",{status:500});
    }
}