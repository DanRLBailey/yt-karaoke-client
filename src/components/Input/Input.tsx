import { useEffect, useRef, useState } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import InputWrapper from "../InputWrapper/InputWrapper";

interface InputProps {
  value: string;
  onChange?: (val: string) => void;
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
  validation?: (val: string) => boolean;
  onValidChange?: (valid: boolean) => void;
  showRemoveButton?: boolean;
  searchDisabled?: boolean;
  charLimit?: number;
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
  validation,
  onValidChange,
  showRemoveButton,
  searchDisabled,
  charLimit,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [valid, setValid] = useState<boolean>(validation === undefined);

  const getEnterKeyByHint = () => {
    switch (enterKeyHint) {
      case "search":
        return <IconSearch />;
      default:
        return capitalizeFirst(enterKeyHint as string);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchDisabled) return;

    if (enterKeyHint === "search" && e.key === "Enter") {
      inputRef.current?.blur();
    }
    onKeyDown?.(e);
  };

  const onValueChange = (val: string) => {
    let newVal = val;
    if (charLimit && newVal.length > charLimit)
      newVal = newVal.slice(0, charLimit);

    onChange?.(newVal);
    setValid(validation?.(newVal) ?? true);
  };

  useEffect(() => {
    onValidChange?.(valid);
  }, [valid]);

  useEffect(() => {
    onValueChange(value);
  }, [value]);

  return (
    <InputWrapper label={label} valid={valid}>
      <input
        ref={inputRef}
        id={label + "-input"}
        onChange={(e) => onValueChange(e.target.value)}
        value={value}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        enterKeyHint={enterKeyHint}
      />
      {value != "" && showRemoveButton && (
        <button onClick={() => onChange?.("")}>
          <IconX />
        </button>
      )}
      {(onButtonPress || enterKeyHint) && (
        <button
          onClick={() => {
            inputRef.current?.blur();
            onButtonPress?.();
          }}
          disabled={searchDisabled}
        >
          {enterKeyText ?? getEnterKeyByHint()}
        </button>
      )}
    </InputWrapper>
  );
};

export default Input;
