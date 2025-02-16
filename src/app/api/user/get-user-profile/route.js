import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server"; 

export const POST = async (req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    try {
        const userProfile = await prisma.user.findFirst({
            where: {
                clerk_id: userId
            }
        })
        return new Response(JSON.stringify(userProfile), { status: 200 })
    } catch (error) {
        return new Response(error.message, { status: 400 })
    }
}