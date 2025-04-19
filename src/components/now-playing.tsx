"use client";

import { Card, CardContent } from "@/components/ui/card";
import { fetchCurrentPlayingMusic } from "@/lib/spotify-stalker-api";
import { useQuery } from "@tanstack/react-query";
import { Music } from "lucide-react";
import Image from "next/image";

export function NowPlaying() {
  return (
    <Card className="bg-zinc-800 border-zinc-700 overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
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
            <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
              <Music size={48} className="text-zinc-500" />
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-1 line-clamp-1">
            {data.currentItemPlaying.name}
          </h3>
          <p className="text-zinc-400 mb-1 line-clamp-1">
            {data.currentItemPlaying.artists.map((a) => a.name).join(" & ")}
          </p>
          <p className="text-zinc-500 text-sm line-clamp-1">
            {data.currentItemPlaying.album.name}
          </p>
        </div>
      </div>
    </>
  );
}
