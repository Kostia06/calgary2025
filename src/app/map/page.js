'use client';

import Map from '@/components/Map';
import QuickOptions from '@/components/QuickOptions';
import { useSearchParams } from 'next/navigation';

export default function MapPage() {
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
