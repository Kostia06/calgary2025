import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const POST = async (req) => {
    const { userId } = getAuth(req);


    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { title, description, imageUrl, lat, lng } = await req.json();
    console.log(title, description, imageUrl);


    if (!title || !description) {
        return new Response('Missing required fields', { status: 400 })
    }

    try {
        const post = await prisma.posts.create({
            data: {
                title,
                description,
                imageUrl,
                user: {
                    connect: {
                        clerk_id: userId,
                    }
                },
                lat,
                lng
            }
        })

        console.log('Created post:', post);

        return new Response('Success', { status: 200 });
    } catch (error) {
        console.error('Error creating post:', error);
        return new Response('Error creating post', { status: 500 });
    }
}