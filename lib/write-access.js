import { getToken } from "next-auth/jwt";
import User from "@/models/user";
import { connectToDb } from "@/utils/database";

export async function currentUserId(token) {
    if (!token?.dbUserId) return null;
    await connectToDb();
    const user = await User.exists({ _id: token.dbUserId });
    return user?._id.toString() ?? null;
}

export async function requireWriteAccess(req) {
    try {
        const userId = await currentUserId(await getToken({ req }));
        if (!userId) return { error: new Response("Sign in required", { status: 401 }) };
        return { userId };
    } catch {
        return { error: new Response("Cannot verify account right now", { status: 503 }) };
    }
}
