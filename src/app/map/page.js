'use client';

import Map from '@/components/Map';
import QuickOptions from '@/components/QuickOptions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MapPage() {
    // const [search, setSearch] = useState("");
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    return (
        <div className="w-screen h-screen">
            <Map lat={lat} lng={lng} />
            <QuickOptions />
        </div>
    );
}
