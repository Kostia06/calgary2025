'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ lng = -74.5, lat = 40, zoom = 9, svgIcon, points = [] }) => {
    const mapContainer = useRef(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
        });

        // Add SVG icon as a marker
        const addSvgMarker = (lng, lat) => {
            const marker = new mapboxgl.Marker({ element: svgIcon })
                .setLngLat([lng, lat])
                .addTo(map);
        };

        // Call addSvgMarker to place the SVG at the desired location
        for (const point of points) {
            addSvgMarker(point.lng, point.lat);
        }

        // Clean up map when component unmounts
        return () => map.remove();
    }, [lng, lat, zoom, svgIcon]);

    return <div ref={mapContainer} className="w-full h-full" />;
};

export default Map;
