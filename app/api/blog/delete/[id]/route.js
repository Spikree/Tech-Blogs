import {connectToDb} from "../../../../../utils/database.js"
import Blog from "../../../../../models/blog.js";

export const DELETE = async (req, { params }) => {
    try {
      await connectToDb();
      const { id } = params;
  
      const deletedBlog = await Blog.findByIdAndDelete(id);
  
      if (!deletedBlog) {
        return new Response("Blog not found", { status: 404 });
      }
  
      return new Response("Blog Deleted Successfully", { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Error Deleting Blog", { status: 500 });
    }
  };