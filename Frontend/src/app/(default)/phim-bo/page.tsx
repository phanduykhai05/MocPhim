import { Suspense } from "react";
import MoviesByListClient from "@/app/(default)/components/MoviesByListClient";

export default async function PhimBoPage() {
  return (
    <Suspense>
      <MoviesByListClient listKey="phim-bo" title="Phim Bộ" routeBase="/phim-bo" />
    </Suspense>
  );
}
