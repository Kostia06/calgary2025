'use client';

import Map from '@/components/Map';
import CreatePost from '@/components/CreatePost';

export default function MapPage() {
    return (
        <div className="w-screen h-screen">
            <Map />
            <CreatePost />
        </div>
    );
}
