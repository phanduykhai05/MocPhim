export type AuthMode = "login" | "register";

export interface AuthFormProps {
  onSwitchMode: (mode: AuthMode) => void;
}

export interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}
