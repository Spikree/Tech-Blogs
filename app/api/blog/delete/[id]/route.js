import { requireWriteAccess } from "@/lib/write-access";
import Blog from "../../../../../models/blog.js";

export const DELETE = async (req, { params }) => {
    try {
      const access = await requireWriteAccess(req);
      if (access.error) return access.error;
      const { id } = await params;
  
      const deletedBlog = await Blog.findOneAndDelete({ _id: id, user: access.userId });
  
      if (!deletedBlog) {
        return new Response("Blog not found", { status: 404 });
      }
  
      return new Response("Blog Deleted Successfully", { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Error Deleting Blog", { status: 500 });
    }
  };