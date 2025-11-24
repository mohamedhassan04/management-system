import React from "react";
import { Select as AntSelect } from "antd";
import styles from "../styles/select.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import { clsx } from "clsx";

interface SelectProps {
  placeholder: string;
  options: { value: string; label: string }[];
  classname?: string;
}

const Select: React.FC<SelectProps> = ({
  placeholder,
  options = [],
  classname,
  ...rest
}) => {
  return (
    <div className={styles["ms--select-wrapper"]}>
      <AntSelect
        showSearch
        allowClear
        placeholder={placeholder}
        options={options}
        className={clsx(styles["ms--select"], classname)}
        suffixIcon={
          <span className={styles["ms--select-icon"]}>
            <IoIosArrowDown size={15} />
          </span>
        }
        {...rest}
      />
    </div>
  );
};

export default Select;
