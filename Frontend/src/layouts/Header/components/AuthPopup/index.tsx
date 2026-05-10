"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import AuthLoginForm from "./components/AuthLoginForm";
import AuthRegisterForm from "./components/AuthRegisterForm";
import AuthTabs from "./components/AuthTabs";
import { AuthMode, AuthPopupProps } from "./types";

const AuthPopup = ({ isOpen, onClose }: AuthPopupProps) => {
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] bg-[#050918]/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-4 mt-[80px] md:mt-[100px] lg:mt-[120px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-[#22305d] bg-[#171f45] shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:mx-auto md:max-w-[760px]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div className="relative hidden min-h-[500px] overflow-hidden rounded-l-2xl md:block">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,216,117,0.22),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(87,115,255,0.28),transparent_42%),linear-gradient(160deg,#0d1433_0%,#141d43_55%,#0b132f_100%)]" />
                <div className="absolute inset-0 opacity-40 [background:linear-gradient(110deg,transparent_0%,transparent_47%,rgba(255,255,255,0.08)_50%,transparent_53%,transparent_100%)]" />
                <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ffd875]">
                    MocPhim
                  </p>
                  <h3 className="text-2xl font-semibold leading-tight">
                    Kho phim chất lượng cao, cập nhật mỗi ngày.
                  </h3>
                  <p className="mt-3 text-sm text-[#b5c0e7]">
                    Đăng nhập để đồng bộ danh sách yêu thích và tiếp tục xem trên mọi thiết bị.
                  </p>
                </div>
              </div>

              <div className="relative p-5 text-white md:p-8">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng cửa sổ đăng nhập"
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#c8d0ee] transition hover:bg-[#22305d] hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                    width="13"
                    height="13"
                    fill="currentColor"
                  >
                    <path d="M312.1 375c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 335.9l-95.6 95.6c-9.4 9.4-24.6 9.4-33.9 0L7.9 408.9c-9.4-9.4-9.4-24.6 0-33.9l95.6-95.6-95.6-95.6c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l95.6 95.6 95.6-95.6c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-95.6 95.6 95.6 95.6z" />
                  </svg>
                </button>

                <h2 className="mt-2 text-3xl font-semibold">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</h2>
                <p className="mt-2 text-sm text-[#96a2ca]">
                  {mode === "login" ? "Nếu bạn chưa có tài khoản, " : "Đã có tài khoản, "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    className="font-semibold text-[#ffd875] hover:underline"
                  >
                    {mode === "login" ? "đăng ký ngay" : "đăng nhập ngay"}
                  </button>
                </p>

                <div className="mt-5">
                  <AuthTabs mode={mode} onChangeMode={setMode} />
                </div>

                <div className="mt-5">
                  {mode === "login" ? (
                    <AuthLoginForm onSwitchMode={setMode} onClose={onClose} />
                  ) : (
                    <AuthRegisterForm onSwitchMode={setMode} onClose={onClose} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthPopup;
