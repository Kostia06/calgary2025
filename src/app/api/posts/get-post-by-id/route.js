import prisma from "@/lib/prisma";


export const POST = async (req) => {
    try {
        const { id } = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({ success: false, error: 'Missing id' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const post = await prisma.posts.findUnique({
            where: {
                id: id
            }
        });

        if (!post) {
            return new Response(
                JSON.stringify({ success: false, error: 'Post not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true, post }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        )
        
    } catch (err) {
        console.error("Error fetching post:", err);
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}