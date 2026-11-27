import { connectToDb } from "../../../../../utils/database.js";
import Blog from "../../../../../models/blog.js";
import Like from "../../../../../models/likes.js";
import Comment from "../../../../../models/comment.js"
import User from "../../../../../models/user.js"
import { getToken } from "next-auth/jwt";
import { currentUserId } from "@/lib/write-access";

export const GET = async (req, { params }) => {
  try {
    await connectToDb();
    const { id } = await params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return new Response("Blog not found", { status: 404 });
    }

    
    const userId = blog.user.toString()

    const user = await User.findById(userId)

    const ImageUrl = user.image
    const username = user.username

    // hasLiked reflects the person viewing the page, not the author.
    const viewerId = await currentUserId(await getToken({ req })).catch(() => null);
    const userLike = viewerId
      ? await Like.exists({ user: viewerId, blog: blog._id })
      : null;

    const totalLikes = await Like.countDocuments({ blog: blog._id });

    const comments = await Comment
      .find({ blog: blog._id })
      .populate("user", "username image")
      .sort({ createdAt: -1 });

      const totalComments = Comment.countDocuments({ blog: blog._id });

      const blogWithDetails = {
        ...blog.toObject(),
        hasLiked: Boolean(userLike),
        totalLikes,
        comments: comments.map(comment => comment.toObject()),
        totalComments: await totalComments,
        ImageUrl,
        username
      };

      return new Response(JSON.stringify(blogWithDetails),{status:200})
  } catch (error) {
    console.log(error);
    return new Response("error fetching blog",{status: 400});
  }
};
