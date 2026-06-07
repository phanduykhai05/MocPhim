"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiGetResumePoint } from "@/lib/api/progress";

interface ResumeRedirectProps {
  slug: string;
  server: number;
  hasTapParam: boolean; // true nếu URL đã có ?tap=X
}

export default function ResumeRedirect({ slug, server, hasTapParam }: ResumeRedirectProps) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (hasTapParam || !user) return;

    apiGetResumePoint(user.id, slug).then((progress) => {
      if (progress && progress.episodeNumber > 1) {
        router.replace(`/xem-phim/${slug}?tap=${progress.episodeNumber}&sv=${server}`);
      }
    });
  }, [user, slug, server, hasTapParam, router]);

  return null;
}
