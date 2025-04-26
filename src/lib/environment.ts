import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const ENV = createEnv({
  server: {
    SPOTIFY_STALKER_API: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SPOTIFY_STALKER_API: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_ENABLED: z
      .string()
      .transform((x) => x === "true")
      .pipe(z.boolean()),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SPOTIFY_STALKER_API:
      process.env.NEXT_PUBLIC_SPOTIFY_STALKER_API,
    NEXT_PUBLIC_POSTHOG_ENABLED: process.env.NEXT_PUBLIC_POSTHOG_ENABLED,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    SPOTIFY_STALKER_API: process.env.SPOTIFY_STALKER_API,
  },
});
