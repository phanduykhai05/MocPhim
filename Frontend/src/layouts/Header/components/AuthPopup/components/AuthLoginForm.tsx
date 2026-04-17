import { AuthFormProps } from "../types";
import { Google } from "@/components/icon/gg";
const AuthLoginForm = ({ onSwitchMode }: AuthFormProps) => {
  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="block h-11 w-full rounded-lg border border-[#2c375f] bg-[#1a2146] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          autoComplete="current-password"
          className="block h-11 w-full rounded-lg border border-[#2c375f] bg-[#1a2146] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
      </div>

      <button
        type="submit"
        className="h-11 mt-4 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95"
      >
        Đăng nhập
      </button>

      <button
        type="button"
        className="w-full text-center text-sm font-medium text-[#bec8e6] transition hover:text-white"
      >
        Quên mật khẩu?
      </button>

      <button
        type="button"
        className="flex mt-4 h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#2c375f] bg-[#121938] text-sm font-semibold text-white transition hover:bg-[#1a2146]"
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
