"use client";

import { Card, CardContent } from "@/components/ui/card";
import { fetchCurrentPlayingMusic } from "@/lib/spotify-stalker-api";
import {
  CurrentPlayingMusicResponse,
  PlayingMusicResponse,
} from "@/types/current-playing-music";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { Music } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProgressBar } from "./progress-bar";

export function NowPlaying() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="p-4 border-b ">
        <h2 className="text-xl font-bold">Now Playing</h2>
      </div>

      <CardContent className="p-6">
        <NowPlayingContent />
      </CardContent>
    </Card>
  );
}

function NowPlayingContent() {
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["now-playing"],
    queryFn: fetchCurrentPlayingMusic,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (isError) {
    console.error(
      `operation='NowPlayingContent', message: 'Failed fetching current playing API', error: '${error}'`
    );
    return (
      <div className="flex justify-center items-center h-64">
        Error happened while fetching ! Please refresh the page
      </div>
    );
  }

  if (!data.isPlaying) {
    return (
      <div className="flex justify-center items-center h-64">
        Eduardo is not listening to any music right now.
      </div>
    );
  }

  const { currentItemPlaying } = data;

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-xs aspect-square mb-6 rounded-md overflow-hidden shadow-lg">
          {currentItemPlaying.album.imageUrl ? (
            <Image
              src={currentItemPlaying.album.imageUrl}
              alt={`${currentItemPlaying.album.name} cover`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music size={48} />
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <a
            target="_blank"
            href={currentItemPlaying.spotifyHref}
            className="group"
          >
            <h3 className="text-xl font-bold mb-1 line-clamp-1 group-hover:underline">
              {currentItemPlaying.name}
            </h3>
          </a>
          <p className="text-zinc-400 mb-1 line-clamp-1">
            {currentItemPlaying.artists.map((a) => a.name).join(" & ")}
          </p>
          <p className="text-zinc-500 text-sm line-clamp-1">
            {currentItemPlaying.album.name}
          </p>
        </div>

        <NowPlayingProgressBar track={data} refetch={refetch} />
      </div>
    </>
  );
}

interface NowPlayingProgressBarProps {
  track: PlayingMusicResponse;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CurrentPlayingMusicResponse>>;
}

function NowPlayingProgressBar({ track, refetch }: NowPlayingProgressBarProps) {
  const [currentTime, setCurrentTime] = useState(
    track.currentItemPlaying.progressMs / 1000
  );
  const duration = track.currentItemPlaying.durationMs / 1000;

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

  return (
    <ProgressBar
      currentTime={currentTime}
      duration={duration}
      className="mt-4 px-2"
    />
  );
}
