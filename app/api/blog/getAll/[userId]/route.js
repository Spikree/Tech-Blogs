import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js"
import Like from "../../../../../models/likes.js"
import Comment from "../../../../../models/comment.js"
import User from "../../../../../models/user.js"

export const GET = async (req, {params}) => {
    const {userId} = await params;

    if(!userId) {
        return new Response("User Id is required", {status: 400})
    }

    try {
        await connectToDb()
        const blogs = await Blog.find()

        if(!blogs || blogs.length === 0) {
            return new Response("No blogs found", {status: 200})
        }

        const userIds = [...new Set(blogs.map(blog => blog.user.toString()))]

        const users = await User.find(
            { _id: { $in: userIds } },
            { image: 1 } 
        )

        const userImageMap = new Map(
            users.map(user => [user._id.toString(), user.image])
        )

        const userLikes = await Like.find({
            user: userId,
            blog: {$in: blogs.map(blog => blog._id)}
        });

        const likedBlogIds = new Set(userLikes.map(like => like.blog.toString()))

        const [likeCounts, commentCounts] = await Promise.all([
            Promise.all(blogs.map(blog => 
                Like.countDocuments({blog: blog._id})
            )),
            Promise.all(blogs.map(blog =>
                Comment.countDocuments({blog: blog._id})
            ))
        ]);

        const blogsWithDetails = blogs.map((blog, index) => {
            const blogObj = blog.toObject();
            return {
                ...blogObj,
                userImage: userImageMap.get(blog.user.toString()), 
                hasLiked: likedBlogIds.has(blog._id.toString()),
                totalLikes: likeCounts[index],
                totalComments: commentCounts[index]
            }
        });

        return new Response(JSON.stringify(blogsWithDetails), {status: 200})
    } catch (error) {
        console.log(error)
        return new Response("Error fetching blogs", {status: 500})
    }
}