import { NowPlaying } from "@/components/now-playing";
import TopStats from "@/components/top-stats";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-2 lg:px-4 py-2 space-y-4 w-full">
        <h1 className="text-3xl font-bold flex items-center">
          Eduardo Spotify Stalker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 w-full">
            <NowPlaying />
          </div>
          <div className="md:col-span-2">
            <TopStats />
          </div>
        </div>
      </div>
    </main>
  );
}
