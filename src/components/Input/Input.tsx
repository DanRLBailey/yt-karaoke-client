import { useRef } from "react";
import { IconSearch } from "@tabler/icons-react";
import InputWrapper from "../InputWrapper/InputWrapper";

interface InputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  label?: string;
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
  label,
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
        return <IconSearch />;
      default:
        return capitalizeFirst(enterKeyHint as string);
    }
  };

  return (
    <InputWrapper label={label}>
      <input
        ref={inputRef}
        id={label + "-input"}
        onChange={(e) => onChange?.(e)}
        value={value}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        enterKeyHint={enterKeyHint}
      />
      {(onButtonPress || enterKeyHint) && (
        <button onClick={() => onButtonPress?.()}>
          {enterKeyText ?? getEnterKeyByHint()}
        </button>
      )}
    </InputWrapper>
  );
};

export default Input;
