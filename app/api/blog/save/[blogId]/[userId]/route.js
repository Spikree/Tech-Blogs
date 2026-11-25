import { requireWriteAccess } from "@/lib/write-access";
import Blog from "../../../../../../models/blog.js"
import Save from "../../../../../../models/save.js"

export const PUT = async(req, {params}) => {
    const {blogId, userId} = await params;

    try {
        const access = await requireWriteAccess(req);
        if (access.error) return access.error;
        if (userId !== access.userId) return new Response("Forbidden", { status: 403 });

        const blog = await Blog.findById(blogId);

        if(!blog) {
            return new Response("Blog not found", {status: 404})
        }

        const alreadySaved = await Save.find({
            blogId: blogId,    
            userId: userId     
        })

        if(alreadySaved.length > 0) {
            await Save.findOneAndDelete({
                blogId: blogId,    
                userId: userId     
            })
            return new Response(JSON.stringify({
                message: "Unsaved",
                saved: false,
            }), {status: 200})
        }

        const saveBlog = new Save({
            userId: userId,  
            blogId: blogId    
        })

        await saveBlog.save()

        return new Response(
            JSON.stringify({
                message: "Blog Saved",
                saved: true
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.log(error)
        return new Response("Error while saving the blog", { status: 500 })
    }
}