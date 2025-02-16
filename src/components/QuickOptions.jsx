import Search from '@/components/Search';
import CreatePost from '@/components/CreatePost';

export default function QuickOptions({ search, setSearch }) {
    return (
        <div className="fixed top-0 left-0 m-4 flex flex-col items-start justify-center space-y-4">
            <Search />
            <CreatePost search={search} setSearch={setSearch} />
        </div>
    );
}
