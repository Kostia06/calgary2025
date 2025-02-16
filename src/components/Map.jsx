'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ lng = -114.1371633, lat = 52.0761024, zoom = 15, svgIcon, points = [] }) => {
    const mapContainer = useRef(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [lng, lat],
            zoom: zoom,
            pitch: 60, // Tilt angle (0-85)
            bearing: -45, // Rotation angle
            antialias: true // Enable antialiasing for smoother rendering
        });

        // Add 3D terrain
        map.on('load', () => {
            map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });
            
            // Add terrain layer
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

            // Add 3D buildings layer
            map.addLayer({
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': [
                        'interpolate', ['linear'], ['zoom'],
                        15, 0,
                        15.05, ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate', ['linear'], ['zoom'],
                        15, 0,
                        15.05, ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            });

            // Add atmosphere effect
            map.setFog({
                'color': 'rgb(186, 210, 235)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)',
                'star-intensity': 0.6
            });
        });

        // Add SVG icon as a marker
        const addSvgMarker = (lng, lat) => {
            const marker = new mapboxgl.Marker({ 
                element: svgIcon,
                // Adjust marker to account for terrain height
                pitchAlignment: 'map',
                rotationAlignment: 'map'
            })
            .setLngLat([lng, lat])
            .addTo(map);
        };

        // Add markers for all points
        for (const point of points) {
            addSvgMarker(point.lng, point.lat);
        }

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        // Add controls for 3D rotation
        map.addControl(new mapboxgl.NavigationControl({
            visualizePitch: true
        }));

        // Clean up map when component unmounts
        return () => map.remove();
    }, [lng, lat, zoom, svgIcon, points]);

    return <div ref={mapContainer} className="w-full h-full" />;
};

export default Map;
