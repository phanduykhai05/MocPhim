export default function MovieDetailLoading() {
  return (
    <div className="min-h-screen bg-[#191b24] animate-pulse">
      {/* Banner skeleton */}
      <div className="w-full h-[420px] bg-white/5" />
      <div className="mx-auto max-w-[1400px] px-5 py-8 flex gap-8">
        <div className="w-[220px] shrink-0 h-[330px] rounded-xl bg-white/5" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-10 w-2/3 rounded bg-white/5" />
          <div className="h-5 w-1/3 rounded bg-white/5" />
          <div className="h-24 rounded bg-white/5" />
          <div className="h-12 w-48 rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
