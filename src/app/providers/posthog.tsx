"use client";

import { ENV } from "@/lib/environment";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const {
    NEXT_PUBLIC_POSTHOG_ENABLED,
    NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST,
  } = ENV;

  useEffect(() => {
    if (!NEXT_PUBLIC_POSTHOG_ENABLED) {
      return;
    }

    if (typeof window !== "undefined") {
      posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only",
      });
    }
  }, [
    NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_ENABLED,
  ]);

  if (!NEXT_PUBLIC_POSTHOG_ENABLED) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
