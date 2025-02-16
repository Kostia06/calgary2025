import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
    matcher: [
        // Skip Next.js internals, all static files, and the signup route
        '/((?!.*\\..*|_next|signup).*)',
        '/(api|trpc)(.*)', // Exclude API and trpc routes
    ],
};

