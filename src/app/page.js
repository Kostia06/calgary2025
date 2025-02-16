'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ImageUploader from './components/Posts';

export default function Home() {
    const router = useRouter();

    // Define your allowed routes here
    const allowedRoutes = ['/home', '/about', '/contact'];

    useEffect(() => {
        // If the current route is not in the allowed routes list, redirect to '/map'
        if (!allowedRoutes.includes(router.pathname)) {
            router.push('/map');
        }
    }, [router.pathname]);

    return (
        <main>
            <div>Hello world!</div>
            <ImageUploader />
        </main>
    );
}
