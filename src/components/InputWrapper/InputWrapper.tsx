import React from "react";
import styles from "./InputWrapper.module.scss";

interface InputWrapperProps {
  children: React.ReactNode;
  label?: string;
}

const InputWrapper = ({ children, label }: InputWrapperProps) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label htmlFor={label + "-inputWrapper"}>{label}</label>}
      {children}
    </div>
  );
};

export default InputWrapper;
