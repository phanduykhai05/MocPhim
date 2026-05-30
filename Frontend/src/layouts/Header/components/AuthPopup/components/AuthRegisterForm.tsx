"use client";

import { useState } from "react";
import { AuthFormProps } from "../types";
import { useAuth } from "@/contexts/AuthContext";

const AuthRegisterForm = ({ onSwitchMode }: AuthFormProps) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!agreed) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const msg = await register(email, password, name);
      setSuccessMsg(msg || "Đăng ký thành công! Kiểm tra email để xác thực.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4d4d4d] text-3xl">
            📧
          </div>
          <p className="text-sm leading-relaxed text-[#bec8e6]">{successMsg}</p>
        </div>
        <button
          type="button"
          onClick={() => onSwitchMode("login")}
          className="h-11 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95"
        >
          Về trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Họ và tên"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
          />
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
          />
        </div>
        <input
          type="password"
          placeholder="Mật khẩu"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="block h-11 w-full rounded-lg border border-[#1a1a1a] bg-[#4d4d4d] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-[#8f99bb]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 rounded border-[#40518a]"
        />
        Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
      </label>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>

      <p className="text-center text-sm text-[#8f99bb]">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={() => onSwitchMode("login")}
          className="font-semibold text-[#ffd875] hover:underline"
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
};

export default AuthRegisterForm;
