export default function WatchMovieLoading() {
  return (
    <div className="min-h-screen bg-[#191b24] pb-12 pt-5 lg:pt-30 animate-pulse">
      <div className="mx-auto w-full max-w-[1640px] px-5">
        {/* Video player skeleton */}
        <div className="w-full aspect-video bg-white/5 rounded-xl mb-4" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_450px] lg:gap-6">
          <div className="flex flex-col gap-4">
            <div className="h-32 rounded-xl bg-white/5" />
            <div className="h-20 rounded-xl bg-white/5" />
            <div className="h-40 rounded-xl bg-white/5" />
          </div>
          <div className="h-96 rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
