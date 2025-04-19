import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const ENV = createEnv({
  server: {
    SPOTIFY_STALKER_API: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SPOTIFY_STALKER_API: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SPOTIFY_STALKER_API:
      process.env.NEXT_PUBLIC_SPOTIFY_STALKER_API,
    SPOTIFY_STALKER_API: process.env.SPOTIFY_STALKER_API,
  },
});
