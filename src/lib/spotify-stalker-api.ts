import {
  CurrentPlayingMusicResponse,
  validateCurrentPlayingMusic,
} from "@/types/current-playing.music";
import { z } from "zod";
import { ENV } from "./environment";

export async function fetchCurrentPlayingMusic(): Promise<CurrentPlayingMusicResponse> {
  const SPOTIFY_STALKER_API = ENV.NEXT_PUBLIC_SPOTIFY_STALKER_API;

  try {
    const apiResponse = await fetch(
      `${SPOTIFY_STALKER_API}/user/music/current`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`HTTP error! Status: ${apiResponse.status}`);
    }

    const body = await apiResponse.json();

    return validateCurrentPlayingMusic(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
    } else if (error instanceof Error) {
      console.error("Fetch error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}
