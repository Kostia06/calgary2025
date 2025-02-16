import Search from '@/components/Search';
import CreatePost from '@/components/CreatePost';
import { useState } from 'react';

export default function QuickOptions() {
    const [search, setSearch] = useState("");
    
    return (
        <div className="fixed top-0 left-0 m-4 flex flex-col items-start justify-center space-y-4">
            <Search search={search} setSearch={setSearch}/>
            <CreatePost search={search} setSearch={setSearch} />
        </div>
    );
}
