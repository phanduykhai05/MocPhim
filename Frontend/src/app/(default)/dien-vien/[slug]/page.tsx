import { Suspense } from "react";
import ActorDetailClient from "./ActorDetailClient";

export default async function ActorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense>
      <ActorDetailClient slug={slug} />
    </Suspense>
  );
}
