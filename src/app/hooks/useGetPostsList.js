'use client';

import { useState, useEffect } from 'react';

export function useGetPostsList() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/posts/get-posts', {
                    method: 'POST',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                console.log(data)
                setPosts(data);
                setError(null);
            } catch (err) {
                setError(err);
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return { posts, isLoading, error, setPosts };
}