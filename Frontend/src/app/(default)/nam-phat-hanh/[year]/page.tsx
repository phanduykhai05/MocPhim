import { Suspense } from "react";
import YearMoviesClient from "./YearMoviesClient";

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  return (
    <Suspense>
      <YearMoviesClient year={year} />
    </Suspense>
  );
}
