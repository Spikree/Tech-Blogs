import { connectToDb } from "../../../../../utils/database";
import Save from "../../../../../models/save.js"
import Blog from "../../../../../models/blog.js"
import Like from "../../../../../models/likes.js"
import Comment from "../../../../../models/comment.js"
import User from "../../../../../models/user.js"

export const GET = async(req, {params}) => {
    const {userId} = await params;

    try {
        await connectToDb();

        const savedBlogs = await Save.find({ userId });
        
        if(!savedBlogs || savedBlogs.length === 0) {
            return new Response("No saved blogs", {status: 200})
        }

        const blogIds = savedBlogs.map(save => save.blogId);
        
        const blogs = await Blog.find({
            _id: { $in: blogIds }
        });

        const userIds = [...new Set(blogs.map(blog => blog.user.toString()))]

        const users = await User.find(
            { _id: { $in: userIds } },
            { image: 1, username: 1 }
        )

        const userImageMap = new Map(
            users.map(user => [user._id.toString(), user.image])
        )
        const userUsernameMap = new Map(
            users.map(user => [user._id.toString(), user.username])
        )

        const userLikes = await Like.find({
            user: userId,
            blog: { $in: blogIds }
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
                username: userUsernameMap.get(blog.user.toString()),
                hasLiked: likedBlogIds.has(blog._id.toString()),
                totalLikes: likeCounts[index],
                totalComments: commentCounts[index]
            }
        });

        return new Response(JSON.stringify(blogsWithDetails), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error(error);
        return new Response("Error fetching saved blogs", {status: 500})
    }
}