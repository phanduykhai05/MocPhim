import { Suspense } from "react";
import FullMoviesClient from "@/app/(default)/phimmoi/full-movies/FullMoviesClient";

export default function FullMoviesPage() {
  return (
    <Suspense>
      <FullMoviesClient />
    </Suspense>
  );
}
