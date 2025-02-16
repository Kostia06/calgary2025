import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { id } = await req.json(); // action could be 'increase' or 'decrease'
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log("userId:", userId)

        const getUser = await prisma.user.findFirst({
            where: {
                clerk_id: userId,
            }
        })

        console.log("getUser:", getUser, id)

        const posts = await prisma.posts.findUnique({
            where: {
                id: id,
            }
        })

        if (!posts) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        const userVotes = await prisma.vote.findFirst({
            where: {
                postId: id,
                userId: getUser.id,
            }
        })

        if (userVotes) {
            return NextResponse.json(
                { error: 'You have already upvoted this post' },
                { status: 400 }
            );
        }

        const makeAVote = await prisma.posts.update({
            where: {
                id: id,
            },
            data: {
                votes: {
                    create: {
                        userId: getUser.id,
                    }
                },
                upvotes: {
                    increment: 1,
                }
            }
        })        

        return NextResponse.json({ 
            success: true, 
            post: makeAVote,
            message: 'Vote recorded successfully' 
        });

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

