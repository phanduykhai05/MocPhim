export const SECURITY_SETTINGS_STORAGE_KEY = "mocphim_security_settings";
export const SECURITY_SETTINGS_EVENT = "mocphim:security-settings-updated";

export type SecuritySettings = {
  enableClientProtection: boolean;
  blockDevToolsKeyShortcuts: boolean;
  blockContextMenu: boolean;
  blockViewSourceShortcut: boolean;
  blockCopySelection: boolean;
  blockPrintShortcut: boolean;
  blockSaveShortcut: boolean;
  blurWhenTabHidden: boolean;
  frameBustProtection: boolean;
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  enableClientProtection: true,
  blockDevToolsKeyShortcuts: true,
  blockContextMenu: true,
  blockViewSourceShortcut: true,
  blockCopySelection: false,
  blockPrintShortcut: false,
  blockSaveShortcut: false,
  blurWhenTabHidden: false,
  frameBustProtection: true,
};

export function loadSecuritySettings(): SecuritySettings {
  if (typeof window === "undefined") {
    return DEFAULT_SECURITY_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(SECURITY_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SECURITY_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<SecuritySettings>;
    return { ...DEFAULT_SECURITY_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SECURITY_SETTINGS;
  }
}

export function saveSecuritySettings(settings: Partial<SecuritySettings>): SecuritySettings {
  if (typeof window === "undefined") {
    return { ...DEFAULT_SECURITY_SETTINGS, ...settings };
  }

  const next = { ...loadSecuritySettings(), ...settings };
  window.localStorage.setItem(SECURITY_SETTINGS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(SECURITY_SETTINGS_EVENT, { detail: next }));
  return next;
}
