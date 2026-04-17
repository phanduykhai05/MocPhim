import { motion } from "motion/react";
import { AuthMode } from "../types";

interface AuthTabsProps {
  mode: AuthMode;
  onChangeMode: (mode: AuthMode) => void;
}

const AuthTabs = ({ mode, onChangeMode }: AuthTabsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#101733] p-1">
      <motion.button
        type="button"
        onClick={() => onChangeMode("login")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          mode === "login" ? "text-[#101733]" : "text-[#8f99bb] hover:text-white"
        }`}
        animate={{
          backgroundColor: mode === "login" ? "#ffd875" : "rgba(0,0,0,0)",
        }}
      >
        Đăng nhập
      </motion.button>

      <motion.button
        type="button"
        onClick={() => onChangeMode("register")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          mode === "register" ? "text-[#101733]" : "text-[#8f99bb] hover:text-white"
        }`}
        animate={{
          backgroundColor: mode === "register" ? "#ffd875" : "rgba(0,0,0,0)",
        }}
      >
        Đăng ký
      </motion.button>
    </div>
  );
};

export default AuthTabs;
