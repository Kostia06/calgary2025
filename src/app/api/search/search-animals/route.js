import prisma from "@/lib/prisma";

export const POST = async (req) => {
    const { search } = await req.json();

    try {
        const posts = await prisma.posts.findMany({
            where: {
                tags: {
                    has: search,
                }
            }
        });

        console.log(posts)
        return new Response(JSON.stringify(posts), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response(error.message, { status: 400 })
    }
}