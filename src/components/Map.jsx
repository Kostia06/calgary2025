'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useGlobalContext } from '@/container/GlobalContext';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({
  lng = -114.1371633,
  lat = 52.0761024,
  zoom = 15,
//   points = [
//     { lng: -114.1371633, lat: 52.0761024, userType: 'USER' },
//     { lng: -114.137177, lat: 51.075284,   userType: 'USER' },
//     { lng: -114.137177, lat: 52.075284,   userType: 'ADMIN' },
//     { lng: -114.137177, lat: 52.175284,   userType: 'INFLUENCER' }
//   ]
}) => {
  const mapContainer = useRef(null);
  const {points} = useGlobalContext();

  // 1) A lookup table of images by userType
  //    Swap in any URLs you’d like.
  const userTypeImages = {
    USER: 'https://media.discordapp.net/attachments/1340456650821337131/1340661092665524295/Community_Pin_png.png?ex=67b32b70&is=67b1d9f0&hm=afd05915c0105a1b7c28bc51fcbfbef77d36ddedda0bf308c11a72c400120017&=&format=webp&quality=lossless&width=899&height=899',
    ADMIN: 'https://media.discordapp.net/attachments/1340456650821337131/1340661185540001872/Educational_Pin_.png?ex=67b32b86&is=67b1da06&hm=aac26d3440a56541d0ba17858466c630b485fb6c264364f2b162b7e3479dcb09&=&format=webp&quality=lossless&width=899&height=899',
    INFLUENCER: 'https://media.discordapp.net/attachments/1340456650821337131/1340661295636021410/Influencer_Pin_png.png?ex=67b32ba1&is=67b1da21&hm=ad3fb39c2b3bc53ece0848a3cf94a56e3735090b55e8cc12895a66502a225805&=&format=webp&quality=lossless&width=899&height=899'
  };
  
  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('Points to be rendered:', points); // Debug log

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: 60,
      bearing: -45,
      antialias: true
    });

    // 2) Marker helper that picks the correct image based on userType
    const addMarkerWithImage = (mapInstance, markerLng, markerLat, userType) => {
      console.log('Adding marker at:', markerLng, markerLat, userType);
      
      // Default/fallback image if userType not found
      const imageUrl = userTypeImages[userType] || 'https://via.placeholder.com/50';

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

      // Apply the per-userType image here
      el.style.backgroundImage = `url(${imageUrl})`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center';

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

      console.log('Map loaded, adding points...');
      points.forEach(point => {
        // 3) Pass userType to the marker function
        addMarkerWithImage(
          map,
          point.lng,
          point.lat,
          point.user.userType
        );
      });
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

    // Clean up on unmount
    return () => map.remove();
  }, [lng, lat, zoom, points]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default Map;
