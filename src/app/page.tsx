export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          Spotify Stalker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1"></div>
          <div className="lg:col-span-2"></div>
        </div>
      </div>
    </main>
  );
}
