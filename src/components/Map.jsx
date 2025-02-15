'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ lng = -74.5, lat = 40, zoom = 9 }) => {
    const mapContainer = useRef(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
        });

        return () => map.remove();
    }, [lng, lat, zoom]);

    return <div ref={mapContainer} className="w-full h-[500px]" />;
};

export default Map;
