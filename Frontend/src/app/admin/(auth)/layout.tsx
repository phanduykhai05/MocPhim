"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.roles.includes("ROLE_ADMIN")) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, user, router]);

  return <>{children}</>;
}
