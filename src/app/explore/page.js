'use client';

import CreatePost from '@/components/CreatePost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useGetPostsList } from '@/app/hooks/useGetPostsList';

export default function Map() {
    const { posts, isLoading, error } = useGetPostsList();

    if (isLoading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error loading posts: {error.message}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {posts?.map((post) => (
                <Card key={post.id} className="max-w-lg w-full mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-s text-xl font-bold">
                            {post.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Post Image */}
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                fill={true}
                                className="object-cover"
                            />
                        </div>

                        {/* Post Description */}
                        <p className="text-s text-opacity-75">{post.description}</p>

                        {/* Post Details */}
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span className="text-s text-opacity-75">
                                📍 {post.lat}, {post.lng}
                            </span>
                            <span className="text-s text-opacity-75">
                                👍 {post.upvotes}
                            </span>
                        </div>

                        {/* Upvote Button */}
                        <Button onClick={() => console.log(post)} className="w-full bg-p hover:bg-a">Upvote</Button>
                    </CardContent>
                </Card>
            ))}
            <CreatePost />
        </div>
    );
}
