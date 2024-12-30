import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js"
import Like from "../../../../../models/likes.js"
import Comment from "../../../../../models/comment.js"

export const GET = async (req,{params}) => {
    const {userId} = await params;
    try {
        await connectToDb()
        const blogs = await Blog.find()
        if(!blogs) {
            return new Response("Blogs not found",{status:200})
        }

        const userLikes = await Like.find({
            user: userId,
            blog: {$in: blogs.map(blog => blog._id)}
        });

        const likedBlogIds = new Set(userLikes.map(like => like.blog.toString()))

        const likeCounts = await Promise.all(
            blogs.map(blog => 
                Like.countDocuments({blog: blog._id})
            )
        )

        const commentCounts = await Promise.all(
            blogs.map(blog =>
                Comment.countDocuments({blog: blog._id})
            )
        )

        const blogsWithDetails = blogs.map((blog, index) => {
            const blogObj = blog.toObject();
            return{
                ...blogObj,
                hasLiked: likedBlogIds.has(blog._id.toString()),
                totalLikes : likeCounts[index],
                totalComments: commentCounts[index]
            }
        })

        return new Response(JSON.stringify(blogsWithDetails),{status:200})
    } catch (error) {
        console.log(error)
        return new Response("Error fetching blogs", {status:500})
    }
}