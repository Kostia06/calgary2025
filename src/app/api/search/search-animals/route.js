import prisma from "@/lib/prisma";

export const POST = async (req) => {
    try {
        const { search } = await req.json();

        if (!search) {
            return new Response(
                JSON.stringify({ success: true, posts: [] }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const searchTerm = search.toLowerCase().trim();

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

        const filteredPosts = allPosts.filter(post =>
            post.tags.some(tag =>
                tag.toLowerCase().includes(searchTerm)
            )
        );

        return new Response(
            JSON.stringify({
                success: true,
                posts: filteredPosts,
                query: searchTerm
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