'use client';

const links = [
    { name: 'home', href: '/' },
    { name: 'info', href: '/info' },
    { name: 'about', href: '/about' },
];

export default function NavBar() {
    return (
        <div className="fixed bottom-0 left-0 flex items-center justify-center bg-red-200 text-2xl">
            Hello World
        </div>
    );
}
