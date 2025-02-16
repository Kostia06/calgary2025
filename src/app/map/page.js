'use client';

import Map from '@/components/Map';
import QuickOptions from '@/components/QuickOptions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MapPage() {
    // const [search, setSearch] = useState("");
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat') || 51.037397;
    const lng = searchParams.get('lng') || -114.173712;

    return (
        <div className="w-screen h-screen">
            <Map lat={lat} lng={lng} />
            <QuickOptions />
        </div>
    );
}
