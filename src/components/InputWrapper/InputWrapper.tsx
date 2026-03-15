import React from "react";
import styles from "./InputWrapper.module.scss";
import clsx from "clsx";

interface InputWrapperProps {
  children: React.ReactNode;
  label?: string;
  valid?: boolean;
  className?: string;
}

const InputWrapper = ({
  children,
  label,
  valid,
  className,
}: InputWrapperProps) => {
  return (
    <div className={clsx(styles.inputWrapper, className)} data-valid={valid}>
      {label && <label htmlFor={label + "-inputWrapper"}>{label}</label>}
      {children}
    </div>
  );
};

export default InputWrapper;
