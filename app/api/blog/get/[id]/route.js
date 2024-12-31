import { connectToDb } from "../../../../../utils/database.js";
import Blog from "../../../../../models/blog.js";
import Like from "../../../../../models/likes.js";
import Comment from "../../../../../models/comment.js"
import User from "../../../../../models/user.js"

export const GET = async (req, { params }) => {
  try {
    await connectToDb();
    const { id } = await params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return new Response("Blog not found", { status: 200 });
    }

    
    const userId = blog.user.toString()

    const user = await User.findById(userId)

    const ImageUrl = user.image

    const userLike = await Like.findOne({
      user: id,
      blog: blog._id,
    });

    const totalLikes = await Like.countDocuments({ blog: blog._id });

    const comments = await Comment
      .find({ blog: blog._id })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

      const totalComments = Comment.countDocuments({ blog: blog._id });

      const blogWithDetails = {
        ...blog.toObject(),
        hasLiked: !!userLike,
        totalLikes,
        comments: comments.map(comment => comment.toObject()),
        totalComments: await totalComments,
        ImageUrl
      };

      return new Response(JSON.stringify(blogWithDetails),{status:200})
  } catch (error) {
    console.log(error);
    return new Response("error fetching blog",{status: 400});
  }
};
