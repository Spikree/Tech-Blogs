import {connectToDb} from "../../../../../../utils/database.js"
import Like from "../../../../../../models/likes.js"
import Blog from "../../../../../../models/blog.js"

export const PUT = async(req,{params}) => {
    const {blogId, userId} = await params;

    try {
        await connectToDb()

        const blog = await Blog.findById(blogId);

        if(!blog) {
            return new Response("Blog not found",{status:200})
        }

        const existingLike = await Like.findOne({
            blog: blogId,
            user: userId
        })

        if(existingLike) {
            await Like.findOneAndDelete(existingLike._id)
            return new Response(JSON.stringify({
                message: "Like removed",
                liked: false,
            }),{status:200})
        }

        const newLike = new Like({
            user:userId,
            blog: blogId
        })

        await newLike.save()

        const totalLikes = await Like.countDocuments({blog: blogId})

        return new Response(
            JSON.stringify({
              message: "Blog Liked",
              liked: true,
              totalLikes: totalLikes
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );

    } catch (error) {
        console.log(error)
        return new Response("Error while liking the blog")
    }
}