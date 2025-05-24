import {
  mutatePausePlayer,
  mutateResumePlayer,
  mutateSkipNextMusicPlayer,
  mutateSkipPreviousMusicPlayer,
  mutateUserPlayerMusicPosition,
} from "@/lib/spotify-stalker-api";
import {
  CurrentPlayingMusicResponse,
  PlayingMusicResponse,
} from "@/types/current-playing-music";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { Loader2, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MusicPlayerBar } from "./music-player-bar";
import { Button } from "./ui/button";

export interface MusicPlayerProps {
  track: PlayingMusicResponse;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CurrentPlayingMusicResponse | null>>;
}

export function MusicPlayer({ track, refetch }: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(
    track.currentItemPlaying.progressMs / 1000
  );
  const [isWaitingForSync, setIsWaitingForSync] = useState(false);

  const duration = track.currentItemPlaying.durationMs / 1000;
  const { isPlaying } = track;

  const {
    mutate: seekMutate,
    isPending: isSeekPending,
    isError: isSeekError,
  } = useMutation({
    mutationKey: [track.currentItemPlaying.id, currentTime],
    mutationFn: mutateUserPlayerMusicPosition,
  });

  const { mutate: pauseResumeMutate, isPending: isPauseResumePending } =
    useMutation({
      mutationFn: () => {
        // Force to runtime value, instead of the compiled value
        return isPlaying ? mutatePausePlayer() : mutateResumePlayer();
      },

      onSuccess: () => {
        refetchWithRetry("playState", undefined, isPlaying);
      },
      onError: (error) => {
        console.error("Failed to toggle playback:", error);
        // Force a refetch to ensure we have the correct state
        refetch();
        // TODO Add toast
      },
    });

  const { mutate: nextTrackMutate, isPending: isNextPending } = useMutation({
    mutationFn: mutateSkipNextMusicPlayer,
    onSuccess: () => {
      refetchWithRetry("track", track.currentItemPlaying.id);
    },
  });

  const { mutate: previousTrackMutate, isPending: isPreviousPending } =
    useMutation({
      mutationFn: mutateSkipPreviousMusicPlayer,
      onSuccess: () => {
        refetchWithRetry("track", track.currentItemPlaying.id);
      },
    });

  // Since spotify api, takes sometime to sync, I need to manually retry to have the update data
  const refetchWithRetry = useCallback(
    async (
      expectedChange: "track" | "playState",
      currentTrackId?: string,
      currentPlayState?: boolean,
      maxRetries = 5,
      delay = 800
    ) => {
      setIsWaitingForSync(true);
      let retries = 0;

      while (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));

        try {
          const result = await refetch();

          if (expectedChange === "track") {
            // TODO Refactor BE and here to have the same data while playing or not
            if (!result || !result.data) {
              // User stop playing music
              setIsWaitingForSync(false);
              return result;
            }

            if (result.data?.currentItemPlaying?.id !== currentTrackId) {
              setIsWaitingForSync(false);
              return result;
            }
            return result;
          } else if (expectedChange === "playState") {
            if (result.data?.isPlaying !== currentPlayState) {
              setIsWaitingForSync(false);
              return result;
            }
          }

          retries++;
          delay = Math.min(delay * 1.2, 2000);
        } catch (error) {
          console.warn(`Refetch attempt ${retries + 1} failed:`, error);
          retries++;
        }
      }

      // If all retries failed, do one final refetch and accept the result
      console.warn("Max retries reached, accepting current state");
      setIsWaitingForSync(false);
      return refetch();
    },
    [refetch]
  );

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
  }, [
    track,
    isPlaying,
    duration,
    refetch,
    isPauseResumePending,
    isWaitingForSync,
  ]);

  const handlePauseResume = () => {
    pauseResumeMutate();
  };

  const handleNextTrack = () => {
    nextTrackMutate();
  };

  const handlePreviousTrack = () => {
    previousTrackMutate();
  };

  const isAnyActionPending =
    isSeekPending ||
    isPauseResumePending ||
    isNextPending ||
    isPreviousPending ||
    isWaitingForSync;

  const disabled = isSeekError || isAnyActionPending;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousTrack}
          disabled={isPreviousPending}
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          onClick={handlePauseResume}
          disabled={isPauseResumePending || isWaitingForSync}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPauseResumePending || isWaitingForSync ? (
            <Loader2 className="w-6 h-6" />
          ) : null}

          {isPlaying && !isPauseResumePending && !isWaitingForSync ? (
            <Pause className="w-6 h-6" />
          ) : null}

          {!isPlaying && !isPauseResumePending && !isWaitingForSync ? (
            <Play className="w-6 h-6" />
          ) : null}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextTrack}
          disabled={isNextPending}
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      <MusicPlayerBar
        className="mt-4 px-2"
        currentTime={currentTime}
        duration={duration}
        disabled={disabled}
        onSeek={(newPositionMs: number) => {
          seekMutate({ newPositionMs });
          setCurrentTime(newPositionMs / 1000);
        }}
      />
    </div>
  );
}
