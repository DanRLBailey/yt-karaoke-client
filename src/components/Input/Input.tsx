import { useRef } from "react";
import styles from "./Input.module.scss";

interface InputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onButtonPress?: () => void;
  enterKeyHint?:
    | "search"
    | "enter"
    | "done"
    | "go"
    | "next"
    | "previous"
    | "send"
    | undefined;
  enterKeyText?: string;
}

const capitalizeFirst = (value: string): string => {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
};

const Input = ({
  value,
  onChange,
  placeholder,
  onKeyDown,
  onButtonPress,
  enterKeyHint,
  enterKeyText,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getEnterKeyByHint = () => {
    switch (enterKeyHint) {
      case "search":
        return "Q";
      default:
        return capitalizeFirst(enterKeyHint as string);
    }
  };

  return (
    <div className={styles.input}>
      <input
        ref={inputRef}
        onChange={(e) => onChange?.(e)}
        value={value}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        enterKeyHint={enterKeyHint}
      />
      <button className={styles.searchButton} onClick={() => onButtonPress?.()}>
        {enterKeyText ?? getEnterKeyByHint()}
      </button>
    </div>
  );
};

export default Input;
