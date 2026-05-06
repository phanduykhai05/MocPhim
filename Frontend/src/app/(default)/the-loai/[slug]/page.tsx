import { Suspense } from "react";
import CategoryMoviesClient from "./CategoryMoviesClient";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense>
      <CategoryMoviesClient slug={slug} />
    </Suspense>
  );
}
