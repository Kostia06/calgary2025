'use client';

import CreatePost from '@/components/CreatePost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CiLocationOn } from 'react-icons/ci';
import Image from 'next/image';
import { useGetPostsList } from '@/app/hooks/useGetPostsList';

import Link from 'next/link';

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
                <PostCard key={post.id} post={post} />
            ))}
            <div className="fixed bottom-20 right-0 m-5">
                <CreatePost />
            </div>
        </div>
    );
}

const PostCard = ({ post }) => {
    const { imageUrl, lat, lng, title, description, upvotes } = post;
    const sLat = parseFloat(lat).toFixed(2);
    const sLng = parseFloat(lng).toFixed(2);

    const handleUpvote = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/posts/make-vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: post.id }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to vote');
            }

            // Optionally refresh the page or update the UI
            window.location.reload();
            
        } catch (error) {
            console.error('Error voting:', error);
            // Optionally show error to user
            alert(error.message);
        }
    }
    return (
        <Card className="max-w-lg w-full mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-s text-xl font-bold">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Post Image */}
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <img src={imageUrl} alt={title} className="object-cover" />
                </div>

                {/* Post Description */}
                <p className="text-s text-opacity-75">{description}</p>

                {/* Post Details */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Link
                        href={`/map?lat=${lat}&lng=${lng}`}
                        className="group p-2 m-1 flex items-center space-x-2 justify-center rounded-full border-2 border-[#008148] 
           text-sm bg-white shadow-md hover:bg-[#008148] *:text-s transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-black"
                        title="View on Map"
                    >
                        <CiLocationOn className="w-8 h-8 *:fill-s stoke-[0.3] group-hover:*:fill-a smooth" />
                        <span className="group-hover:text-a">
                            {sLat}, {sLng}
                        </span>
                    </Link>
                    <span className="text-s text-opacity-75">👍 {upvotes}</span>
                </div>

                {/* Upvote Button */}
                <div className="flex items-center space-x-6 w-full">
                    <Button onClick={(e) => handleUpvote(e)} className="w-full bg-p duration-300 ease-in-out transition-all hover:bg-s hover:scale-110 hover:shadow-md hover:shadow-black">
                        Upvote
                    </Button>
                    <Button className="w-full bg-p duration-300 ease-in-out transition-all hover:bg-s hover:scale-110 hover:shadow-md hover:shadow-black">
                        Downvote
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
