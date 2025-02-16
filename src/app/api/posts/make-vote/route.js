import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const POST = async (req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await req.json();

    try {
        const post = await prisma.posts.update({
            where: {
                id: id
            },
            data: {
                votes: {
                    increment: 1
                }
            },
        });
        return new Response(JSON.stringify(post), { status: 200 })
    } catch (error) {
        return new Response(error.message, { status: 400 })
    }
}