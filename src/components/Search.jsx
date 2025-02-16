'use client';
import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { Input } from '@/components/ui/input';

export default function Search() {
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(false);

    const size = show ? 'w-80' : 'w-16';

    return (
        <div
            className={`flex bg-s  smooth items-center  h-16 rounded-full  ${size}`}
        >
            <button onClick={() => setShow(!show)}>
                <CiSearch className="text-4xl *:fill-a w-9 h-9 *:stroke-[1] mx-3 translate-x-[0.5px]" />
            </button>

            {show && (
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent w-full text-lg outline-none border-none focus:outline-none focus:ring-0 focus:border-none placeholder-[#008148] text-[#008148]"
                    style={{
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'none',
                    }}
                />
            )}
        </div>
    );
}
