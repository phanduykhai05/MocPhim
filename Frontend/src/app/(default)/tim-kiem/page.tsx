import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResultsClient />
    </Suspense>
  );
}
