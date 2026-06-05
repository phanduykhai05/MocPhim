"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiVerifyEmail } from "@/lib/api/auth";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Link xác nhận không hợp lệ.");
      return;
    }

    apiVerifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.replace("/login?verified=1"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
        if (msg.includes("expired") || msg.includes("hết hạn")) {
          setMessage("Link xác nhận đã hết hạn (24 giờ). Vui lòng đăng ký lại.");
        } else {
          setMessage("Link xác nhận không hợp lệ hoặc đã được sử dụng.");
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-sm text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#ffd875] border-t-transparent" />
            <p className="text-[#8f99bb]">Đang xác nhận email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-4xl">
              ✓
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Xác nhận thành công!</h1>
            <p className="mb-6 text-[#8f99bb]">
              Email của bạn đã được xác nhận. Đang chuyển đến trang đăng nhập...
            </p>
            <Link
              href="/login"
              className="inline-block rounded-lg bg-[#ffd875] px-6 py-2.5 text-sm font-bold text-[#121931] hover:brightness-95"
            >
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30 text-4xl text-red-400">
              ✕
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Xác nhận thất bại</h1>
            <p className="mb-6 text-[#8f99bb]">{message}</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-[#ffd875] px-6 py-2.5 text-sm font-bold text-[#121931] hover:brightness-95"
              >
                Về trang đăng nhập
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
