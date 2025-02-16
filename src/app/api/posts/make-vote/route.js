import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { id } = await req.json();
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the user's UUID from clerk_id
        const user = await prisma.user.findFirst({
            where: { clerk_id: userId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // First check if user has already voted
        const existingPost = await prisma.posts.findFirst({
            where: {
                id: id,
                votes: {
                    some: {
                        id: user.id
                    }
                }
            }
        });

        if (existingPost) {
            return NextResponse.json(
                { error: 'Already voted' },
                { status: 400 }
            );
        }

        // If not voted, proceed with the vote
        const post = await prisma.posts.update({
            where: {
                id: id
            },
            data: {
                upvotes: {
                    increment: 1
                },
                votes: {
                    connect: {
                        id: user.id
                    }
                }
            },
            include: {
                voters: true,
                votes: {
                    select: {
                        fullname: true,
                        userType: true
                    }
                }
            }
        });

        return NextResponse.json({ 
            success: true, 
            post,
            message: 'Vote recorded successfully' 
        });

    } catch (error) {
        console.error('Vote error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error.message || 'Failed to record vote'
            }, 
            { status: 500 }
        );
    }
}