'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useGlobalContext } from '@/container/GlobalContext';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import { MdClose } from 'react-icons/md';
import { PostCard } from '@/app/explore/page';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { CiLocationArrow1 } from 'react-icons/ci';
import { Button } from './ui/button';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({
    lng = -114.1371633,
    lat = 52.0761024,
    zoom = 10
}) => {
    const mapContainer = useRef(null);
    const { points } = useGlobalContext();
    const [selectedId, setSelectedId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    // 1) A lookup table of images by userType
    const userTypeImages = {
        USER: 'https://uonrhmkvkrnumclopiim.supabase.co/storage/v1/object/public/posts//community.png',
        ADMIN: 'https://uonrhmkvkrnumclopiim.supabase.co/storage/v1/object/public/posts//admins.png',
        INFLUENCER: 'https://uonrhmkvkrnumclopiim.supabase.co/storage/v1/object/public/posts//influencer.png'
    };

    const getPostById = async (id) => {
        const post = await fetch('/api/posts/get-post-by-id', {
            method: "POST",
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await post.json()
        setSelectedPost(data.post);
    }


    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [lng, lat],
            zoom: zoom,
            // pitch: 60,
            // bearing: -45,
            antialias: true
        });

        // 2) Marker helper that picks the correct image based on userType and handles click
        const addMarkerWithImage = (mapInstance, point) => {
            const { lng: markerLng, lat: markerLat, id, user } = point;
            const userType = user?.userType ?? 'USER';

            // Fallback image if userType not found
            const imageUrl = userTypeImages[userType] || 'https://via.placeholder.com/50';

            // Create a DOM element for the marker
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.borderRadius = '50%';
            el.style.cursor = 'pointer';
            el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            el.style.backgroundImage = `url(${imageUrl})`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundRepeat = 'no-repeat';
            el.style.backgroundPosition = 'center';

            // Attach a click listener to print the point’s id
            el.addEventListener('click', () => {
                getPostById(id);
            });

            new mapboxgl.Marker({
                element: el,
                pitchAlignment: 'map',
                rotationAlignment: 'map'
            })
                .setLngLat([markerLng, markerLat])
                .addTo(mapInstance);
        };

        map.on('load', () => {
            // Add a DEM (Digital Elevation Model) for 3D terrain
            map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
            });
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

            // Add 3D building layer
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

            // Set the fog/atmosphere
            map.setFog({
                'color': 'rgb(186, 210, 235)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)',
                'star-intensity': 0.6
            });

            // 3) Add markers
            points?.forEach((point) => addMarkerWithImage(map, point));
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

        // Cleanup on unmount
        return () => map.remove();
    }, [lng, lat, zoom, points]);

    const closeModal = () => {
        setSelectedId(null);
        setSelectedPost(null);
    }
    return (
        <>
            <div ref={mapContainer} className="w-full h-full" />
            {selectedPost !== null && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center flex-col p-4">
                    <div className="relative p-4 bg-white rounded-lg">
                        {selectedPost.videoUrl && (
                            <iframe
                                className='w-full'
                                width="315"
                                height="560"
                                src={`https://www.youtube.com/embed/${selectedPost.videoUrl.split('/').pop()}?autoplay=0`}
                                title="YouTube Shorts video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                        {selectedPost.imageUrl && (
                            <img
                                src={selectedPost.imageUrl}
                                alt="Uploaded"
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        )}
                        <button
                            onClick={closeModal}
                            className="absolute top-1 right-2 bg-white text-black rounded-full hover:bg-gray-300"
                        >
                            <MdClose className="h-6 w-6 text-black fill-black" />
                        </button>
                        <div className='flex items-start gap-4 flex-col'>
                            <CardTitle className='text-2xl text-black'>{selectedPost.title}</CardTitle>
                            <CardTitle className='text-black'>{selectedPost.description}</CardTitle>
                            {selectedPost.tags.length > 0 && (
                                <CardTitle className='text-white bg-s p-2 rounded-md'>{selectedPost.tags}</CardTitle>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )

};

export default Map;
