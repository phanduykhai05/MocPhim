"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (error === "email_conflict") {
      router.replace("/?auth_error=email_conflict");
      return;
    }

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }

    router.replace("/");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050918] text-white">
      <p className="text-sm text-[#8f99bb]">Đang xử lý đăng nhập...</p>
    </div>
  );
}
