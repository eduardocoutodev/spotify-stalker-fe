"use client";

import { Card, CardContent } from "@/components/ui/card";
import { fetchCurrentPlayingMusic } from "@/lib/spotify-stalker-api";
import { CurrentPlayingMusicResponse } from "@/types/current-playing-music";
import { useQuery } from "@tanstack/react-query";
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
  const { isPending, isError, data, error } = useQuery({
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

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-xs aspect-square mb-6 rounded-md overflow-hidden shadow-lg">
          {data.currentItemPlaying.album.imageUrl ? (
            <Image
              src={data.currentItemPlaying.album.imageUrl}
              alt={`${data.currentItemPlaying.album.name} cover`}
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
            href={data.currentItemPlaying.spotifyHref}
            className="group"
          >
            <h3 className="text-xl font-bold mb-1 line-clamp-1 group-hover:underline">
              {data.currentItemPlaying.name}
            </h3>
          </a>
          <p className="text-zinc-400 mb-1 line-clamp-1">
            {data.currentItemPlaying.artists.map((a) => a.name).join(" & ")}
          </p>
          <p className="text-zinc-500 text-sm line-clamp-1">
            {data.currentItemPlaying.album.name}
          </p>
        </div>

        <NowPlayingProgressBar track={data} />
      </div>
    </>
  );
}

interface NowPlayingProgressBarProps {
  track: CurrentPlayingMusicResponse;
}

function NowPlayingProgressBar({ track }: NowPlayingProgressBarProps) {
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
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [track, isPlaying, duration]);

  return (
    <ProgressBar
      currentTime={currentTime}
      duration={duration}
      className="mt-4 px-2"
    />
  );
}
