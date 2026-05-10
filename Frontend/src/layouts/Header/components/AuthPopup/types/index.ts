export type AuthMode = "login" | "register";

export interface AuthFormProps {
  onSwitchMode: (mode: AuthMode) => void;
  onClose: () => void;
}

export interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}
