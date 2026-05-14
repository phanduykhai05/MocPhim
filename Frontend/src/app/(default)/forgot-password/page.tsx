"use client";

import { useState } from "react";
import Link from "next/link";
import { apiForgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await apiForgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Quên mật khẩu
        </h1>
        <p className="mb-8 text-center text-sm text-[#8f99bb]">
          Nhập email tài khoản để nhận hướng dẫn đặt lại mật khẩu
        </p>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a2146] text-3xl">
                📧
              </div>
              <p className="text-sm leading-relaxed text-[#bec8e6]">
                Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu
                trong vài phút.
              </p>
              <p className="text-xs text-[#8f99bb]">
                Link có hiệu lực trong{" "}
                <span className="text-[#ffd875]">15 phút</span>.
              </p>
            </div>
            <Link
              href="/login"
              className="flex h-11 w-full items-center justify-center rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95"
            >
              Về trang đăng nhập
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email của bạn"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block h-11 w-full rounded-lg border border-[#2c375f] bg-[#1a2146] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
            />

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Đang gửi..." : "Gửi hướng dẫn"}
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
        )}
      </div>
    </div>
  );
}
