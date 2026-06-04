"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  apiGetMe,
  apiLogin,
  apiLogout,
  apiRefreshToken,
  apiRegister,
  type AuthTokens,
  type AuthUser,
} from "@/lib/api/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_EXPIRY_KEY = "tokenExpiry";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  /** Trả về message xác nhận gửi email — không tự đăng nhập */
  register: (email: string, password: string, name: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function saveTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  // expiresIn là milliseconds (1800000 = 30 phút), trừ 30s buffer
  const expiry = Date.now() + tokens.expiresIn - 30_000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

function isAccessTokenValid(): boolean {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return false;
  return Date.now() < parseInt(expiry, 10);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!accessToken && !refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        if (accessToken && isAccessTokenValid()) {
          const me = await apiGetMe(accessToken);
          setUser(me);
        } else if (refreshToken) {
          const tokens = await apiRefreshToken(refreshToken);
          saveTokens(tokens);
          const me = await apiGetMe(tokens.accessToken);
          setUser(me);
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Lắng nghe sự kiện auth:unauthorized được phát từ bất kỳ API call nào nhận 401
  useEffect(() => {
    function handleUnauthorized() {
      clearTokens();
      setUser(null);
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  // Poll mỗi 30 giây để kiểm tra tài khoản có bị khoá không
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) return;
      try {
        await apiGetMe(token);
      } catch {
        clearTokens();
        setUser(null);
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      const tokens = await apiLogin(email, password);
      saveTokens(tokens);
      const me = await apiGetMe(tokens.accessToken);
      setUser(me);
      return me;
    },
    [],
  );

  const register = useCallback(
    (email: string, password: string, name: string): Promise<string> =>
      apiRegister(email, password, name),
    [],
  );

  const logout = useCallback(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;
    void apiLogout(token);
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng trong AuthProvider");
  return ctx;
}
