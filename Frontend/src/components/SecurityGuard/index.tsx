"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_SECURITY_SETTINGS,
  loadSecuritySettings,
  SECURITY_SETTINGS_EVENT,
  type SecuritySettings,
} from "@/lib/security-settings";

function isBlockedShortcut(event: KeyboardEvent, settings: SecuritySettings): boolean {
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
  const [settings, setSettings] = useState<SecuritySettings>(DEFAULT_SECURITY_SETTINGS);

  const isAdminRoute = useMemo(() => pathname?.startsWith("/admin"), [pathname]);

  useEffect(() => {
    setSettings(loadSecuritySettings());

    const syncSettings = () => setSettings(loadSecuritySettings());
    window.addEventListener(SECURITY_SETTINGS_EVENT, syncSettings);
    window.addEventListener("storage", syncSettings);

    return () => {
      window.removeEventListener(SECURITY_SETTINGS_EVENT, syncSettings);
      window.removeEventListener("storage", syncSettings);
    };
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
        // Ignore cross-origin frame busting errors.
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
