'use client';
import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { Input } from '@/components/ui/input';

export default function Search({ search, setSearch }) {
    const [show, setShow] = useState(false);
    const size = show ? 'w-80' : 'w-14';
    return (
        <div
            className={`flex bg-s  smooth items-center  h-14 rounded-full  ${size}`}
        >
            <button onClick={() => setShow(!show)}>
                <CiSearch className="text-4xl *:fill-a w-9 h-9 *:stroke-[0.7] mx-2 translate-x-[2px]" />
            </button>

            {show && (
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
            )}
        </div>
    );
}
