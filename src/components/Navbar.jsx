'use client';

import { CiMap } from 'react-icons/ci';
import { CiSearch } from 'react-icons/ci';
import { CiSettings } from 'react-icons/ci';
import { usePathname } from 'next/navigation';

const links = [
    { name: 'map', href: '/map', icon: <CiMap /> },
    { name: 'explore', href: '/explore', icon: <CiSearch /> },
    { name: 'profile', href: '/profile', icon: <CiSettings /> },
];

export default function NavBar() {
    const pathname = usePathname();
    return (
        <div className="fixed bottom-0 flex items-center justify-evenly border-t-2 w-full p-4">
            {links.map((link) => (
                <Link key={link.href} currentPath={pathname} link={link} />
            ))}
        </div>
    );
}

const Link = ({ currentPath, link }) => {
    const isActive = currentPath === link.href;
    const isActiveClass = isActive ? '-translate-y-10' : '';

    return (
        <a
            key={link.href}
            href={link.href}
            className={`relative p-2 text-3xl ${isActiveClass}`}
        >
            {link.icon}
        </a>
    );
};
