import { Suspense } from "react";
import CountryMoviesClient from "./CountryMoviesClient";

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense>
      <CountryMoviesClient slug={slug} />
    </Suspense>
  );
}
