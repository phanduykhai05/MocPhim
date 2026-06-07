"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiResetPassword } from "@/lib/api/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/forgot-password");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!token) return;

    setError("");
    setIsLoading(true);
    try {
      await apiResetPassword(token, newPassword);
      router.replace("/login?reset=success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      if (msg.includes("hết hạn")) {
        setError(
          "Link đã hết hạn (15 phút). Vui lòng yêu cầu đặt lại mật khẩu mới.",
        );
      } else {
        setError("Link không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ffd875] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Đặt lại mật khẩu
        </h1>
        <p className="mb-8 text-center text-sm text-[#8f99bb]">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
          />

          {error && (
            <div className="rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3 text-xs text-red-400">
              {error}
              {(error.includes("hết hạn") ||
                error.includes("không hợp lệ")) && (
                <span>
                  {" "}
                  <Link
                    href="/forgot-password"
                    className="underline hover:text-red-300"
                  >
                    Yêu cầu lại tại đây.
                  </Link>
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-[#8f99bb] transition hover:text-white"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
