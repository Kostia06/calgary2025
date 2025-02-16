'use client';

import { CiMap } from 'react-icons/ci';
import { CiCompass1 } from 'react-icons/ci';
import { CiUser } from 'react-icons/ci';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const links = [
    { name: 'explore', href: '/explore', icon: <CiCompass1 /> },
    { name: 'map', href: '/map', icon: <CiMap /> },
    { name: 'profile', href: '/profile', icon: <CiUser /> },
];

export default function NavBar() {
    const pathname = usePathname();
    const showNavbar = useNavbarVisibilityOnScroll();
    const isHidden = true ? '' : 'translate-y-40';
    return (
        <div
            className={`fixed bottom-0 flex items-center justify-evenly border-t-2 w-screen smooth-link h-20 bg-p ${isHidden}`}
        >
            {links.map((link) => (
                <LinkPage key={link.href} currentPath={pathname} link={link} />
            ))}
        </div>
    );
}

const LinkPage = ({ currentPath, link }) => {
    const pathname = usePathname();
    const isActive = currentPath === link.href;
    const isActiveClass = isActive
        ? '-translate-y-8 bg-s shadow-md shadow-black'
        : '';
    return (
        <Link
            key={link.href}
            href={link.href}
            className={`relative p-4 text-4xl  rounded-full smooth-link *:stroke-[0.3] text-center ${isActiveClass} hover:scale-110 hover:shadow-md hover:shadow-black`}
        >
            {link.icon}
        </Link>
    );
};

const useNavbarVisibilityOnScroll = () => {
    const [showNavbar, setShowNavbar] = useState(true); // Default: Navbar is visible

    useEffect(() => {
        const handleScroll = () => {
            // If the user scrolls down, hide the Navbar
            if (window.scrollY > 0) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true); // If at the top, show the Navbar
            }
        };

        // Listen for scroll events
        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return showNavbar; // Return the state to control Navbar visibility
};
