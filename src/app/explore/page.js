'use client';

import CreatePost from '@/components/CreatePost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CiLocationOn } from 'react-icons/ci';
import Image from 'next/image';
import { useGetPostsList } from '@/app/hooks/useGetPostsList';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Map() {
    const { posts, isLoading, error } = useGetPostsList();
    const [search, setSearch] = useState('');

    if (isLoading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error loading posts: {error.message}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 mb-20">
            {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            <div className="fixed bottom-20 right-0 m-5">
                <CreatePost />
            </div>
            <Search search={search} setSearch={setSearch} />
        </div>
    );
}

const getScrollY = () => {
    const [scrollY, setScrollY] = useState(true);
    const [prevScrollY, setPrevScrollY] = useState(0);
    // handle scroll event
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setScrollY(prevScrollY - currentScrollY > 0);
        setPrevScrollY(currentScrollY);
    };
    // event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollY]);
    return scrollY;
};

const getVisible = (ref) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // create an observer
        const observer = new IntersectionObserver(
            // callback
            ([entry]) => {
                setVisible(entry.isIntersecting);
            },
            // options
            { threshold: 0.1 }
        );

        // observe the element
        if (ref.current) observer.observe(ref.current);

        // cleanup
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);
    return visible;
};

const Search = ({ search, setSearch }) => {
    const show = getScrollY();
    const showCss = !show ? '-translate-y-24' : 'translate-y-0';
    return (
        <div
            className={`smooth ${showCss} fixed top-5 p-2 left-1/2 -translate-x-1/2 bg-s w-80 h-14 rounded-full flex items-center justify-center`}
        >
            <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent w-full text-lg outline-none border-none focus:outline-none focus:ring-0 focus:border-none placeholder-[#e2e8ce] text-[#e2e8ce] placeholder:text-[#e2e8ce]"
                style={{
                    outline: 'none',
                    border: 'none',
                    boxShadow: 'none',
                }}
            />
        </div>
    );
};

const PostCard = ({ post }) => {
    const { imageUrl, lat, lng, title, description, upvotes } = post;
    const sLat = parseFloat(lat).toFixed(2);
    const sLng = parseFloat(lng).toFixed(2);
<<<<<<< HEAD
    const ref = useRef(null);
    const visible = getVisible(ref);
    const visibleCss = visible ? 'opacity-100 scale-100' : 'scale-50 opacity-0';
=======

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
>>>>>>> d95edb8482251d3682a788c17f5612c4d38429d8
    return (
        <Card
            ref={ref}
            className={`smooth-el max-w-lg w-full mx-auto shadow-lg ${visibleCss}`}
        >
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
