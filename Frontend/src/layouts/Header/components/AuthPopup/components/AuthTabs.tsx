import { motion } from "motion/react";
import { AuthMode } from "../types";

interface AuthTabsProps {
  mode: AuthMode;
  onChangeMode: (mode: AuthMode) => void;
}

const TABS: { key: AuthMode; label: string }[] = [
  { key: "login",    label: "Đăng nhập" },
  { key: "register", label: "Đăng ký"   },
];

const AuthTabs = ({ mode, onChangeMode }: AuthTabsProps) => {
  return (
    <div className="relative grid grid-cols-2 rounded-xl bg-[#656565] p-1">
      {/* Sliding pill — moves by 100% of own width (= one column) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-[#ffd875]"
        animate={{ x: mode === "register" ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 420, damping: 36 }}
      />

      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChangeMode(key)}
          className={`relative z-10 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            mode === key ? "text-black" : "text-white/60 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;
