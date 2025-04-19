"use client";

import { fetchTopTracks } from "@/lib/spotify-stalker-api";
import { StatsType, TimeRange } from "@/types/shared";
import { useQuery } from "@tanstack/react-query";
import { Music } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function TopStats() {
  const [statsType, setstatsType] = useState<StatsType>("tracks");
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  return (
    <Card className="">
      <div className="p-4 border-b ">
        <h2 className="text-xl font-bold">
          Top {statsType === "artists" ? "Artists" : "Tracks"}
        </h2>
      </div>

      <div className="p-4 border-b ">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Tabs
            defaultValue="tracks"
            onValueChange={(value) => setstatsType(value as StatsType)}
          >
            <TabsList className="">
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="artists" disabled>
                Artists
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            defaultValue="medium_term"
            onValueChange={(value) => setTimeRange(value as TimeRange)}
          >
            <TabsList>
              <TabsTrigger value="short_term" className="text-xs sm:text-sm">
                4 Weeks
              </TabsTrigger>
              <TabsTrigger value="medium_term" className="text-xs sm:text-sm">
                6 Months
              </TabsTrigger>
              <TabsTrigger value="long_term" className="text-xs sm:text-sm">
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <CardContent className="p-4">
        <TopStatsContent statsType={statsType} timeRange={timeRange} />
      </CardContent>
    </Card>
  );
}

interface TopStatsContentProps {
  statsType: StatsType;
  timeRange: TimeRange;
}

function TopStatsContent({ statsType, timeRange }: TopStatsContentProps) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [statsType, timeRange],
    queryFn: async () =>
      await fetchTopTracks({
        timeRange,
        offset: 0,
        limit: 10,
      }),
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
      `operation='TopStatsContent', message: 'Failed fetching top stats API', error: '${error}'`
    );
    return (
      <div className="flex justify-center items-center h-64">
        Error happened while fetching ! Please refresh the page
      </div>
    );
  }

  if (data?.tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
        <Music size={48} className="mb-4" />
        <p className="text-lg">No data available</p>
      </div>
    );
  }

  const { tracks } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tracks.map((track) => (
        <a
          key={track.id}
          href={track.spotifyUrl}
          target="_blank"
          className="group"
        >
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 transition-colors">
            <div className="flex-shrink-0 font-bold text-zinc-500 w-6 text-right">
              {track.userRank}
            </div>

            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              {track?.album?.imageUrl !== "" ? (
                <Image
                  src={track.album.imageUrl}
                  alt={track.album.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={24} className="text-zinc-500" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium truncate group-hover:underline">
                {track.name}
              </p>
              {statsType === "tracks" && (
                <p className="text-sm text-zinc-400 truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
