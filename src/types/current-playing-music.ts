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
  releaseDate: z.coerce.date(),
});

const currentItemPlayingSchema = z.object({
  id: z.string(),
  album: albumSchema,
  artists: z.array(artistSchema),
  durationMs: z.number().int().positive(),
  progressMs: z.number().int().positive(),
  explicit: z.boolean(),
  spotifyHref: z.string().url(),
  name: z.string(),
  type: z.string(),
});

const contextSchema = z.object({
  spotifyHref: z.string().url(),
  type: z.string(),
});

const playingSchema = z.object({
  context: contextSchema,
  isPlaying: z.boolean(),
  currentlyPlayingType: z.string(),
  currentItemPlaying: currentItemPlayingSchema,
});

// Types inferred from the schemas
type Artist = z.infer<typeof artistSchema>;
type Album = z.infer<typeof albumSchema>;
type CurrentItemPlaying = z.infer<typeof currentItemPlayingSchema>;
type Context = z.infer<typeof contextSchema>;
type PlayingMusicResponse = z.infer<typeof playingSchema>;
type CurrentPlayingMusicResponse = z.infer<typeof playingSchema>;

function validateCurrentPlayingMusic(
  data: unknown
): CurrentPlayingMusicResponse {
  return playingSchema.parse(data);
}

function safeValidateCurrentPlayingMusic(data: unknown): {
  success: boolean;
  data?: CurrentPlayingMusicResponse;
  error?: z.ZodError;
} {
  const result = playingSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

export {
  albumSchema,
  artistSchema,
  contextSchema,
  currentItemPlayingSchema,
  safeValidateCurrentPlayingMusic,
  validateCurrentPlayingMusic,
  type Album,
  type Artist,
  type Context,
  type CurrentItemPlaying,
  type CurrentPlayingMusicResponse,
  type PlayingMusicResponse,
};
