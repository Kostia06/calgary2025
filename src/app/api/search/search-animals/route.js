import prisma from "@/lib/prisma";

export const POST = async(req) => {
    const { search } = await req.json();

    try {
        const posts = await prisma.posts.findMany({
            where: {
                tags: {
                    has: search,
                }
            },
            include: {
                user: {
                    select: {
                        userType: true,
                    }
                }
            }
        })

        return new Response(JSON.stringify(posts), { status: 200 })
    } catch(err) {
        console.log(err, "Errorrrrrr")
        return new Response(err.message, { status: 400 })
    }
}