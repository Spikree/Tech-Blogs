import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js"
import Like from "../../../../../models/likes.js"
import Comment from "../../../../../models/comment.js"

export const GET = async(req, {params}) => {
    const {id} = await params;

    try {
        await connectToDb();

        const blog = await Blog.find({user: id});

        if(!blog) {
            return new Response("User Blogs not found")
        }

        const userLikes = await Like.find({
            user: id,
            blog: {$in: blog.map(blog => blog._id)}
        })

        const likedBlogsIds = new Set(userLikes.map(like => like.blog.toString()));

        const likeCounts = await Promise.all(
            blog.map(blog => Like.countDocuments({blog: blog._id}))
        )

        const commentCounts = await Promise.all(
            blog.map(blog => Comment.countDocuments({blog: blog._id}))
        )

        const blogWithLikes = blog.map((blog, index) => {
            const blogObj = blog.toObject();
            return{
                ...blogObj,
                hasLiked: likedBlogsIds.has(blog._id.toString()),
                totalLikes: likeCounts[index],
                totalComments: commentCounts[index],
            }
        })

        return new Response(JSON.stringify(blogWithLikes),{status:200});
    } catch (error) {
        console.log(error)
        return new Response("Error fetching user blogs", {status:500})
    }
}