import { Suspense } from "react";
import MoviesByListClient from "@/app/(default)/components/MoviesByListClient";

export default async function PhimLePage() {
  return (
    <Suspense>
      <MoviesByListClient listKey="phim-le" title="Phim Lẻ" routeBase="/phim-le" />
    </Suspense>
  );
}
