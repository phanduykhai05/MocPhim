"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthFormProps } from "../types";
import { Google } from "@/components/icon/gg";
import { useAuth } from "@/contexts/AuthContext";
import { AUTH_BASE_URL } from "@/constants";
import { App } from "antd";

const AuthLoginForm = ({ onSwitchMode, onClose }: AuthFormProps) => {
  const { login } = useAuth();
  const { message } = App.useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      message.success("Đăng nhập thành công!");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_BASE_URL}/oauth2/authorize/google`;
  };

  const handleForgotPassword = () => {
    onClose();
    router.push("/forgot-password");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
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
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="h-11 mt-4 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <button
        type="button"
        onClick={handleForgotPassword}
        className="w-full text-center text-sm font-medium text-[#bec8e6] transition hover:text-white"
      >
        Quên mật khẩu?
      </button>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex mt-4 h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#1a1a1a] bg-[#5a5d69] text-sm font-semibold text-white transition hover:bg-[#4d4d4d]"
      >
        <Google className="h-4 w-4 shrink-0" />
        Đăng nhập bằng Google
      </button>

      <p className="text-center text-sm text-[#8f99bb]">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={() => onSwitchMode("register")}
          className="font-semibold text-[#ffd875] hover:underline"
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
};

export default AuthLoginForm;
