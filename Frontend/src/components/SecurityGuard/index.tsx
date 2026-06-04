"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_SECURITY_SETTINGS,
  loadSecuritySettings,
  saveSecuritySettings,
  SECURITY_SETTINGS_EVENT,
  type SecuritySettings,
} from "@/lib/security-settings";

const PUBLIC_SETTINGS_URL = `${process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:8080"}/api/v1/security/client-settings`;
// Revalidate every 60s to pick up admin changes across browsers
const POLL_INTERVAL_MS = 60_000;

async function fetchRemoteSettings(): Promise<Partial<SecuritySettings> | null> {
  try {
    const res = await fetch(PUBLIC_SETTINGS_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.status) return null;
    return json.data as Partial<SecuritySettings>;
  } catch {
    return null;
  }
}

function isBlockedShortcut(event: KeyboardEvent, settings: SecuritySettings): boolean {
  if (!event.key) return false;
  const key = event.key.toLowerCase();
  const ctrlOrMeta = event.ctrlKey || event.metaKey;

  if (settings.blockDevToolsKeyShortcuts) {
    if (event.key === "F12") return true;
    if (event.ctrlKey && event.shiftKey && ["i", "j", "c", "k"].includes(key)) return true;
  }

  if (settings.blockViewSourceShortcut && ctrlOrMeta && key === "u") return true;
  if (settings.blockPrintShortcut && ctrlOrMeta && key === "p") return true;
  if (settings.blockSaveShortcut && ctrlOrMeta && key === "s") return true;

  return false;
}

export default function SecurityGuard() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SecuritySettings>(() => loadSecuritySettings());
  const isAdminRoute = useMemo(() => pathname?.startsWith("/admin"), [pathname]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from backend and sync to localStorage so other logic stays intact
  async function syncFromBackend() {
    const remote = await fetchRemoteSettings();
    if (!remote) return;
    const merged = saveSecuritySettings(remote); // merges + persists + dispatches event
    setSettings(merged);
  }

  useEffect(() => {
    // Fetch immediately on mount
    syncFromBackend();

    // Poll every 5 minutes to catch changes made from other browsers/devices
    pollRef.current = setInterval(syncFromBackend, POLL_INTERVAL_MS);

    // Also react to local changes (same-tab admin saves)
    const onLocalChange = () => setSettings(loadSecuritySettings());
    window.addEventListener(SECURITY_SETTINGS_EVENT, onLocalChange);
    window.addEventListener("storage", onLocalChange);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      window.removeEventListener(SECURITY_SETTINGS_EVENT, onLocalChange);
      window.removeEventListener("storage", onLocalChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAdminRoute || !settings.enableClientProtection) {
      document.body.style.filter = "";
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isBlockedShortcut(event, settings)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      if (!settings.blockContextMenu) return;
      event.preventDefault();
    };

    const onCopyLikeAction = (event: Event) => {
      if (!settings.blockCopySelection) return;
      event.preventDefault();
    };

    const onVisibilityChange = () => {
      if (!settings.blurWhenTabHidden) {
        document.body.style.filter = "";
        return;
      }
      document.body.style.filter = document.hidden ? "blur(6px)" : "";
    };

    if (settings.frameBustProtection) {
      try {
        if (window.top && window.top !== window.self) {
          window.top.location.href = window.location.href;
        }
      } catch {
        // ignore cross-origin errors
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("copy", onCopyLikeAction, true);
    document.addEventListener("cut", onCopyLikeAction, true);
    document.addEventListener("selectstart", onCopyLikeAction, true);
    document.addEventListener("dragstart", onCopyLikeAction, true);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("copy", onCopyLikeAction, true);
      document.removeEventListener("cut", onCopyLikeAction, true);
      document.removeEventListener("selectstart", onCopyLikeAction, true);
      document.removeEventListener("dragstart", onCopyLikeAction, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.body.style.filter = "";
    };
  }, [settings, isAdminRoute]);

  return null;
}
