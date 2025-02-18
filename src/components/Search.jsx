'use client';
import { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { Input } from '@/components/ui/input';
import { Form } from 'react-hook-form';
import { useGlobalContext } from '@/container/GlobalContext';

export default function Search({ search, setSearch }) {
    const [show, setShow] = useState(false);
    const size = show ? 'w-80' : 'w-14';
    const { points, setPoints } = useGlobalContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const searchItem = await fetch('/api/search/search-animals', {
            method: 'POST',
            body: JSON.stringify({
                search,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const posts = await searchItem.json();
        console.log(posts);
        setPoints(posts.posts);
    };

    useEffect(() => {
        const showAll = async() => {
            const allPosts = await fetch('/api/search/search-all', {
                method: 'POST',
            })
            const posts = await allPosts.json();
            console.log(posts);
            setPoints(posts.posts);
        }
        showAll();
    }, []);

    return (
        <div
            className={`flex bg-s  smooth items-center  h-14 rounded-full bg-opacity-60 ${size}`}
        >
            <button onClick={() => setShow(!show)}>
                <CiSearch className="text-4xl *:fill-a w-9 h-9 *:stroke-[0.7] mx-2 translate-x-[2px]" />
            </button>

            {show && (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="bg-transparent w-full text-lg outline-none border-none focus:outline-none focus:ring-0 focus:border-none placeholder-[#e2e8ce] text-[#e2e8ce] placeholder:text-[#e2e8ce]"
                        style={{
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none',
                        }}
                    />
                </form>
            )}
        </div>
    );
}
