import { getAuth } from "@clerk/nextjs/server";

export const POST = async(req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { title, content } = await req.json()

    if (!title || !content) {
        return new Response('Missing required fields', { status: 400 })
    }
}