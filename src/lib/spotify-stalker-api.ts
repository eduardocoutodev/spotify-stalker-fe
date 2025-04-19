import {
  CurrentPlayingMusicResponse,
  validateCurrentPlayingMusic,
} from "@/types/current-playing-music";
import { TimeRange } from "@/types/shared";
import { TracksResponse, validateTracksResponse } from "@/types/top-tracks";
import {
  UserPlayerSeekNewPosition,
  userPlayerSeekNewPositionResponseSchema,
} from "@/types/user-player";
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

export async function fetchTopTracks({
  timeRange = "long_term",
  limit = 10,
  offset = 0,
}: {
  timeRange?: TimeRange;
  limit?: number;
  offset?: number;
}): Promise<TracksResponse> {
  const SPOTIFY_STALKER_API = ENV.NEXT_PUBLIC_SPOTIFY_STALKER_API;

  const endpointUrlParams = new URLSearchParams();

  endpointUrlParams.append("time_range", timeRange);
  endpointUrlParams.append("limit", limit.toString());
  endpointUrlParams.append("offset", offset.toString());

  try {
    const response = await fetch(
      `${SPOTIFY_STALKER_API}/stats/tracks?${endpointUrlParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return validateTracksResponse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
    }
    throw error;
  }
}

export async function mutateUserPlayerMusicPosition(
  userPlayerSeekNewPositionBody: UserPlayerSeekNewPosition
) {
  const SPOTIFY_STALKER_API = ENV.NEXT_PUBLIC_SPOTIFY_STALKER_API;

  try {
    const response = await fetch(`${SPOTIFY_STALKER_API}/user/player/seek`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(userPlayerSeekNewPositionBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return userPlayerSeekNewPositionResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
    }
    throw error;
  }
}
