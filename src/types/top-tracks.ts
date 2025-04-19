import { z } from "zod";

const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
});

const albumSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().url(),
  releaseDate: z.string().transform((str) => new Date(str)), // Transform string date to Date object
});

const trackSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(artistSchema),
  album: albumSchema,
  durationMs: z.number().int().positive(),
  popularity: z.number().int().min(0).max(100),
  userRank: z.number().int().positive(),
  spotifyUrl: z.string().url(),
});

const tracksResponseSchema = z.object({
  tracks: z.array(trackSchema),
});

type Artist = z.infer<typeof artistSchema>;
type Album = z.infer<typeof albumSchema>;
type Track = z.infer<typeof trackSchema>;
type TracksResponse = z.infer<typeof tracksResponseSchema>;

function validateTracksResponse(data: unknown): TracksResponse {
  return tracksResponseSchema.parse(data);
}

function safeValidateTracksResponse(data: unknown): {
  success: boolean;
  data?: TracksResponse;
  error?: z.ZodError;
} {
  const result = tracksResponseSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

export {
  albumSchema,
  artistSchema,
  safeValidateTracksResponse,
  trackSchema,
  tracksResponseSchema,
  validateTracksResponse,
  type Album,
  type Artist,
  type Track,
  type TracksResponse,
};
