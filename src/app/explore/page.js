import CreatePost from '@/components/CreatePost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CiLocationOn } from 'react-icons/ci';
import Image from 'next/image';
import Link from 'next/link';

const demoPosts = [
    {
        id: '1',
        imageUrl: 'https://source.unsplash.com/random/400x300?nature',
        lat: '51.15307700991539',
        lng: '-115.64410093378106',
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mb-20">
            {demoPosts.map((post) => (
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
                    <Button className="w-full bg-p duration-300 ease-in-out transition-all hover:bg-s hover:scale-110 hover:shadow-md hover:shadow-black">
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
