import React, { type ReactNode } from "react";
import { Button as AntButton } from "antd";
import styles from "../styles/button.module.scss";
import clsx from "clsx";

interface ButtonProps {
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  iconPosition = "start",
  onClick,
  type = "button",
  className,
  loading,
  disabled,
  children,
}) => {
  return (
    <AntButton
      type="default"
      onClick={onClick}
      htmlType={type}
      disabled={disabled}
      loading={loading}
      icon={icon}
      iconPosition={iconPosition}
      className={clsx(styles["ms--button-container"], className)}
    >
      {children}
    </AntButton>
  );
};

export default Button;
