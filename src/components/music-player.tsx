import { mutateUserPlayerMusicPosition } from "@/lib/spotify-stalker-api";
import {
  CurrentPlayingMusicResponse,
  PlayingMusicResponse,
} from "@/types/current-playing-music";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MusicPlayerBar } from "./music-player-bar";

export interface MusicPlayerProps {
  track: PlayingMusicResponse;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CurrentPlayingMusicResponse>>;
}

export function MusicPlayer({ track, refetch }: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(
    track.currentItemPlaying.progressMs / 1000
  );
  const duration = track.currentItemPlaying.durationMs / 1000;

  const { mutate, isPending, isError } = useMutation({
    mutationKey: [track.currentItemPlaying.id, currentTime],
    mutationFn: mutateUserPlayerMusicPosition,
  });

  const { isPlaying } = track;

  useEffect(() => {
    setCurrentTime(track.currentItemPlaying.progressMs / 1000);

    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          clearInterval(interval);
          // Refetch new music when current track ends.
          refetch();
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [track, isPlaying, duration, refetch]);

  const disabled = isError || isPending;

  return (
    <MusicPlayerBar
      className="mt-4 px-2"
      currentTime={currentTime}
      duration={duration}
      disabled={disabled}
      onSeek={(newPositionMs: number) => {
        mutate({ newPositionMs });
        setCurrentTime(newPositionMs / 1000);
      }}
    />
  );
}
