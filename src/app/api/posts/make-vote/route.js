import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { postId, action } = await req.json(); // action could be 'increase' or 'decrease'
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('bob');
        // Get the user's UUID from clerk_id
        const user = await prisma.user.findUnique({
            where: { clerk_id: userId },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Find the post
        const post = await prisma.posts.findUnique({
            where: { id: postId },
            include: {
                votes: true, // Include votes array to check if user has voted
            },
        });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Check if the user has already voted
        const userHasVoted = post.votes.some((vote) => vote.id === user.id);

        if (action === 'increase') {
            if (userHasVoted) {
                return NextResponse.json(
                    { error: 'User has already voted' },
                    { status: 400 }
                );
            }

            // Increase the upvotes and add the user to the votes
            await prisma.posts.update({
                where: { id: postId },
                data: {
                    upvotes: { increment: 1 },
                    votes: {
                        connect: { id: user.id },
                    },
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Upvote added successfully',
            });
        }

        if (action === 'decrease') {
            if (!userHasVoted) {
                return NextResponse.json(
                    { error: 'User has not voted' },
                    { status: 400 }
                );
            }

            // Decrease the upvotes and remove the user from the votes
            await prisma.posts.update({
                where: { id: postId },
                data: {
                    upvotes: { decrement: 1 },
                    votes: {
                        disconnect: { id: user.id },
                    },
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Upvote removed successfully',
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Vote error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to process vote',
            },
            { status: 500 }
        );
    }
}

