import prisma from "@/lib/prisma";

export const POST = async (req) => {
    try {
        const allPosts = await prisma.posts.findMany({
            include: {
                user: {
                    select: {
                        userType: true,
                        fullname: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return new Response(
            JSON.stringify({
                success: true,
                posts: allPosts,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (err) {
        console.error("Search error:", err);
        return new Response(
            JSON.stringify({
                success: false,
                error: err.message
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}