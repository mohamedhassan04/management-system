import React from "react";
import { Input as AntInput } from "antd";
import type { InputProps } from "antd";
import clsx from "clsx";
import styles from "../styles/input.module.scss";

interface CustomInputProps extends InputProps {
  type?: "text" | "email" | "password";
  className?: string;
  suffix?: React.ReactNode;
}

const Input: React.FC<CustomInputProps> = ({
  type = "text",
  className,
  suffix,
  ...rest
}) => {
  return (
    <div className={clsx(styles["ms--input-wrapper"])}>
      {type === "password" ? (
        <AntInput.Password
          {...rest}
          className={clsx(styles["ms--input-field"], className)}
        />
      ) : (
        <AntInput
          {...rest}
          type={type}
          prefix={suffix}
          className={clsx(styles["ms--input-field"], className)}
        />
      )}
    </div>
  );
};

export default Input;
