import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!.*\\..*|_next).*)",
    // Optional: Exclude routes that should not be protected
    "/(api|trpc)(.*)",
  ],
};