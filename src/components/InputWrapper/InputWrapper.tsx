import React from "react";
import styles from "./InputWrapper.module.scss";

interface InputWrapperProps {
  children: React.ReactNode;
  label?: string;
  valid?: boolean;
}

const InputWrapper = ({ children, label, valid }: InputWrapperProps) => {
  return (
    <div className={styles.inputWrapper} data-valid={valid}>
      {label && <label htmlFor={label + "-inputWrapper"}>{label}</label>}
      {children}
    </div>
  );
};

export default InputWrapper;
