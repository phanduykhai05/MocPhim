import { AuthFormProps } from "../types";

const AuthRegisterForm = ({ onSwitchMode }: AuthFormProps) => {
  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Họ và tên"
          autoComplete="name"
          className="block h-11 w-full rounded-lg border border-[#2c375f] bg-[#1a2146] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="block h-11 w-full rounded-lg border border-[#2c375f] bg-[#1a2146] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          autoComplete="new-password"
          className="block h-11 w-full rounded-lg border border-[#2c375f] bg-[#1a2146] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          className="block h-11 w-full rounded-lg border border-[#2c375f] bg-[#1a2146] px-4 text-sm text-white outline-none transition focus:border-[#ffd875]"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-[#8f99bb]">
        <input type="checkbox" className="mt-0.5 rounded border-[#40518a]" />
        Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
      </label>

      <button
        type="submit"
        className="h-11 w-full rounded-lg bg-[#ffd875] text-sm font-bold text-[#121931] transition hover:brightness-95"
      >
        Tạo tài khoản
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
