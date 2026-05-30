"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AUTH_BASE_URL } from "@/constants";
import { Google } from "@/components/icon/gg";

function LoginContent() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");
    const errorParam = searchParams.get("error");

    if (verified === "true") {
      setSuccessMsg("Xác thực email thành công! Vui lòng đăng nhập.");
    } else if (reset === "success") {
      setSuccessMsg("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
    } else if (errorParam) {
      const decoded = decodeURIComponent(errorParam);
      if (decoded === "email_conflict") {
        setError(
          "Email này đã đăng ký theo cách khác, vui lòng đăng nhập bằng email/mật khẩu.",
        );
      } else {
        setError(decoded);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_BASE_URL}/oauth2/authorize/google`;
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ffd875] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-white">
          Đăng nhập
        </h1>

        {successMsg && (
          <div className="mb-5 rounded-lg border border-green-700/50 bg-green-900/20 px-4 py-3 text-sm text-green-400">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-11 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#bec8e6] transition hover:text-white"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1a1a1a]" />
          <span className="text-xs text-[#8f99bb]">hoặc</span>
          <div className="h-px flex-1 bg-[#1a1a1a]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1a1a1a] bg-[#5a5d69] text-sm font-semibold text-white transition hover:bg-[#4d4d4d]"
        >
          <Google className="h-4 w-4 shrink-0" />
          Đăng nhập bằng Google
        </button>

        <p className="mt-6 text-center text-sm text-[#8f99bb]">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#ffd875] hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
