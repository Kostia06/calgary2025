import Search from '@/components/Search';
import CreatePost from '@/components/CreatePost';

export default function QuickOptions() {
    return (
        <div className="fixed top-0 left-0 m-5 flex flex-col items-center justify-center space-y-6">
            <Search />
            <CreatePost />
        </div>
    );
}
