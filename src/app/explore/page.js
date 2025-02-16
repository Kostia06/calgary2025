import CreatePost from '@/components/CreatePost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const demoPosts = [
    {
        id: '1',
        imageUrl: 'https://source.unsplash.com/random/400x300?nature',
        lat: '40.7128',
        lng: '-74.0060',
        title: 'Beautiful Sunset',
        description: 'Captured a stunning sunset over the city skyline.',
        createdAt: '2024-02-15T12:00:00Z',
        updatedAt: '2024-02-15T12:30:00Z',
        userId: '12345',
        upvotes: 15,
    },
    {
        id: '2',
        imageUrl: 'https://source.unsplash.com/random/400x300?mountains',
        lat: '34.0522',
        lng: '-118.2437',
        title: 'Mountain View',
        description: 'A breathtaking view of the mountains during sunrise.',
        createdAt: '2024-02-14T08:00:00Z',
        updatedAt: '2024-02-14T08:45:00Z',
        userId: '67890',
        upvotes: 25,
    },
    {
        id: '3',
        imageUrl: 'https://source.unsplash.com/random/400x300?ocean',
        lat: '37.7749',
        lng: '-122.4194',
        title: 'Ocean Waves',
        description: 'Relaxing sound of ocean waves hitting the shore.',
        createdAt: '2024-02-13T15:00:00Z',
        updatedAt: '2024-02-13T15:30:00Z',
        userId: '54321',
        upvotes: 40,
    },
    {
        id: '4',
        imageUrl: 'https://source.unsplash.com/random/400x300?city',
        lat: '51.5074',
        lng: '-0.1278',
        title: 'City Lights',
        description: 'The city comes alive at night with glowing lights.',
        createdAt: '2024-02-12T20:00:00Z',
        updatedAt: '2024-02-12T20:45:00Z',
        userId: '98765',
        upvotes: 32,
    },
];
export default function Map() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {demoPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            <CreatePost />
        </div>
    );
}

const PostCard = ({ post }) => {
    return (
        <Card className="max-w-lg w-full mx-auto shadow-lg">
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
                <Button className="w-full bg-p hover:bg-a">Upvote</Button>
            </CardContent>
        </Card>
    );
};
