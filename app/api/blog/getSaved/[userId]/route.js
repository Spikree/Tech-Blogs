import { connectToDb } from "../../../../../utils/database";
import Save from "../../../../../models/save.js"

export const GET = async(req, {params}) => {
    const {id} = await params;

    try {
        await connectToDb();

        const savedBlogs = await Save.find({userId: id})

        if(!savedBlogs) {
            return new Response("No saved blog", {status: 401})
        }

        return new Response(JSON.stringify(savedBlogs), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500})
    }
}