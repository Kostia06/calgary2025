import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const POST = async (req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    try {
        const posts = await prisma.posts.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return new Response(JSON.stringify(posts), { status: 200 })
    } catch (error) {
        return new Response(error.message, { status: 400 })
    }
}