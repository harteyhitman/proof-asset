import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/stripe",
  "/api/webhooks/clerk",
]);

const isProRoute = createRouteMatcher(["/dashboard/pro(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProRoute(req)) {
    await auth.protect();

    const { userId } = await auth();
    if (userId) {
      const { isPro } = await getUserSubscriptionStatus(userId);
      if (!isPro) {
        const pricingUrl = new URL("/pricing", req.url);
        return NextResponse.redirect(pricingUrl);
      }
    }
  }

  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
